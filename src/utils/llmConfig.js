/**
 * LLM Configuration Management Utility
 * Handles secure storage and retrieval of API keys and configurations
 */

export class LLMConfigManager {
    static STORAGE_KEY = 'llmConfigs'; // Changed to plural for multiple configs
    static BACKEND_URL = 'http://localhost:5000';

    /**
     * Get all stored LLM configurations
     */
    static getStoredConfigs() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error reading stored LLM configs:', error);
            return {};
        }
    }

    /**
     * Get stored LLM configuration (legacy method for backward compatibility)
     */
    static getStoredConfig() {
        const configs = this.getStoredConfigs();
        const configKeys = Object.keys(configs);
        return configKeys.length > 0 ? configs[configKeys[0]] : null;
    }

    /**
     * Store multiple LLM configurations
     */
    static storeConfigs(configs) {
        try {
            const configsWithTimestamp = {};
            Object.keys(configs).forEach(key => {
                configsWithTimestamp[key] = {
                    ...configs[key],
                    updatedAt: new Date().toISOString()
                };
            });
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configsWithTimestamp));
            return true;
        } catch (error) {
            console.error('Error storing LLM configs:', error);
            return false;
        }
    }

    /**
     * Store single LLM configuration
     */
    static storeConfig(config) {
        const configs = this.getStoredConfigs();
        const configKey = `${config.provider}_${config.model}`;
        configs[configKey] = config;
        return this.storeConfigs(configs);
    }

    /**
     * Add a new provider configuration
     */
    static addProviderConfig(provider, apiKey, model) {
        const configs = this.getStoredConfigs();
        const configKey = `${provider}_${model}`;
        
        configs[configKey] = {
            provider,
            apiKey,
            model,
            name: `${provider} (${model})`,
            updatedAt: new Date().toISOString()
        };
        
        return this.storeConfigs(configs);
    }

    /**
     * Remove a provider configuration
     */
    static removeProviderConfig(configKey) {
        const configs = this.getStoredConfigs();
        delete configs[configKey];
        return this.storeConfigs(configs);
    }

    /**
     * Get configured providers list for UI
     */
    static getConfiguredProviders() {
        const configs = this.getStoredConfigs();
        return Object.keys(configs).map(key => ({
            key,
            ...configs[key]
        }));
    }

    /**
     * Clear stored configuration
     */
    static clearConfig() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing LLM config:', error);
            return false;
        }
    }

    /**
     * Configure backend with stored API key
     */
    static async configureBackend(config, sessionId = 'default') {
        try {
            const response = await fetch(`${this.BACKEND_URL}/api/configure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider: config.provider,
                    config: {
                        api_key: config.apiKey,
                        model_name: config.model
                    },
                    session_id: sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`Backend configuration failed: ${response.status}`);
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            console.error('Error configuring backend:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Check if backend is available
     */
    static async isBackendAvailable() {
        try {
            const response = await fetch(`${this.BACKEND_URL}/api/health`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Auto-configure backend on app startup with all stored configs
     */
    static async autoConfigureOnStartup() {
        const storedConfigs = this.getStoredConfigs();
        
        if (Object.keys(storedConfigs).length === 0) {
            console.log('No stored LLM configurations found');
            return { success: false, reason: 'no_config' };
        }

        // Check if backend is available
        const backendAvailable = await this.isBackendAvailable();
        if (!backendAvailable) {
            console.log('Backend not available for auto-configuration');
            return { success: false, reason: 'backend_unavailable' };
        }

        // Configure backend with all stored configs
        const result = await this.syncConfigsWithBackend();
        
        if (result.success) {
            console.log(`Auto-configured ${result.configured_count} LLM providers`);
            return { success: true, configured_count: result.configured_count };
        } else {
            console.error('Failed to auto-configure backend:', result.error);
            return { success: false, reason: 'config_failed', error: result.error };
        }
    }

    /**
     * Sync all stored configurations with backend
     */
    static async syncConfigsWithBackend() {
        try {
            const configs = this.getStoredConfigs();
            
            const response = await fetch(`${this.BACKEND_URL}/api/configure-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configs)
            });

            if (!response.ok) {
                throw new Error(`Backend sync failed: ${response.status}`);
            }

            const result = await response.json();
            return { success: true, configured_count: result.configured_count };
        } catch (error) {
            console.error('Error syncing configs with backend:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get available providers (matches backend configuration)
     */
    static getAvailableProviders() {
        return {
            'OpenAI': {
                name: 'OpenAI',
                models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'],
                requiresApiKey: true
            },
            'Google Gemini': {
                name: 'Google Gemini',
                models: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-2.5-flash'],
                requiresApiKey: true
            },
            'Anthropic': {
                name: 'Anthropic',
                models: ['claude-3-sonnet', 'claude-3-opus', 'claude-3-haiku'],
                requiresApiKey: true
            },
            'OpenRouter': {
                name: 'OpenRouter',
                models: ['openai/gpt-3.5-turbo', 'openai/gpt-4', 'anthropic/claude-2', 'deepseek/deepseek-chat-v3.1:free'],
                requiresApiKey: true
            },
            'Local Ollama': {
                name: 'Local Ollama',
                models: ['llama2', 'mistral', 'codellama', 'phi'],
                requiresApiKey: false
            }
        };
    }

    /**
     * Validate configuration before storing
     */
    static validateConfig(config) {
        if (!config.provider) {
            return { valid: false, error: 'Provider is required' };
        }

        const providers = this.getAvailableProviders();
        if (!providers[config.provider]) {
            return { valid: false, error: 'Invalid provider' };
        }

        const providerInfo = providers[config.provider];
        if (providerInfo.requiresApiKey && !config.apiKey) {
            return { valid: false, error: 'API key is required for this provider' };
        }

        if (!config.model) {
            return { valid: false, error: 'Model selection is required' };
        }

        if (!providerInfo.models.includes(config.model)) {
            return { valid: false, error: 'Invalid model for selected provider' };
        }

        return { valid: true };
    }
}
