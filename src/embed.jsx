import React from 'react';
import ReactDOM from 'react-dom/client';
import WishlistDock from './components/WishlistDock';

class WishlistWidgetElement extends HTMLElement {
    constructor() {
        super();
        this.root = null;
        this.shadowRoot = null;
    }

    connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        const theme = this.getAttribute('theme') || 'light';
        const apiUrl = this.getAttribute('api-url') || null;

        const container = document.createElement('div');
        container.id = 'wishlist-widget-root';

        // Inject Tailwind CSS into Shadow DOM
        const tailwindLink = document.createElement('link');
        tailwindLink.rel = 'stylesheet';
        tailwindLink.href = 'https://cdn.tailwindcss.com';

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
      /* Reset styles for shadow DOM */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: #cbd5e0;
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #a0aec0;
      }

      .dark ::-webkit-scrollbar-thumb {
        background: #4a5568;
      }

      .dark ::-webkit-scrollbar-thumb:hover {
        background: #718096;
      }

      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .animate-in {
        animation: fadeIn 0.2s ease-out;
      }

      /* Text utilities */
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Prevent text selection on draggable elements */
      .cursor-grab,
      .cursor-grabbing {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
      }

      /* Border width utility */
      .border-3 {
        border-width: 3px;
      }

      /* Make sure everything is contained */
      #wishlist-widget-root {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }

      /* Allow pointer events on interactive elements */
      #wishlist-widget-root > * {
        pointer-events: auto;
      }
    `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(tailwindLink);
        this.shadowRoot.appendChild(styleSheet);
        this.shadowRoot.appendChild(container);

        tailwindLink.onload = () => {
            this.root = ReactDOM.createRoot(container);
            this.root.render(
                <React.StrictMode>
                    <WishlistDock initialTheme={theme} apiUrl={apiUrl} />
                </React.StrictMode>
            );
        };

        setTimeout(() => {
            if (!this.root) {
                this.root = ReactDOM.createRoot(container);
                this.root.render(
                    <React.StrictMode>
                        <WishlistDock initialTheme={theme} apiUrl={apiUrl} />
                    </React.StrictMode>
                );
            }
        }, 1000);
    }

    disconnectedCallback() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }

    static get observedAttributes() {
        return ['theme', 'api-url'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.root) {
            // Re-render on attribute change
            this.disconnectedCallback();
            this.connectedCallback();
        }
    }
}

if (!customElements.get('wishlist-widget')) {
    customElements.define('wishlist-widget', WishlistWidgetElement);
}

export default WishlistWidgetElement;
