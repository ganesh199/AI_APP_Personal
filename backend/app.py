#!/usr/bin/env python3
"""
Multi-LLM Chat Backend Server using FastAPI
Provides API endpoints for multiple LLM providers
"""
import os
import json
import asyncio
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import requests
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Multi-LLM Chat API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global storage for configurations and chat sessions
llm_configs = {}  # Store by provider_key instead of session_id
chat_sessions = {}
provider_configs = {}  # Store multiple provider configurations

# Define LLM providers configuration
LLM_PROVIDERS = {
    "OpenAI": {
        "api_key": True,
        "base_url": False,
        "model_name": True,
        "models": ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-4o"],
        "description": "ChatGPT models by OpenAI",
        "default_base_url": "https://api.openai.com/v1"
    },
    "Google Gemini": {
        "api_key": True,
        "base_url": False,
        "model_name": True,
        "models": ["gemini-pro", "gemini-pro-vision", "gemini-1.5-pro", "gemini-2.5-flash"],
        "description": "Google's Gemini AI models",
        "default_base_url": "https://generativelanguage.googleapis.com/v1beta"
    },
    "OpenRouter": {
        "api_key": True,
        "base_url": True,
        "model_name": True,
        "models": [
            "openai/gpt-3.5-turbo",
            "openai/gpt-4",
            "anthropic/claude-2",
            "meta-llama/llama-2-70b-chat",
            "mistralai/mistral-7b-instruct",
            "deepseek/deepseek-chat-v3.1:free"
        ],
        "description": "Unified access to multiple models",
        "default_base_url": "https://openrouter.ai/api/v1"
    },
    "Anthropic": {
        "api_key": True,
        "base_url": False,
        "model_name": True,
        "models": ["claude-3-sonnet", "claude-3-opus", "claude-3-haiku"],
        "description": "Anthropic's Claude models",
        "default_base_url": "https://api.anthropic.com"
    },
    "Local Ollama": {
        "api_key": False,
        "base_url": True,
        "model_name": True,
        "models": ["llama2", "mistral", "codellama", "phi", "neural-chat"],
        "description": "Run models locally on your machine",
        "default_base_url": "http://localhost:11434"
    }
}

# Pydantic models for request/response validation
class ConfigureRequest(BaseModel):
    provider: str
    config: Dict[str, Any]
    session_id: str = "default"

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    provider_key: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    response: Optional[str] = None 
    provider: Optional[str] = None
    model: Optional[str] = None
    session_id: Optional[str] = None
    error: Optional[str] = None

class SessionInfo(BaseModel):
    session_id: str
    provider: str
    model: Optional[str] = None
    created_at: str
    message_count: int
    last_message: Optional[str] = None

class SessionsResponse(BaseModel):
    success: bool
    sessions: List[SessionInfo]
    error: Optional[str] = None

class HealthResponse(BaseModel):
    success: bool
    status: str
    active_sessions: int
    providers: List[str]

class LLMClient:
    """Base class for LLM clients"""
    
    def __init__(self, provider: str, config: Dict[str, Any]):
        self.provider = provider
        self.config = config
        
    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        """Generate response from the LLM"""
        raise NotImplementedError

class OpenAIClient(LLMClient):
    """OpenAI API client"""
    
    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            headers = {
                "Authorization": f"Bearer {self.config['api_key']}",
                "Content-Type": "application/json"
            }
            
            base_url = self.config.get('base_url', LLM_PROVIDERS["OpenAI"]["default_base_url"])
            url = f"{base_url}/chat/completions"
            
            payload = {
                "model": self.config["model_name"],
                "messages": messages,
                "max_tokens": 1000,
                "temperature": 0.7
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            return result["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return f"Error: {str(e)}"

class GeminiClient(LLMClient):
    """Google Gemini API client"""
    
    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            # Convert messages to Gemini format
            prompt = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
            
            url = f"{LLM_PROVIDERS['Google Gemini']['default_base_url']}/models/{self.config['model_name']}:generateContent"
            
            headers = {
                "Content-Type": "application/json"
            }
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            params = {"key": self.config["api_key"]}
            
            response = requests.post(url, headers=headers, json=payload, params=params, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            return result["candidates"][0]["content"]["parts"][0]["text"]
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return f"Error: {str(e)}"

class OpenRouterClient(LLMClient):
    """OpenRouter API client"""
    
    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            headers = {
                "Authorization": f"Bearer {self.config['api_key']}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Personal PA Chat"
            }
            
            base_url = self.config.get('base_url', LLM_PROVIDERS["OpenRouter"]["default_base_url"])
            url = f"{base_url}/chat/completions"
            
            payload = {
                "model": self.config["model_name"],
                "messages": messages,
                "max_tokens": 1000,
                "temperature": 0.7
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            return result["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"OpenRouter API error: {e}")
            return f"Error: {str(e)}"

class AnthropicClient(LLMClient):
    """Anthropic Claude API client"""
    
    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            headers = {
                "x-api-key": self.config['api_key'],
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
            
            url = f"{LLM_PROVIDERS['Anthropic']['default_base_url']}/v1/messages"
            
            # Convert messages to Anthropic format
            system_message = ""
            user_messages = []
            
            for msg in messages:
                if msg["role"] == "system":
                    system_message = msg["content"]
                else:
                    user_messages.append(msg)
            
            payload = {
                "model": self.config["model_name"],
                "max_tokens": 1000,
                "messages": user_messages
            }
            
            if system_message:
                payload["system"] = system_message
            
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            return result["content"][0]["text"]
            
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            return f"Error: {str(e)}"

class OllamaClient(LLMClient):
    """Local Ollama API client"""
    
    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            base_url = self.config.get('base_url', LLM_PROVIDERS["Local Ollama"]["default_base_url"])
            url = f"{base_url}/api/chat"
            
            payload = {
                "model": self.config["model_name"],
                "messages": messages,
                "stream": False
            }
            
            response = requests.post(url, json=payload, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            return result["message"]["content"]
            
        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            return f"Error: {str(e)}"

def create_llm_client(provider: str, config: Dict[str, Any]) -> Optional[LLMClient]:
    """Factory function to create appropriate LLM client"""
    try:
        if provider == "OpenAI":
            return OpenAIClient(provider, config)
        elif provider == "Google Gemini":
            return GeminiClient(provider, config)
        elif provider == "OpenRouter":
            return OpenRouterClient(provider, config)
        elif provider == "Anthropic":
            return AnthropicClient(provider, config)
        elif provider == "Local Ollama":
            return OllamaClient(provider, config)
        else:
            logger.error(f"Unknown provider: {provider}")
            return None
    except Exception as e:
        logger.error(f"Error creating client for {provider}: {e}")
        return None

# API Routes
@app.get("/api/providers")
async def get_providers():
    """Get list of available LLM providers"""
    return LLM_PROVIDERS

@app.post("/api/configure-multiple")
async def configure_multiple_providers(providers: Dict[str, Dict[str, Any]]):
    """Configure multiple LLM providers from frontend"""
    try:
        configured_count = 0
        
        for provider_key, provider_data in providers.items():
            provider = provider_data.get('provider')
            config = {
                'api_key': provider_data.get('apiKey'),
                'model_name': provider_data.get('model')
            }
            
            if provider and provider in LLM_PROVIDERS:
                # Create LLM client
                client = create_llm_client(provider, config)
                if client:
                    provider_configs[provider_key] = {
                        "provider": provider,
                        "config": config,
                        "client": client,
                        "created_at": datetime.now().isoformat()
                    }
                    configured_count += 1
        
        return {
            "success": True,
            "configured_count": configured_count,
            "message": f"Configured {configured_count} providers"
        }
        
    except Exception as e:
        logger.error(f"Multiple configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/configure")
async def configure_llm(request: ConfigureRequest):
    """Configure LLM provider"""
    try:
        provider = request.provider
        config = request.config
        session_id = request.session_id
        
        if not provider or provider not in LLM_PROVIDERS:
            raise HTTPException(status_code=400, detail="Invalid provider")
        
        # Validate required fields
        provider_config = LLM_PROVIDERS[provider]
        
        if provider_config["api_key"] and not config.get("api_key"):
            raise HTTPException(status_code=400, detail="API Key is required")
        
        if provider_config["base_url"] and not config.get("base_url"):
            raise HTTPException(status_code=400, detail="Base URL is required")
        
        if provider_config["model_name"] and not config.get("model_name"):
            raise HTTPException(status_code=400, detail="Model selection is required")
        
        # Create LLM client
        client = create_llm_client(provider, config)
        if not client:
            raise HTTPException(status_code=500, detail="Failed to create LLM client")
        
        # Create provider key
        provider_key = f"{provider}_{config.get('model_name')}"
        
        # Store configuration by provider key
        provider_configs[provider_key] = {
            "provider": provider,
            "config": config,
            "client": client,
            "created_at": datetime.now().isoformat()
        }
        
        # Store legacy session-based config for backward compatibility
        llm_configs[session_id] = provider_configs[provider_key]
        
        # Initialize chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []
        
        return {
            "success": True,
            "provider": provider,
            "model": config.get("model_name"),
            "session_id": session_id,
            "provider_key": provider_key
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send message to configured LLM"""
    try:
        message = request.message.strip()
        session_id = request.session_id
        provider_key = request.provider_key
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Determine which provider config to use
        llm_info = None
        if provider_key and provider_key in provider_configs:
            # Use specific provider
            llm_info = provider_configs[provider_key]
        elif session_id in llm_configs:
            # Fallback to session-based config
            llm_info = llm_configs[session_id]
        else:
            raise HTTPException(status_code=400, detail="No LLM provider configured")
        
        client = llm_info["client"]
        
        # Get chat history
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []
        
        # Add user message to history
        chat_sessions[session_id].append({
            "role": "user",
            "content": message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Prepare messages for LLM (last 10 messages to avoid token limits)
        messages = [{"role": msg["role"], "content": msg["content"]} 
                   for msg in chat_sessions[session_id][-10:]]
        
        # Generate response
        response = await client.generate_response(messages)
        
        # Add AI response to history
        chat_sessions[session_id].append({
            "role": "assistant",
            "content": response,
            "timestamp": datetime.now().isoformat()
        })
        
        return ChatResponse(
            success=True,
            response=response,
            provider=llm_info["provider"],
            model=llm_info["config"].get("model_name"),
            session_id=session_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return ChatResponse(
            success=False,
            error=str(e)
        )

@app.get("/api/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    try:
        history = chat_sessions.get(session_id, [])
        return {
            "success": True,
            "history": history,
            "session_id": session_id
        }
    except Exception as e:
        logger.error(f"History error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sessions", response_model=SessionsResponse)
async def get_sessions():
    """Get list of all chat sessions"""
    try:
        sessions = []
        for session_id, config in llm_configs.items():
            history = chat_sessions.get(session_id, [])
            sessions.append(SessionInfo(
                session_id=session_id,
                provider=config["provider"],
                model=config["config"].get("model_name"),
                created_at=config["created_at"],
                message_count=len(history),
                last_message=history[-1]["timestamp"] if history else None
            ))
        
        return SessionsResponse(
            success=True,
            sessions=sessions
        )
    except Exception as e:
        logger.error(f"Sessions error: {e}")
        return SessionsResponse(
            success=False,
            sessions=[],
            error=str(e)
        )

@app.delete("/api/clear/{session_id}")
async def clear_session(session_id: str):
    """Clear a specific chat session"""
    try:
        if session_id in chat_sessions:
            del chat_sessions[session_id]
        if session_id in llm_configs:
            del llm_configs[session_id]
        
        return {
            "success": True,
            "message": f"Session {session_id} cleared"
        }
    except Exception as e:
        logger.error(f"Clear session error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        success=True,
        status="healthy",
        active_sessions=len(llm_configs),
        providers=list(LLM_PROVIDERS.keys())
    )

if __name__ == '__main__':
    print("🚀 Starting Multi-LLM Chat Backend Server...")
    print("📡 Server will be available at: http://localhost:5000")
    print("🔗 API endpoints:")
    print("   GET  /api/providers - Get available LLM providers")
    print("   POST /api/configure - Configure LLM provider")
    print("   POST /api/chat - Send chat message")
    print("   GET  /api/history/<session_id> - Get chat history")
    print("   GET  /api/sessions - Get all sessions")
    print("   DELETE /api/clear/<session_id> - Clear session")
    print("   GET  /api/health - Health check")
    
    uvicorn.run(app, host="0.0.0.0", port=5000)