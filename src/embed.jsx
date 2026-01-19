import React from 'react';
import ReactDOM from 'react-dom/client';
import WishlistDock from './components/WishlistDock';
import styles from './index.css?inline';

class WishlistWidgetElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        const theme = this.getAttribute('theme') || 'light';

        const container = document.createElement('div');
        container.id = 'wishlist-widget-root';

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(styleSheet);
        this.shadowRoot.appendChild(container);

        if (!this.root) {
            this.root = ReactDOM.createRoot(container);
            this.root.render(
                <React.StrictMode>
                    <WishlistDock theme={theme} />
                </React.StrictMode>
            );
        }
    }

    disconnectedCallback() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }

    static get observedAttributes() {
        return ['theme'];
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
