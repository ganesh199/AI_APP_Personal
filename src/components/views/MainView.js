import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class MainView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: default;
            user-select: none;
        }
        .welcome {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
            margin-top: auto;
        }
        .description {
            color: var(--description-color);
            font-size: 14px;
            margin-bottom: 24px;
            line-height: 1.5;
        }
        .feature-list {
            margin-top: 20px;
        }
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .feature-icon {
            margin-right: 10px;
            font-size: 16px;
        }
        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 500px;
        }
    `;

    static properties = {
        onLayoutModeChange: { type: Function },
    };

    constructor() {
        super();
        this.onLayoutModeChange = () => {};
        this.loadLayoutMode();
        resizeLayout();
    }

    loadLayoutMode() {
        const savedLayoutMode = localStorage.getItem('layoutMode');
        if (savedLayoutMode && savedLayoutMode !== 'normal') {
            this.onLayoutModeChange(savedLayoutMode);
        }
    }

    render() {
        return html`
            <div class="welcome">Welcome TO Personal Assistant</div>
            <p class="description">
                This is a frontend-only application with stealth capabilities. 
            </p>
            
            <div class="feature-list">
                <div class="feature-item">
                    <span class="feature-icon">🔒</span>
                    <span>Content protection enabled</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">👁️</span>
                    <span>Stealth mode active</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">⌨️</span>
                    <span>Customizable keyboard shortcuts</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🎨</span>
                    <span>Adjustable interface layout</span>
                </div>
            </div>
        `;
    }
}

customElements.define('main-view', MainView);