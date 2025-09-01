import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class LLMConfigView extends LitElement {
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
            padding: 12px;
        }

        .config-container {
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .title {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 8px;
        }

        .subtitle {
            font-size: 14px;
            color: var(--description-color);
            line-height: 1.4;
        }

        .provider-section {
            background: var(--card-background, rgba(255, 255, 255, 0.04));
            border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
            border-radius: 8px;
            padding: 20px;
            backdrop-filter: blur(10px);
        }

        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-title::before {
            content: '';
            width: 3px;
            height: 16px;
            background: var(--accent-color, #007aff);
            border-radius: 1.5px;
        }

        .provider-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
        }

        .provider-card {
            background: var(--input-background, rgba(0, 0, 0, 0.3));
            border: 1px solid var(--input-border, rgba(255, 255, 255, 0.15));
            border-radius: 6px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.15s ease;
            position: relative;
        }

        .provider-card:hover {
            background: var(--input-hover-background, rgba(0, 0, 0, 0.4));
            border-color: var(--focus-border-color);
        }

        .provider-card.selected {
            background: var(--focus-shadow, rgba(0, 122, 255, 0.1));
            border-color: var(--focus-border-color);
        }

        .provider-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 4px;
        }

        .provider-description {
            font-size: 11px;
            color: var(--description-color);
            line-height: 1.3;
        }

        .config-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .form-label {
            font-weight: 500;
            font-size: 13px;
            color: var(--text-color);
        }

        .form-control {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--input-border);
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 13px;
            transition: all 0.15s ease;
            font-family: inherit;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 2px var(--focus-shadow);
            background: var(--input-focus-background);
        }

        .form-control::placeholder {
            color: var(--placeholder-color);
        }

        select.form-control {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 8px center;
            background-repeat: no-repeat;
            background-size: 12px;
            padding-right: 28px;
        }

        .form-description {
            font-size: 11px;
            color: var(--description-color);
            line-height: 1.3;
        }

        .connect-button {
            background: var(--focus-border-color, #007aff);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 8px;
        }

        .connect-button:hover:not(:disabled) {
            background: var(--text-input-button-hover, #0056b3);
        }

        .connect-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .error-message {
            background: var(--danger-background, rgba(239, 68, 68, 0.1));
            color: var(--danger-color, #ef4444);
            border: 1px solid var(--danger-border, rgba(239, 68, 68, 0.2));
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            margin-top: 12px;
        }

        .success-message {
            background: var(--success-background, rgba(34, 197, 94, 0.1));
            color: var(--success-color, #22c55e);
            border: 1px solid var(--success-border, rgba(34, 197, 94, 0.2));
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            margin-top: 12px;
        }

        .backend-status {
            background: var(--card-background, rgba(255, 255, 255, 0.04));
            border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--success-color, #22c55e);
        }

        .status-dot.disconnected {
            background: var(--danger-color, #ef4444);
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
    `;

    static properties = {
        providers: { type: Object },
        selectedProvider: { type: String },
        apiConfig: { type: Object },
        isLoading: { type: Boolean },
        errorMessage: { type: String },
        successMessage: { type: String },
        isConnected: { type: Boolean },
        onConfigComplete: { type: Function },
        onBackClick: { type: Function },
    };

    constructor() {
        super();
        this.providers = {};
        this.selectedProvider = '';
        this.apiConfig = {};
        this.isLoading = false;
        this.errorMessage = '';
        this.successMessage = '';
        this.isConnected = false;
        this.onConfigComplete = () => {};
        this.onBackClick = () => {};
        this.backendUrl = 'http://localhost:5000';
        
        this.loadProviders();
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
            this.errorMessage = 'Cannot connect to backend server. Please start the Python backend first.';
        }
        this.requestUpdate();
    }

    async loadProviders() {
        try {
            const response = await fetch(`${this.backendUrl}/api/providers`);
            if (response.ok) {
                this.providers = await response.json();
                this.isConnected = true;
            } else {
                this.isConnected = false;
                this.errorMessage = 'Failed to load LLM providers';
            }
        } catch (error) {
            this.isConnected = false;
            this.errorMessage = 'Cannot connect to backend server. Make sure the Python backend is running.';
        }
        this.requestUpdate();
    }

    handleProviderSelect(provider) {
        this.selectedProvider = provider;
        this.apiConfig = {};
        this.errorMessage = '';
        this.successMessage = '';
        this.requestUpdate();
    }

    handleConfigChange(field, value) {
        this.apiConfig = { ...this.apiConfig, [field]: value };
    }

    async handleConnect() {
        if (!this.selectedProvider || this.isLoading) return;

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        this.requestUpdate();

        try {
            const response = await fetch(`${this.backendUrl}/api/configure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider: this.selectedProvider,
                    config: this.apiConfig,
                    session_id: 'default'
                })
            });

            const result = await response.json();

            if (result.success) {
                this.successMessage = `Successfully connected to ${result.provider} (${result.model})`;
                
                // Save configuration for the chat view
                localStorage.setItem('llm_provider_default', result.provider);
                localStorage.setItem('llm_model_default', result.model);
                
                // Notify parent component
                setTimeout(() => {
                    this.onConfigComplete({
                        provider: result.provider,
                        model: result.model,
                        sessionId: result.session_id
                    });
                }, 1000);
            } else {
                this.errorMessage = result.error || 'Failed to configure LLM';
            }
        } catch (error) {
            console.error('Error configuring LLM:', error);
            this.errorMessage = 'Network error: Could not reach backend server';
        } finally {
            this.isLoading = false;
            this.requestUpdate();
        }
    }

    renderProviderConfig() {
        if (!this.selectedProvider || !this.providers[this.selectedProvider]) {
            return html``;
        }

        const providerConfig = this.providers[this.selectedProvider];

        return html`
            <div class="provider-section">
                <div class="section-title">Configure ${this.selectedProvider}</div>
                
                <div class="config-form">
                    ${providerConfig.api_key ? html`
                        <div class="form-group">
                            <label class="form-label">API Key</label>
                            <input
                                type="password"
                                class="form-control"
                                placeholder="Enter your API key"
                                .value=${this.apiConfig.api_key || ''}
                                @input=${e => this.handleConfigChange('api_key', e.target.value)}
                            />
                            <div class="form-description">
                                Your ${this.selectedProvider} API key (kept secure and not stored)
                            </div>
                        </div>
                    ` : ''}

                    ${providerConfig.base_url ? html`
                        <div class="form-group">
                            <label class="form-label">Base URL</label>
                            <input
                                type="url"
                                class="form-control"
                                placeholder=${this.selectedProvider === 'Local Ollama' ? 'http://localhost:11434' : 'Enter base URL'}
                                .value=${this.apiConfig.base_url || (this.selectedProvider === 'Local Ollama' ? 'http://localhost:11434' : '')}
                                @input=${e => this.handleConfigChange('base_url', e.target.value)}
                            />
                            <div class="form-description">
                                ${this.selectedProvider === 'Local Ollama' 
                                    ? 'URL where your Ollama server is running'
                                    : `Custom base URL for ${this.selectedProvider} API`}
                            </div>
                        </div>
                    ` : ''}

                    ${providerConfig.model_name ? html`
                        <div class="form-group">
                            <label class="form-label">Model</label>
                            <select
                                class="form-control"
                                .value=${this.apiConfig.model_name || ''}
                                @change=${e => this.handleConfigChange('model_name', e.target.value)}
                            >
                                <option value="">Select a model</option>
                                ${providerConfig.models.map(model => html`
                                    <option value=${model}>${model}</option>
                                `)}
                            </select>
                            <div class="form-description">
                                Choose the specific model to use for this provider
                            </div>
                        </div>
                    ` : ''}

                    <button 
                        class="connect-button" 
                        @click=${this.handleConnect}
                        ?disabled=${this.isLoading || !this.isConnected}
                    >
                        ${this.isLoading ? html`
                            <div class="loading-spinner"></div>
                            Connecting...
                        ` : 'Connect to LLM'}
                    </button>

                    ${this.errorMessage ? html`
                        <div class="error-message">${this.errorMessage}</div>
                    ` : ''}

                    ${this.successMessage ? html`
                        <div class="success-message">${this.successMessage}</div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    render() {
        return html`
            <div class="config-container">
                <div class="header">
                    <div class="title">🚀 Multi-LLM Chat</div>
                    <div class="subtitle">Select and configure an LLM provider to get started</div>
                </div>

                <div class="backend-status">
                    <div class="status-dot ${this.isConnected ? '' : 'disconnected'}"></div>
                    <span>
                        ${this.isConnected 
                            ? 'Backend server connected' 
                            : 'Backend server disconnected - Start Python backend first'}
                    </span>
                </div>

                ${this.isConnected ? html`
                    <div class="provider-section">
                        <div class="section-title">Choose LLM Provider</div>
                        
                        <div class="provider-grid">
                            ${Object.entries(this.providers).map(([name, config]) => html`
                                <div 
                                    class="provider-card ${this.selectedProvider === name ? 'selected' : ''}"
                                    @click=${() => this.handleProviderSelect(name)}
                                >
                                    <div class="provider-name">${name}</div>
                                    <div class="provider-description">${config.description}</div>
                                </div>
                            `)}
                        </div>
                    </div>

                    ${this.renderProviderConfig()}
                ` : html`
                    <div class="provider-section">
                        <div class="section-title">Backend Setup Required</div>
                        <div class="form-description" style="margin-bottom: 16px;">
                            To use the multi-LLM chat feature, you need to start the Python backend server:
                        </div>
                        <div style="background: var(--input-background); padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; color: var(--text-color);">
                            cd backend<br/>
                            pip install -r requirements.txt<br/>
                            python app.py
                        </div>
                        <div class="form-description" style="margin-top: 12px;">
                            The backend will start on http://localhost:5000
                        </div>
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('llm-config-view', LLMConfigView);