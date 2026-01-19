import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    base: '/assessment/',
    build: {
        lib: {
            entry: resolve(__dirname, 'src/embed.jsx'),
            name: 'WishlistWidget',
            fileName: 'wishlist-widget',
            formats: ['iife']
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'assets/style.[hash].css';
                    return 'assets/[name].[hash][extname]';
                }
            }
        },
        cssCodeSplit: false,
        commonjsOptions: {
            include: [/node_modules/]
        }
    },
});
