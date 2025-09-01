import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class LLMChatView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: default;
            user-select: none;
        }

        :host {
            display: block;
            height: 100%;
            width: 100%;
        }

        .chat-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 12px;
        }

        .provider-header {
            background: var(--card-background, rgba(255, 255, 255, 0.04));
            border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
            border-radius: 6px;
            padding: 12px 16px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .provider-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .provider-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-color);
        }

        .model-name {
            font-size: 11px;
            color: var(--description-color, rgba(255, 255, 255, 0.6));
        }

        .back-button {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.15s ease;
        }

        .back-button:hover {
            background: var(--hover-background);
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            background: var(--main-content-background);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .message {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-width: 80%;
            word-wrap: break-word;
        }

        .message.user {
            align-self: flex-end;
        }

        .message.assistant {
            align-self: flex-start;
        }

        .message-content {
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 13px;
            line-height: 1.4;
            user-select: text;
            cursor: text;
        }

        .message.user .message-content {
            background: var(--focus-border-color, #007aff);
            color: white;
        }

        .message.assistant .message-content {
            background: var(--card-background, rgba(255, 255, 255, 0.08));
            color: var(--text-color);
            border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
        }

        .message-time {
            font-size: 10px;
            color: var(--description-color, rgba(255, 255, 255, 0.5));
            padding: 0 4px;
        }

        .message.user .message-time {
            text-align: right;
        }

        .message.assistant .message-time {
            text-align: left;
        }

        .chat-input-container {
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }

        .chat-input {
            flex: 1;
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--input-border);
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 13px;
            resize: vertical;
            min-height: 20px;
            max-height: 120px;
            font-family: inherit;
            transition: all 0.15s ease;
        }

        .chat-input:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 2px var(--focus-shadow);
            background: var(--input-focus-background);
        }

        .chat-input::placeholder {
            color: var(--placeholder-color);
        }

        .send-button {
            background: var(--focus-border-color, #007aff);
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            min-height: 40px;
        }

        .send-button:hover:not(:disabled) {
            background: var(--text-input-button-hover, #0056b3);
        }

        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            color: var(--description-color);
        }

        .empty-state-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-color);
        }

        .empty-state-description {
            font-size: 12px;
            line-height: 1.4;
        }

        .loading-message {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            background: var(--card-background, rgba(255, 255, 255, 0.04));
            border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
            border-radius: 12px;
            color: var(--text-color);
            font-size: 13px;
            align-self: flex-start;
            max-width: 80%;
        }

        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid var(--description-color);
            border-top: 2px solid var(--focus-border-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-message {
            background: var(--danger-background, rgba(239, 68, 68, 0.1));
            color: var(--danger-color, #ef4444);
            border: 1px solid var(--danger-border, rgba(239, 68, 68, 0.2));
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 12px;
            margin-bottom: 12px;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
            color: var(--description-color);
        }

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--success-color, #22c55e);
        }

        .status-dot.disconnected {
            background: var(--danger-color, #ef4444);
        }
    `;

    static properties = {
        currentView: { type: String },
        chatHistory: { type: Array },
        isLoading: { type: Boolean },
        errorMessage: { type: String },
        currentProvider: { type: String },
        currentModel: { type: String },
        sessionId: { type: String },
        isConnected: { type: Boolean },
        onBackClick: { type: Function },
    };

    constructor() {
        super();
        this.currentView = 'chat';
        this.chatHistory = [];
        this.isLoading = false;
        this.errorMessage = '';
        this.currentProvider = '';
        this.currentModel = '';
        this.sessionId = 'default';
        this.isConnected = false;
        this.onBackClick = () => {};
        this.backendUrl = 'http://localhost:5000';
        
        this.loadChatHistory();
        this.checkBackendConnection();
    }

    connectedCallback() {
        super.connectedCallback();
        resizeLayout();
    }

    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.backendUrl}/api/health`);
            if (response.ok) {
                this.isConnected = true;
                this.errorMessage = '';
            } else {
                this.isConnected = false;
                this.errorMessage = 'Backend server is not responding';
            }
        } catch (error) {
            this.isConnected = false;
            this.errorMessage = 'Cannot connect to backend server. Make sure Python backend is running on port 5000.';
        }
        this.requestUpdate();
    }

    loadChatHistory() {
        try {
            const savedHistory = localStorage.getItem(`llm_chat_history_${this.sessionId}`);
            if (savedHistory) {
                this.chatHistory = JSON.parse(savedHistory);
            }
            
            const savedProvider = localStorage.getItem(`llm_provider_${this.sessionId}`);
            const savedModel = localStorage.getItem(`llm_model_${this.sessionId}`);
            
            if (savedProvider && savedModel) {
                this.currentProvider = savedProvider;
                this.currentModel = savedModel;
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            this.chatHistory = [];
        }
    }

    saveChatHistory() {
        try {
            localStorage.setItem(`llm_chat_history_${this.sessionId}`, JSON.stringify(this.chatHistory));
            localStorage.setItem(`llm_provider_${this.sessionId}`, this.currentProvider);
            localStorage.setItem(`llm_model_${this.sessionId}`, this.currentModel);
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    async sendMessage(message) {
        if (!message.trim() || this.isLoading || !this.isConnected) return;

        this.isLoading = true;
        this.errorMessage = '';

        // Add user message to history
        const userMessage = {
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        
        this.chatHistory = [...this.chatHistory, userMessage];
        this.saveChatHistory();
        this.requestUpdate();

        try {
            const response = await fetch(`${this.backendUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.sessionId
                })
            });

            const result = await response.json();

            if (result.success) {
                // Add AI response to history
                const aiMessage = {
                    role: 'assistant',
                    content: result.response,
                    timestamp: new Date().toISOString(),
                    provider: result.provider,
                    model: result.model
                };
                
                this.chatHistory = [...this.chatHistory, aiMessage];
                this.saveChatHistory();
            } else {
                this.errorMessage = result.error || 'Failed to get response from AI';
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.errorMessage = 'Network error: Could not reach backend server';
        } finally {
            this.isLoading = false;
            this.requestUpdate();
            
            // Scroll to bottom after update
            setTimeout(() => {
                const messagesContainer = this.shadowRoot.querySelector('.chat-messages');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 100);
        }
    }

    handleInputKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = e.target.value;
            e.target.value = '';
            this.sendMessage(message);
        }
    }

    handleSendClick() {
        const input = this.shadowRoot.querySelector('.chat-input');
        const message = input.value;
        input.value = '';
        this.sendMessage(message);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    renderMessage(message) {
        return html`
            <div class="message ${message.role}">
                <div class="message-content">${message.content}</div>
                <div class="message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        `;
    }

    renderChatMessages() {
        if (this.chatHistory.length === 0) {
            return html`
                <div class="empty-state">
                    <div class="empty-state-title">Start a conversation</div>
                    <div class="empty-state-description">
                        Type a message below to begin chatting with ${this.currentProvider || 'the AI'}
                    </div>
                </div>
            `;
        }

        return html`
            ${this.chatHistory.map(message => this.renderMessage(message))}
            ${this.isLoading ? html`
                <div class="loading-message">
                    <div class="loading-spinner"></div>
                    <span>Generating response...</span>
                </div>
            ` : ''}
        `;
    }

    render() {
        return html`
            <div class="chat-container">
                <div class="provider-header">
                    <div class="provider-info">
                        <div class="provider-name">
                            ${this.currentProvider || 'Multi-LLM Chat'}
                        </div>
                        <div class="model-name">
                            ${this.currentModel || 'No model configured'}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="status-indicator">
                            <div class="status-dot ${this.isConnected ? '' : 'disconnected'}"></div>
                            <span>${this.isConnected ? 'Connected' : 'Disconnected'}</span>
                        </div>
                        <button class="back-button" @click=${this.onBackClick}>
                            <svg width="16px" height="16px" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            Back
                        </button>
                    </div>
                </div>

                ${this.errorMessage ? html`
                    <div class="error-message">
                        ${this.errorMessage}
                    </div>
                ` : ''}

                <div class="chat-messages">
                    ${this.renderChatMessages()}
                </div>

                <div class="chat-input-container">
                    <textarea
                        class="chat-input"
                        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                        @keydown=${this.handleInputKeyDown}
                        ?disabled=${this.isLoading || !this.isConnected}
                    ></textarea>
                    <button 
                        class="send-button" 
                        @click=${this.handleSendClick}
                        ?disabled=${this.isLoading || !this.isConnected}
                    >
                        ${this.isLoading ? html`
                            <div class="loading-spinner" style="width: 14px; height: 14px;"></div>
                        ` : html`
                            <svg width="16px" height="16px" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        `}
                        Send
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('llm-chat-view', LLMChatView);