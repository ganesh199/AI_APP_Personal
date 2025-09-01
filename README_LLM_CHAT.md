# Multi-LLM Chat Integration

This document explains how to use the new Multi-LLM Chat feature integrated into your Personal PA application.

## Overview

The Multi-LLM Chat feature allows you to chat with different AI providers through a unified interface, similar to the Streamlit example you provided, but integrated into your existing Electron frontend.

## Supported LLM Providers

- **OpenAI**: GPT-3.5, GPT-4, GPT-4 Turbo models
- **Google Gemini**: Gemini Pro, Gemini Pro Vision models  
- **OpenRouter**: Access to multiple models through one API
- **Anthropic**: Claude 3 models (Sonnet, Opus, Haiku)
- **Local Ollama**: Run models locally on your machine

## Setup Instructions

### 1. Start the Python Backend

First, you need to start the Python backend server:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
python app.py
```

Alternatively, you can use the startup script:

```bash
cd backend
python start_backend.py
```

The backend will start on `http://localhost:5000`

### 2. Access Multi-LLM Chat

1. Open your Personal PA application
2. From the main view, click "🤖 Start Multi-LLM Chat"
3. Select your preferred LLM provider
4. Configure the provider with your API key and settings
5. Start chatting!

## Configuration

### OpenAI
- **API Key**: Your OpenAI API key
- **Model**: Choose from GPT-3.5-turbo, GPT-4, GPT-4-turbo, GPT-4o

### Google Gemini  
- **API Key**: Your Google AI Studio API key
- **Model**: Choose from gemini-pro, gemini-pro-vision, gemini-1.5-pro

### OpenRouter
- **API Key**: Your OpenRouter API key
- **Base URL**: Custom base URL (optional)
- **Model**: Choose from various models available on OpenRouter

### Anthropic
- **API Key**: Your Anthropic API key
- **Model**: Choose from Claude 3 models

### Local Ollama
- **Base URL**: URL where Ollama is running (default: http://localhost:11434)
- **Model**: Choose from locally installed models

## Features

- **Multiple Provider Support**: Switch between different AI providers
- **Chat History**: Conversations are saved locally
- **Session Management**: Multiple chat sessions with different providers
- **Real-time Communication**: Fast communication with backend server
- **Error Handling**: Comprehensive error messages and connection status
- **Responsive Design**: Fits seamlessly into your existing UI

## API Endpoints

The backend provides these REST API endpoints:

- `GET /api/providers` - Get available LLM providers
- `POST /api/configure` - Configure LLM provider  
- `POST /api/chat` - Send chat message
- `GET /api/history/<session_id>` - Get chat history
- `GET /api/sessions` - Get all sessions
- `DELETE /api/clear/<session_id>` - Clear session
- `GET /api/health` - Health check

## Troubleshooting

### Backend Not Starting
- Make sure Python 3.8+ is installed
- Install requirements: `pip install -r requirements.txt`
- Check if port 5000 is available

### Connection Issues
- Verify the backend is running on http://localhost:5000
- Check firewall settings
- Ensure no other applications are using port 5000

### API Key Issues
- Verify your API keys are correct
- Check API key permissions and quotas
- Ensure the API key format matches the provider requirements

## Security Notes

- API keys are sent to the backend but not stored permanently
- All communication happens locally between frontend and backend
- Chat history is stored locally in your browser
- No data is sent to external servers except for AI API calls

## Development

To modify or extend the LLM chat functionality:

1. **Backend**: Edit `backend/app.py` to add new providers or modify API handling
2. **Frontend**: Edit the LLM view components in `src/components/views/`
3. **Configuration**: Modify provider configurations in the backend

The system is designed to be easily extensible for additional LLM providers.