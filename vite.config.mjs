import { fileURLToPath, URL } from 'node:url';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    optimizeDeps: {
        noDiscovery: true
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        }),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            manifest: {
                name: 'Eco Clean',
                short_name: 'Eco Clean',
                description: 'Intelliwaste',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: '/compartimiento192.png',
                        sizes: '128x128',
                        type: 'image/png'
                    },
                    {
                        src: '/compartimiento.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
           
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
