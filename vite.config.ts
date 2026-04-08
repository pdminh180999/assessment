import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import {viteStaticCopy} from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: 'index-embed.html',
                    dest: '.',
                    rename: 'index.html'
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
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/features': path.resolve(__dirname, './src/features'),
            '@/shared': path.resolve(__dirname, './src/shared'),
            '@/store': path.resolve(__dirname, './src/store'),
            '@/services': path.resolve(__dirname, './src/services'),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, './src/embed.jsx'),
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
