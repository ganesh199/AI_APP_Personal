# Personal PA - AI-Powered Assistant

A stealth desktop application with advanced AI chat capabilities, file upload support, and screenshot analysis features.

## Overview

Personal PA is an Electron-based desktop application that provides:
- **Multi-LLM Chat**: Chat with different AI providers (OpenAI, Google Gemini, Anthropic, OpenRouter, Local Ollama)
- **File Upload Support**: Upload documents, images, audio, and video files for AI analysis
- **Screenshot Analysis**: Capture and analyze screenshots with Ctrl+Enter shortcut
- **Chat History**: Browse and manage conversation history
- **Stealth Mode**: Toggle stealth features for privacy
- **Customizable Interface**: Adjustable layouts and keyboard shortcuts

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

### 2. Configure AI Providers

1. Complete onboarding to configure your first AI provider
2. Or go to Settings to add multiple providers
3. Supported providers: OpenAI, Google Gemini, Anthropic, OpenRouter, Local Ollama
4. Each provider requires an API key (except local Ollama)

### 3. Start Using Features

1. **Chat**: Click "🤖 Start Multi-LLM Chat" from main view
2. **Files**: Use "+" button in chat to upload files for analysis
3. **Screenshots**: Press Ctrl+Enter anywhere to capture and analyze
4. **History**: Click book icon to browse past conversations
5. **Stealth**: Click shield icon to toggle stealth mode

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

## Key Features

### 🤖 Multi-LLM Chat
- **Multiple Provider Support**: Switch between different AI providers
- **Provider Selection**: Choose from configured providers in chat interface
- **Session Management**: Multiple chat sessions with different providers
- **Real-time Communication**: Fast communication with backend server

### 📁 File Upload & Analysis
- **Multi-file Support**: Upload up to 5 files per message (max 50MB each)
- **Supported Formats**: Documents (.pdf, .doc, .docx, .txt, .md), Images (.jpg, .png, .gif, etc.), Audio (.mp3, .wav), Video (.mp4, .avi, .mov)
- **File Preview**: View uploaded files as removable chips before sending
- **AI Integration**: Files are processed and included in AI context

### 📸 Screenshot Analysis
- **Ctrl+Enter Shortcut**: Instantly capture and send screenshots to AI
- **Auto-navigation**: Automatically switches to LLM chat view
- **Default Analysis**: Sends screenshot with "Please analyze this screenshot" prompt
- **Customizable Keybind**: Modify shortcut in settings (default: Ctrl+Enter/Cmd+Enter)

### 📚 Chat History
- **Session Storage**: All conversations saved locally
- **History Browser**: Dedicated view to browse past conversations
- **Session Details**: View provider, model, date, and message count
- **Delete Options**: Remove individual sessions or clear all history

### 🛡️ Stealth Mode
- **Toggle Button**: Shield icon in header to enable/disable stealth
- **Anti-Analysis**: Applies stealth measures when enabled
- **Privacy Features**: Enhanced privacy and security measures

### ⚙️ Customization
- **Keyboard Shortcuts**: Customize all keybinds in settings
- **Layout Modes**: Normal and compact layouts
- **Advanced Mode**: Additional tools and features
- **Responsive Design**: Fits seamlessly into desktop environment

## Quick Start

### 1. First Launch
1. Complete the onboarding process
2. Configure at least one AI provider with API key
3. Choose your preferred settings

### 2. Using AI Chat
1. Click "🤖 Start Multi-LLM Chat" from main view
2. Select provider from dropdown (if multiple configured)
3. Type your message or upload files
4. Press Enter to send

### 3. Screenshot Analysis
1. Press **Ctrl+Enter** anywhere in the app
2. Screenshot is automatically captured and sent to AI
3. View AI analysis in the chat interface

### 4. File Upload
1. In LLM chat, click the "+" button
2. Select up to 5 files (documents, images, audio, video)
3. Files appear as chips - remove unwanted ones
4. Send message with files for AI analysis

## Keyboard Shortcuts

| Action | Windows/Linux | Mac | Description |
|--------|---------------|-----|-------------|
| Screenshot & Send | Ctrl+Enter | Cmd+Enter | Capture screenshot and send to AI |
| Toggle Visibility | Ctrl+\ | Cmd+\ | Show/hide application window |
| Toggle Click-through | Ctrl+M | Cmd+M | Enable/disable click-through mode |
| Move Window | Ctrl+Arrow | Alt+Arrow | Move application window |
| Previous Response | Ctrl+[ | Cmd+[ | Navigate to previous AI response |
| Next Response | Ctrl+] | Cmd+] | Navigate to next AI response |
| Scroll Response | Ctrl+Shift+↑/↓ | Cmd+Shift+↑/↓ | Scroll AI response content |

*All shortcuts are customizable in Settings*

## API Endpoints

The backend provides these REST API endpoints:

- `GET /api/providers` - Get available LLM providers
- `POST /api/configure` - Configure LLM provider  
- `POST /api/configure-multiple` - Configure multiple providers
- `POST /api/chat` - Send chat message (supports file uploads)
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

## File Structure

```
d:\AI-PA\
├── backend/
│   ├── app.py              # FastAPI backend server
│   ├── requirements.txt    # Python dependencies
│   └── start_backend.py    # Backend startup script
├── src/
│   ├── components/
│   │   ├── app/
│   │   │   ├── PersonalPaApp.js    # Main application component
│   │   │   └── AppHeader.js        # Header with stealth toggle
│   │   └── views/
│   │       ├── LLMChatView.js      # Multi-LLM chat interface
│   │       ├── ChatHistoryView.js  # Chat history browser
│   │       ├── MainView.js         # Main dashboard
│   │       └── CustomizeView.js    # Settings and keybinds
│   ├── utils/
│   │   ├── llmConfig.js     # LLM configuration management
│   │   ├── renderer.js      # Electron renderer utilities
│   │   └── window.js        # Window and shortcut management
│   └── index.js             # Electron main process
├── package.json
└── README_LLM_CHAT.md
```

## Development

### Adding New Features
1. **Backend**: Edit `backend/app.py` to add new providers or API endpoints
2. **Frontend**: Create new view components in `src/components/views/`
3. **Configuration**: Extend LLM configuration in `src/utils/llmConfig.js`
4. **Shortcuts**: Add new keybinds in `src/utils/window.js`

### Running in Development
```bash
# Start both frontend and backend
npm start

# Or start individually:
npm run start:frontend  # Electron app
npm run start:backend   # Python backend
```

### Building
```bash
npm run package  # Package for current platform
npm run make     # Create installer
```

The system is designed to be easily extensible for additional LLM providers, file types, and features.