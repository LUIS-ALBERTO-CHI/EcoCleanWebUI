import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from "@primevue/themes/aura";
import { definePreset } from '@primevue/themes';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import App from './App.vue'
import ToastService from 'primevue/toastservice';
import router from './router'

const app = createApp(App)

const MyPreset = definePreset(Aura, {
    semantic: {
        Primary: {
            50: '{sky.50}',
            100: '{sky.100}',
            200: '{sky.200}',
            300: '{sky.300}',
            400: '{sky.400}',
            500: '{sky.500}',
            600: '{sky.600}',
            700: '{sky.700}',
            800: '{sky.800}',
            900: '{sky.900}',
            950: '{sky.950}'
        }
    }
});

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
});
app.use(ToastService);
app.mount('#app')
