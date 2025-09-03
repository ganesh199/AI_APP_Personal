import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class OnboardingView extends LitElement {
    static styles = css`
        * {
            font-family:
                'Inter',
                -apple-system,
                BlinkMacSystemFont,
                'Segoe UI',
                Roboto,
                sans-serif;
            cursor: default;
            user-select: none;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :host {
            display: block;
            height: 100%;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            overflow: hidden;
        }

        .onboarding-container {
            position: relative;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            overflow: hidden;
        }

        .gradient-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }

        .content-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 60px;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 32px 48px;
            max-width: 500px;
            color: #e5e5e5;
            overflow: hidden;
        }

        .slide-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
            opacity: 0.9;
            display: block;
        }

        .slide-title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #ffffff;
            line-height: 1.3;
        }

        .slide-content {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 24px;
            color: #b8b8b8;
            font-weight: 400;
        }

        .context-textarea {
            width: 100%;
            height: 100px;
            padding: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: #e5e5e5;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            transition: all 0.2s ease;
            margin-bottom: 24px;
        }

        .context-textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
            font-size: 14px;
        }

        .context-textarea:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.08);
        }

        .feature-list {
            max-width: 100%;
        }

        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 15px;
            color: #b8b8b8;
        }

        .feature-icon {
            font-size: 16px;
            margin-right: 12px;
            opacity: 0.8;
        }

        .navigation {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            height: 60px;
            box-sizing: border-box;
        }

        .nav-button {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #e5e5e5;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
            min-height: 36px;
        }

        .nav-button:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .nav-button:active {
            transform: scale(0.98);
        }

        .nav-button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .nav-button:disabled:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.1);
            transform: none;
        }

        .progress-dots {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .dot:hover {
            background: rgba(255, 255, 255, 0.4);
        }

        .dot.active {
            background: rgba(255, 255, 255, 0.8);
            transform: scale(1.2);
        }

        .llm-config-section {
            margin-bottom: 24px;
        }

        .configured-providers {
            margin-bottom: 32px;
        }

        .configured-providers h3,
        .add-provider-section h3 {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 16px;
        }

        .provider-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
        }

        .provider-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .provider-item:hover {
            background: rgba(255, 255, 255, 0.08);
        }

        .provider-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .provider-name {
            font-size: 14px;
            font-weight: 500;
            color: #e5e5e5;
        }

        .provider-status {
            font-size: 12px;
            color: #22c55e;
        }

        .remove-provider-btn {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .remove-provider-btn:hover {
            background: rgba(239, 68, 68, 0.2);
        }

        .no-providers {
            font-size: 14px;
            color: #888;
            font-style: italic;
            text-align: center;
            padding: 20px;
        }

        .add-provider-section {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 24px;
        }

        .provider-selector,
        .model-selector {
            margin-bottom: 16px;
        }

        .provider-selector label,
        .model-selector label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #e5e5e5;
        }

        .provider-select,
        .model-select {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: #e5e5e5;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s ease;
        }

        .provider-select:focus,
        .model-select:focus {
            outline: none;
            border-color: #007aff;
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }

        .api-key-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: #e5e5e5;
            font-size: 14px;
            font-family: inherit;
            margin-bottom: 16px;
            transition: all 0.2s ease;
        }

        .api-key-input:focus {
            outline: none;
            border-color: #007aff;
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }

        .api-key-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .add-provider-btn {
            width: 100%;
            padding: 12px 16px;
            background: #007aff;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 16px;
        }

        .add-provider-btn:hover:not(:disabled) {
            background: #0056b3;
        }

        .add-provider-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .config-note {
            font-size: 12px;
            color: #888;
            font-style: italic;
            line-height: 1.4;
        }
            background: rgba(255, 255, 255, 0.05);
            color: #e5e5e5;
            font-size: 14px;
            font-family: inherit;
            cursor: pointer;
        }

        .model-select:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.08);
        }

        .config-note {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 8px;
            line-height: 1.4;
        }
    `;

    static properties = {
        currentSlide: { type: Number },
        contextText: { type: String },
        selectedProvider: { type: String },
        apiKey: { type: String },
        selectedModel: { type: String },
        customModel: { type: String },
        showCustomModel: { type: Boolean },
        configuredProviders: { type: Array },
        onComplete: { type: Function },
        onClose: { type: Function },
    };

    constructor() {
        super();
        this.currentSlide = 0;
        this.contextText = '';
        this.selectedProvider = '';
        this.apiKey = '';
        this.selectedModel = '';
        this.customModel = '';
        this.showCustomModel = false;
        this.configuredProviders = [];
        this.onComplete = () => {};
        this.onClose = () => {};
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        // Load configured providers on initialization
        this.loadConfiguredProviders();

        // Transition properties
        this.isTransitioning = false;
        this.transitionStartTime = 0;
        this.transitionDuration = 800; // 800ms fade duration
        this.previousColorScheme = null;

        // Subtle dark color schemes for each slide
        this.colorSchemes = [
            // Slide 1 - Welcome (Very dark purple/gray)
            [
                [25, 25, 35], // Dark gray-purple
                [20, 20, 30], // Darker gray
                [30, 25, 40], // Slightly purple
                [15, 15, 25], // Very dark
                [35, 30, 45], // Muted purple
                [10, 10, 20], // Almost black
            ],
            // Slide 2 - Privacy (Dark blue-gray)
            [
                [20, 25, 35], // Dark blue-gray
                [15, 20, 30], // Darker blue-gray
                [25, 30, 40], // Slightly blue
                [10, 15, 25], // Very dark blue
                [30, 35, 45], // Muted blue
                [5, 10, 20], // Almost black
            ],
            // Slide 3 - Context (Dark neutral)
            [
                [25, 25, 25], // Neutral dark
                [20, 20, 20], // Darker neutral
                [30, 30, 30], // Light dark
                [15, 15, 15], // Very dark
                [35, 35, 35], // Lighter dark
                [10, 10, 10], // Almost black
            ],
            // Slide 4 - LLM Config (Dark teal)
            [
                [15, 30, 30], // Dark teal
                [10, 25, 25], // Darker teal
                [20, 35, 35], // Slightly teal
                [5, 20, 20], // Very dark teal
                [25, 40, 40], // Muted teal
                [0, 15, 15], // Almost black
            ],
            // Slide 5 - Features (Dark green-gray)
            [
                [20, 30, 25], // Dark green-gray
                [15, 25, 20], // Darker green-gray
                [25, 35, 30], // Slightly green
                [10, 20, 15], // Very dark green
                [30, 40, 35], // Muted green
                [5, 15, 10], // Almost black
            ],
            // Slide 6 - Complete (Dark warm gray)
            [
                [30, 25, 20], // Dark warm gray
                [25, 20, 15], // Darker warm
                [35, 30, 25], // Slightly warm
                [20, 15, 10], // Very dark warm
                [40, 35, 30], // Muted warm
                [15, 10, 5], // Almost black
            ],
        ];
    }

    firstUpdated() {
        this.canvas = this.shadowRoot.querySelector('.gradient-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.startGradientAnimation();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        if (!this.canvas) return;

        const rect = this.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    startGradientAnimation() {
        if (!this.ctx) return;

        const animate = timestamp => {
            this.drawGradient(timestamp);
            this.animationId = requestAnimationFrame(animate);
        };

        animate(0);
    }

    drawGradient(timestamp) {
        if (!this.ctx || !this.canvas) return;

        const { width, height } = this.canvas;
        let colors = this.colorSchemes[this.currentSlide];

        // Handle color scheme transitions
        if (this.isTransitioning && this.previousColorScheme) {
            const elapsed = timestamp - this.transitionStartTime;
            const progress = Math.min(elapsed / this.transitionDuration, 1);

            // Use easing function for smoother transition
            const easedProgress = this.easeInOutCubic(progress);

            colors = this.interpolateColorSchemes(this.previousColorScheme, this.colorSchemes[this.currentSlide], easedProgress);

            // End transition when complete
            if (progress >= 1) {
                this.isTransitioning = false;
                this.previousColorScheme = null;
            }
        }

        const time = timestamp * 0.0005; // Much slower animation

        // Create moving gradient with subtle flow
        const flowX = Math.sin(time * 0.7) * width * 0.3;
        const flowY = Math.cos(time * 0.5) * height * 0.2;

        const gradient = this.ctx.createLinearGradient(flowX, flowY, width + flowX * 0.5, height + flowY * 0.5);

        // Very subtle color variations with movement
        colors.forEach((color, index) => {
            const offset = index / (colors.length - 1);
            const wave = Math.sin(time + index * 0.3) * 0.05; // Very subtle wave

            const r = Math.max(0, Math.min(255, color[0] + wave * 5));
            const g = Math.max(0, Math.min(255, color[1] + wave * 5));
            const b = Math.max(0, Math.min(255, color[2] + wave * 5));

            gradient.addColorStop(offset, `rgb(${r}, ${g}, ${b})`);
        });

        // Fill with moving gradient
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Add a second layer with radial gradient for more depth
        const centerX = width * 0.5 + Math.sin(time * 0.3) * width * 0.15;
        const centerY = height * 0.5 + Math.cos(time * 0.4) * height * 0.1;
        const radius = Math.max(width, height) * 0.8;

        const radialGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

        // Very subtle radial overlay
        radialGradient.addColorStop(0, `rgba(${colors[0][0] + 10}, ${colors[0][1] + 10}, ${colors[0][2] + 10}, 0.1)`);
        radialGradient.addColorStop(0.5, `rgba(${colors[2][0]}, ${colors[2][1]}, ${colors[2][2]}, 0.05)`);
        radialGradient.addColorStop(
            1,
            `rgba(${colors[colors.length - 1][0]}, ${colors[colors.length - 1][1]}, ${colors[colors.length - 1][2]}, 0.03)`
        );

        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.fillStyle = radialGradient;
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.globalCompositeOperation = 'source-over';
    }

    nextSlide() {
        if (this.currentSlide < 5) {
            this.startColorTransition(this.currentSlide + 1);
        } else {
            this.completeOnboarding();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.startColorTransition(this.currentSlide - 1);
        }
    }

    startColorTransition(newSlide) {
        this.previousColorScheme = [...this.colorSchemes[this.currentSlide]];
        this.currentSlide = newSlide;
        this.isTransitioning = true;
        this.transitionStartTime = performance.now();
    }

    // Interpolate between two color schemes
    interpolateColorSchemes(scheme1, scheme2, progress) {
        return scheme1.map((color1, index) => {
            const color2 = scheme2[index];
            return [
                color1[0] + (color2[0] - color1[0]) * progress,
                color1[1] + (color2[1] - color1[1]) * progress,
                color1[2] + (color2[2] - color1[2]) * progress,
            ];
        });
    }

    // Easing function for smooth transitions
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    handleContextInput(e) {
        this.contextText = e.target.value;
    }

    handleProviderChange(e) {
        this.selectedProvider = e.target.value;
        this.apiKey = '';
        this.selectedModel = '';
    }

    handleApiKeyInput(e) {
        this.apiKey = e.target.value;
    }

    handleModelChange(e) {
        const value = e.target.value;
        if (value === 'other') {
            this.showCustomModel = true;
            this.selectedModel = this.customModel || '';
        } else {
            this.showCustomModel = false;
            this.selectedModel = value;
            this.customModel = '';
        }
        this.requestUpdate();
    }

    handleCustomModelInput(e) {
        this.customModel = e.target.value;
        this.selectedModel = e.target.value;
    }

    loadConfiguredProviders() {
        // Import LLMConfigManager dynamically to avoid circular imports
        import('../../utils/llmConfig.js').then(module => {
            const { LLMConfigManager } = module;
            this.configuredProviders = LLMConfigManager.getConfiguredProviders();
            this.requestUpdate();
        });
    }

    canAddProvider() {
        if (!this.selectedProvider || !this.selectedModel) {
            return false;
        }
        
        // Check if API key is required and provided
        const providers = this.getAvailableProviders();
        const providerInfo = providers[this.selectedProvider];
        
        if (providerInfo?.requiresApiKey && !this.apiKey.trim()) {
            return false;
        }
        
        return true;
    }

    async addProvider() {
        if (!this.canAddProvider()) return;
        
        try {
            // Import LLMConfigManager dynamically
            const { LLMConfigManager } = await import('../../utils/llmConfig.js');
            
            // Add the provider configuration
            const success = LLMConfigManager.addProviderConfig(
                this.selectedProvider,
                this.apiKey,
                this.selectedModel
            );
            
            if (success) {
                // Reset form
                this.selectedProvider = '';
                this.apiKey = '';
                this.selectedModel = '';
                
                // Reload configured providers
                this.loadConfiguredProviders();
                
                // Show success feedback (optional)
                console.log('Provider added successfully');
            } else {
                console.error('Failed to add provider');
            }
        } catch (error) {
            console.error('Error adding provider:', error);
        }
    }

    async removeProvider(configKey) {
        try {
            // Import LLMConfigManager dynamically
            const { LLMConfigManager } = await import('../../utils/llmConfig.js');
            
            // Remove the provider configuration
            const success = LLMConfigManager.removeProviderConfig(configKey);
            
            if (success) {
                // Reload configured providers
                this.loadConfiguredProviders();
                console.log('Provider removed successfully');
            } else {
                console.error('Failed to remove provider');
            }
        } catch (error) {
            console.error('Error removing provider:', error);
        }
    }

    getAvailableProviders() {
        return {
            'OpenAI': {
                name: 'OpenAI',
                models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'],
                placeholder: 'Enter your OpenAI API key (sk-...)'
            },
            'Google Gemini': {
                name: 'Google Gemini',
                models: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-2.5-flash'],
                placeholder: 'Enter your Google AI Studio API key'
            },
            'Anthropic': {
                name: 'Anthropic',
                models: ['claude-3-sonnet', 'claude-3-opus', 'claude-3-haiku'],
                placeholder: 'Enter your Anthropic API key'
            },
            'OpenRouter': {
                name: 'OpenRouter',
                models: ['openai/gpt-3.5-turbo', 'openai/gpt-4', 'anthropic/claude-2', 'deepseek/deepseek-chat-v3.1:free'],
                placeholder: 'Enter your OpenRouter API key'
            },
            'Local Ollama': {
                name: 'Local Ollama',
                models: ['llama2', 'mistral', 'codellama', 'phi'],
                placeholder: 'No API key required for local models'
            }
        };
    }

    async completeOnboarding() {
        // Store context if provided
        if (this.contextText.trim()) {
            localStorage.setItem('customPrompt', this.contextText.trim());
        }

        // Store LLM configuration if provided
        if (this.selectedProvider && (this.apiKey || this.selectedProvider === 'Local Ollama')) {
            const llmConfig = {
                provider: this.selectedProvider,
                apiKey: this.apiKey,
                model: this.selectedModel,
                configuredAt: new Date().toISOString()
            };

            // Store in secure local storage
            localStorage.setItem('llmConfig', JSON.stringify(llmConfig));

            // Configure the backend with the API key
            try {
                const response = await fetch('http://localhost:5000/api/configure', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        provider: this.selectedProvider,
                        config: {
                            api_key: this.apiKey,
                            model_name: this.selectedModel
                        },
                        session_id: 'default'
                    })
                });

                if (!response.ok) {
                    console.warn('Failed to configure backend, but continuing with onboarding');
                }
            } catch (error) {
                console.warn('Backend not available during onboarding, configuration will be applied later');
            }
        }

        localStorage.setItem('onboardingCompleted', 'true');
        this.onComplete();
    }

    getSlideContent() {
        const slides = [
            {
                icon: 'assets/onboarding/welcome.svg',
                title: 'Welcome to personal PA',
                content:
                    'Your AI assistant that listens and watches, then provides intelligent suggestions automatically during interviews and meetings.',
            },
            {
                icon: 'assets/onboarding/security.svg',
                title: 'Completely Private',
                content: 'Invisible to screen sharing apps and recording software. Your secret advantage stays completely hidden from others.',
            },
            {
                icon: 'assets/onboarding/context.svg',
                title: 'Add Your Context',
                content: 'Share relevant information to help the AI provide better, more personalized assistance.',
                showTextarea: true,
            },
            {
                icon: 'assets/onboarding/customize.svg',
                title: 'Configure AI Provider',
                content: 'Choose your preferred AI provider and add your API key to get started.',
                showLLMConfig: true,
            },
            {
                icon: 'assets/onboarding/customize.svg',
                title: 'Additional Features',
                content: '',
                showFeatures: true,
            },
            {
                icon: 'assets/onboarding/ready.svg',
                title: 'Ready to Go',
                content: 'Your AI assistant is configured and ready to help you in real-time.',
            },
        ];

        return slides[this.currentSlide];
    }

    render() {
        const slide = this.getSlideContent();

        return html`
            <div class="onboarding-container">
                <canvas class="gradient-canvas"></canvas>

                <div class="content-wrapper">
                    <img class="slide-icon" src="${slide.icon}" alt="${slide.title} icon" />
                    <div class="slide-title">${slide.title}</div>
                    <div class="slide-content">${slide.content}</div>

                    ${slide.showTextarea
                        ? html`
                              <textarea
                                  class="context-textarea"
                                  placeholder="Paste your resume, job description, or any relevant context here..."
                                  .value=${this.contextText}
                                  @input=${this.handleContextInput}
                              ></textarea>
                          `
                        : ''}
                    ${slide.showLLMConfig
                        ? html`
                              <div class="llm-config-section">
                                  <div class="configured-providers">
                                      <h3>Configured AI Providers</h3>
                                      ${this.configuredProviders.length > 0 
                                          ? html`
                                              <div class="provider-list">
                                                  ${this.configuredProviders.map(config => html`
                                                      <div class="provider-item">
                                                          <div class="provider-info">
                                                              <span class="provider-name">${config.name}</span>
                                                              <span class="provider-status">✓ Configured</span>
                                                          </div>
                                                          <button 
                                                              class="remove-provider-btn"
                                                              @click=${() => this.removeProvider(config.key)}
                                                          >Remove</button>
                                                      </div>
                                                  `)}
                                              </div>
                                          `
                                          : html`<p class="no-providers">No AI providers configured yet.</p>`
                                      }
                                  </div>

                                  <div class="add-provider-section">
                                      <h3>Add New AI Provider</h3>
                                      <div class="provider-selector">
                                          <label for="provider-select">Choose AI Provider:</label>
                                          <select 
                                              id="provider-select" 
                                              class="provider-select" 
                                              .value=${this.selectedProvider}
                                              @change=${this.handleProviderChange}
                                          >
                                              <option value="">Select a provider...</option>
                                              ${Object.entries(this.getAvailableProviders()).map(([key, provider]) => 
                                                  html`<option value="${key}">${provider.name}</option>`
                                              )}
                                          </select>
                                      </div>
                                      
                                      ${this.selectedProvider ? html`
                                          <input
                                              type="password"
                                              class="api-key-input"
                                              placeholder="${this.getAvailableProviders()[this.selectedProvider]?.placeholder || 'Enter API key'}"
                                              .value=${this.apiKey}
                                              @input=${this.handleApiKeyInput}
                                              ?disabled=${this.selectedProvider === 'Local Ollama'}
                                          />
                                          
                                          <div class="model-selector">
                                              <label for="model-select">Choose Model:</label>
                                              <select 
                                                  id="model-select" 
                                                  class="model-select" 
                                                  .value=${this.selectedModel === this.customModel ? 'other' : (this.selectedModel || '')}
                                                  @change=${this.handleModelChange}
                                              >
                                                  <option value="">Select a model...</option>
                                                  ${this.getAvailableProviders()[this.selectedProvider]?.models.map(model => 
                                                      html`<option value="${model}">${model}</option>`
                                                  )}
                                                  <option value="other">Other (custom model)</option>
                                              </select>
                                          </div>
                                          
                                          ${this.showCustomModel ? html`
                                              <div class="custom-model-input">
                                                  <label for="custom-model">Custom Model Name:</label>
                                                  <input
                                                      id="custom-model"
                                                      type="text"
                                                      class="api-key-input"
                                                      placeholder="Enter custom model name (e.g., gpt-4-turbo-preview)"
                                                      .value=${this.customModel}
                                                      @input=${this.handleCustomModelInput}
                                                  />
                                              </div>
                                          ` : ''}
                                          
                                          <button 
                                              class="add-provider-btn"
                                              @click=${this.addProvider}
                                              ?disabled=${!this.canAddProvider()}
                                          >
                                              Add Provider
                                          </button>
                                          
                                          <div class="config-note">
                                              ${this.selectedProvider === 'Local Ollama' 
                                                  ? 'Make sure Ollama is running on your system before proceeding.'
                                                  : 'Your API key will be stored securely on your device and never shared.'
                                              }
                                          </div>
                                      ` : ''}
                                  </div>
                              </div>
                          `
                        : ''}
                    ${slide.showFeatures
                        ? html`
                              <div class="feature-list">
                                  <div class="feature-item">
                                      <span class="feature-icon">🎨</span>
                                      Customize AI behavior and responses
                                  </div>
                                  <div class="feature-item">
                                      <span class="feature-icon">📚</span>
                                      Review conversation history
                                  </div>
                                  <div class="feature-item">
                                      <span class="feature-icon">🔧</span>
                                      Adjust capture settings and intervals
                                  </div>
                              </div>
                          `
                        : ''}
                </div>

                <div class="navigation">
                    <button class="nav-button" @click=${this.prevSlide} ?disabled=${this.currentSlide === 0}>
                        <svg width="16px" height="16px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>

                    <div class="progress-dots">
                        ${[0, 1, 2, 3, 4, 5].map(
                            index => html`
                                <div
                                    class="dot ${index === this.currentSlide ? 'active' : ''}"
                                    @click=${() => {
                                        if (index !== this.currentSlide) {
                                            this.startColorTransition(index);
                                        }
                                    }}
                                ></div>
                            `
                        )}
                    </div>

                    <button class="nav-button" @click=${this.nextSlide}>
                        ${this.currentSlide === 5
                            ? 'Get Started'
                            : html`
                                  <svg width="16px" height="16px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                  </svg>
                              `}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('onboarding-view', OnboardingView);
