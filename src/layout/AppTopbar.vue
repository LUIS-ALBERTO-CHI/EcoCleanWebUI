<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { onMounted, ref, onUnmounted } from 'vue';
import medio from '@/assets/medio.png';
import critico from '@/assets/critico.png';
import estable from '@/assets/estable.png';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const op = ref();
const alerts = ref([]);
const fullName = ref('');
const initials = ref('');
const alertsCount = ref(0);
let pollingInterval;

const toggle = (event) => {
    op.value.toggle(event);
}

const getIconPath = (status) => {
    switch (status.toLowerCase()) {
        case 'critico':
            return critico;
        case 'medio':
            return medio;
        case 'estable':
        default:
            return estable;
    }
};

const fetchAlerts = async () => {
    const response = await fetch('http://localhost:5000/api/alerts');
    const data = await response.json();
    alerts.value = data.map(alert => ({
        ...alert,
        iconPath: getIconPath(alert.status)
    }));
    alertsCount.value = alerts.value.length;
};

const startPolling = () => {
    pollingInterval = setInterval(fetchAlerts, 3000);
};

const stopPolling = () => {
    clearInterval(pollingInterval);
};

onMounted(async () => {
    await fetchAlerts();

    const user = localStorage.getItem('loggedInUser');
    if (user) {
        console.log('User:', JSON.parse(user));
    }

    fullName.value = user ? JSON.parse(user).firstname + ' ' + JSON.parse(user).lastname : '';
    initials.value = fullName.value.split(' ').map((n) => n[0]).join('');

    startPolling();
});

onUnmounted(() => {
    stopPolling();
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img alt="Logo" src="../views/pages/auth/Content/lOGO.svg" style="width: 100px" />
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <Button text @click="toggle">
                    <OverlayBadge :value="alertsCount">
                        <i class="pi pi-bell" style="font-size: 17.5px" />
                    </OverlayBadge>
                   </Button>
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button" class="layout-topbar-action layout-topbar-action-highlight">
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <Popover ref="op">
                <div class="flex flex-col gap-4">
                    <div>
                        <span class="font-medium block mb-2">Alertas</span>
                        <ul class="list-none p-0 m-0 flex flex-col">
                            <li v-for="alert in alerts" :key="alert._id" class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border">
                                <img :src="alert.iconPath" alt="Icon" class="w-6 h-6" />
                                <span class="font-medium text-surface-900 dark:text-surface-0">
                                    {{ alert.message }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Popover>

            <button class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div cass="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                   <Avatar :label="initials" class="mr-2" style="background-color: #ece9fc; color: #2a1261; width: 35px;; height: 35px" shape="circle" />
                </div>
            </div>
        </div>
    </div>
</template>
