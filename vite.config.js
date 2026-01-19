import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import tailwindcss from '@tailwindcss/vite';
import {viteStaticCopy} from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: 'index.html',
                    dest: '.'
                }
            ]
        }),
    ],
    base: '/assessment/',
    define: {
        'process.env': {},
        'process.env.NODE_ENV': JSON.stringify('production'),
        global: 'globalThis'
    },
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
            }
        },
        cssCodeSplit: false,
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true
        }
    },
});
