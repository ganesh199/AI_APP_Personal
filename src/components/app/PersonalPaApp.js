import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { AppHeader } from './AppHeader.js';
import { MainView } from '../views/MainView.js';
import { CustomizeView } from '../views/CustomizeView.js';
import { HelpView } from '../views/HelpView.js';
import { HistoryView } from '../views/HistoryView.js';
import { OnboardingView } from '../views/OnboardingView.js';
import { AdvancedView } from '../views/AdvancedView.js';
import { LLMConfigView } from '../views/LLMConfigView.js';
import { LLMChatView } from '../views/LLMChatView.js';
import { LLMConfigManager } from '../../utils/llmConfig.js';

export class PersonalPaApp extends LitElement {
    static styles = css`
        * {
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0px;
            padding: 0px;
            cursor: default;
            user-select: none;
        }

        :host {
            display: block;
            width: 100%;
            height: 100vh;
            background-color: var(--background-transparent);
            color: var(--text-color);
        }

        .window-container {
            height: 100vh;
            border-radius: 7px;
            overflow: hidden;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .main-content {
            flex: 1;
            padding: var(--main-content-padding);
            overflow-y: auto;
            margin-top: var(--main-content-margin-top);
            border-radius: var(--content-border-radius);
            transition: all 0.15s ease-out;
            background: var(--main-content-background);
        }

        .main-content.with-border {
            border: 1px solid var(--border-color);
        }

        .main-content.assistant-view {
            padding: 10px;
            border: none;
        }

        .main-content.onboarding-view {
            padding: 0;
            border: none;
            background: transparent;
        }

        .view-container {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.15s ease-out, transform 0.15s ease-out;
            height: 100%;
        }

        .view-container.entering {
            opacity: 0;
            transform: translateY(10px);
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-background);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }
    `;

    static properties = {
        currentView: { type: String },
        statusText: { type: String },
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        selectedScreenshotInterval: { type: String },
        selectedImageQuality: { type: String },
        layoutMode: { type: String },
        advancedMode: { type: Boolean },
        _isClickThrough: { state: true },
        llmChatConfig: { type: Object },
    };

    constructor() {
        super();
        this.currentView = localStorage.getItem('onboardingCompleted') ? 'main' : 'onboarding';
        this.statusText = '';
        this.selectedProfile = localStorage.getItem('selectedProfile') || 'interview';
        this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en-US';
        this.selectedScreenshotInterval = localStorage.getItem('selectedScreenshotInterval') || '5';
        this.selectedImageQuality = localStorage.getItem('selectedImageQuality') || 'medium';
        this.layoutMode = localStorage.getItem('layoutMode') || 'normal';
        this.advancedMode = localStorage.getItem('advancedMode') === 'true';
        this._isClickThrough = false;
        this.llmChatConfig = null;
        this.updateLayoutMode();
        
        // Auto-configure LLM backend if configuration exists
        this.initializeLLMConfig();
    }

    setStatus(text) {
        this.statusText = text;
    }

    // Header event handlers
    handleCustomizeClick() {
        this.currentView = 'customize';
        this.requestUpdate();
    }

    handleHelpClick() {
        this.currentView = 'help';
        this.requestUpdate();
    }

    handleHistoryClick() {
        this.currentView = 'history';
        this.requestUpdate();
    }

    handleAdvancedClick() {
        this.currentView = 'advanced';
        this.requestUpdate();
    }

    handleLLMChatClick() {
        this.currentView = 'llm-config';
        this.requestUpdate();
    }

    async handleDirectChatClick() {
        // Load stored configs and go directly to chat
        const storedConfigs = LLMConfigManager.getStoredConfigs();
        const configKeys = Object.keys(storedConfigs);
        
        if (configKeys.length > 0) {
            // Use the first available config or let user choose in chat
            const firstConfigKey = configKeys[0];
            const firstConfig = storedConfigs[firstConfigKey];
            
            // Configure backend if needed (sync all configs)
            const result = await LLMConfigManager.syncConfigsWithBackend();
            if (result.success) {
                this.llmChatConfig = {
                    provider: firstConfig.provider,
                    model: firstConfig.model,
                    sessionId: 'default',
                    availableProviders: configKeys
                };
                this.currentView = 'llm-chat';
                this.requestUpdate();
            } else {
                this.setStatus('❌ Failed to configure AI - check settings');
                this.currentView = 'llm-config';
                this.requestUpdate();
            }
        } else {
            // No config found, go to configuration
            this.currentView = 'llm-config';
            this.requestUpdate();
        }
    }

    handleLLMConfigComplete(config) {
        this.llmChatConfig = config;
        this.currentView = 'llm-chat';
        this.requestUpdate();
    }

    async handleClose() {
        if (this.currentView === 'customize' || this.currentView === 'help' || 
            this.currentView === 'history' || this.currentView === 'advanced' ||
            this.currentView === 'llm-config' || this.currentView === 'llm-chat') {
            this.currentView = 'main';
        } else {
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('quit-application');
            }
        }
    }

    async handleHideToggle() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('toggle-window-visibility');
        }
    }

    // Customize view event handlers
    handleProfileChange(profile) {
        this.selectedProfile = profile;
    }

    handleLanguageChange(language) {
        this.selectedLanguage = language;
    }

    handleScreenshotIntervalChange(interval) {
        this.selectedScreenshotInterval = interval;
    }

    handleImageQualityChange(quality) {
        this.selectedImageQuality = quality;
        localStorage.setItem('selectedImageQuality', quality);
    }

    handleAdvancedModeChange(advancedMode) {
        this.advancedMode = advancedMode;
        localStorage.setItem('advancedMode', advancedMode.toString());
    }

    handleBackClick() {
        this.currentView = 'main';
        this.requestUpdate();
    }

    // Help view event handlers
    async handleExternalLinkClick(url) {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', url);
        }
    }

    async handleHideToggle() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('toggle-window-visibility');
        }
    }

    // LLM Configuration initialization
    async initializeLLMConfig() {
        try {
            const result = await LLMConfigManager.autoConfigureOnStartup();
            if (result.success) {
                this.setStatus(`✅ AI configured: ${result.provider} (${result.model})`);
                console.log('LLM backend auto-configured successfully');
            } else {
                if (result.reason === 'no_config') {
                    console.log('No stored LLM configuration found - user will need to configure during onboarding');
                } else if (result.reason === 'backend_unavailable') {
                    this.setStatus('⚠️ AI backend not available - start backend server');
                } else {
                    this.setStatus('⚠️ AI configuration failed - check settings');
                }
            }
        } catch (error) {
            console.error('Error during LLM initialization:', error);
            this.setStatus('⚠️ AI initialization error');
        }
    }

    // Onboarding event handlers
    handleOnboardingComplete() {
        this.currentView = 'main';
        // Try to initialize LLM config after onboarding completion
        this.initializeLLMConfig();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        // Update localStorage when properties change
        if (changedProperties.has('selectedProfile')) {
            localStorage.setItem('selectedProfile', this.selectedProfile);
        }
        if (changedProperties.has('selectedLanguage')) {
            localStorage.setItem('selectedLanguage', this.selectedLanguage);
        }
        if (changedProperties.has('selectedScreenshotInterval')) {
            localStorage.setItem('selectedScreenshotInterval', this.selectedScreenshotInterval);
        }
        if (changedProperties.has('selectedImageQuality')) {
            localStorage.setItem('selectedImageQuality', this.selectedImageQuality);
        }
        if (changedProperties.has('layoutMode')) {
            this.updateLayoutMode();
        }
        if (changedProperties.has('advancedMode')) {
            localStorage.setItem('advancedMode', this.advancedMode.toString());
        }
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'onboarding':
                return html`
                    <onboarding-view .onComplete=${() => this.handleOnboardingComplete()} .onClose=${() => this.handleClose()}></onboarding-view>
                `;
            case 'main':
                return html`
                    <main-view
                        .onLayoutModeChange=${layoutMode => this.handleLayoutModeChange(layoutMode)}
                        .onLLMChatClick=${() => this.handleLLMChatClick()}
                        .onDirectChatClick=${() => this.handleDirectChatClick()}
                    ></main-view>
                `;
            case 'customize':
                return html`
                    <customize-view
                        .selectedProfile=${this.selectedProfile}
                        .selectedLanguage=${this.selectedLanguage}
                        .selectedScreenshotInterval=${this.selectedScreenshotInterval}
                        .selectedImageQuality=${this.selectedImageQuality}
                        .layoutMode=${this.layoutMode}
                        .advancedMode=${this.advancedMode}
                        .onProfileChange=${profile => this.handleProfileChange(profile)}
                        .onLanguageChange=${language => this.handleLanguageChange(language)}
                        .onScreenshotIntervalChange=${interval => this.handleScreenshotIntervalChange(interval)}
                        .onImageQualityChange=${quality => this.handleImageQualityChange(quality)}
                        .onLayoutModeChange=${layoutMode => this.handleLayoutModeChange(layoutMode)}
                        .onAdvancedModeChange=${advancedMode => this.handleAdvancedModeChange(advancedMode)}
                    ></customize-view>
                `;
            case 'help':
                return html` <help-view .onExternalLinkClick=${url => this.handleExternalLinkClick(url)}></help-view> `;
            case 'history':
                return html` <history-view></history-view> `;
            case 'advanced':
                return html` <advanced-view></advanced-view> `;
            case 'llm-config':
                return html`
                    <llm-config-view
                        .onConfigComplete=${config => this.handleLLMConfigComplete(config)}
                        .onBackClick=${() => this.handleBackClick()}
                    ></llm-config-view>
                `;
            case 'llm-chat':
                return html`
                    <llm-chat-view
                        .currentProvider=${this.llmChatConfig?.provider || ''}
                        .currentModel=${this.llmChatConfig?.model || ''}
                        .sessionId=${this.llmChatConfig?.sessionId || 'default'}
                        .onBackClick=${() => this.handleBackClick()}
                    ></llm-chat-view>
                `;
            default:
                return html`<div>Unknown view: ${this.currentView}</div>`;
        }
    }

    render() {
        const mainContentClass = `main-content ${
            this.currentView === 'onboarding' ? 'onboarding-view' : 'with-border'
        }`;
        return html`
            <div class="window-container">
                <div class="container">
                    <app-header
                        .currentView=${this.currentView}
                        .statusText=${this.statusText}
                        .advancedMode=${this.advancedMode}
                        .onCustomizeClick=${() => this.handleCustomizeClick()}
                        .onHelpClick=${() => this.handleHelpClick()}
                        .onHistoryClick=${() => this.handleHistoryClick()}
                        .onAdvancedClick=${() => this.handleAdvancedClick()}
                        .onCloseClick=${() => this.handleClose()}
                        .onBackClick=${() => this.handleBackClick()}
                        .onHideToggleClick=${() => this.handleHideToggle()}
                        ?isClickThrough=${this._isClickThrough}
                    ></app-header>
                    <div class="${mainContentClass}">
                        <div class="view-container">${this.renderCurrentView()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    updateLayoutMode() {
        if (this.layoutMode === 'compact') {
            document.documentElement.classList.add('compact-layout');
        } else {
            document.documentElement.classList.remove('compact-layout');
        }
    }

    async handleLayoutModeChange(layoutMode) {
        this.layoutMode = layoutMode;
        localStorage.setItem('layoutMode', layoutMode);
        this.updateLayoutMode();
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('update-sizes');
            } catch (error) {
                console.error('Failed to update sizes in main process:', error);
            }
        }
        this.requestUpdate();
    }
}

customElements.define('personal-pa-app', PersonalPaApp);