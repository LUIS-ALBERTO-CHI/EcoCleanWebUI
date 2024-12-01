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
const notification = ref(null);
const avatarPopover = ref(null);

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

const showNotification = (alert) => {
    if (isMobile) {
        notification.value = {
            message: `Alerta: ${alert.message} ahora es ${alert.status}`,
            icon: getIconPath(alert.status)
        };
        setTimeout(() => {
            notification.value = null;
        }, 5000);
    } else {
        if (Notification.permission === 'granted') {
            new Notification('El estado de la alerta ha cambiado', {
                body: `Alerta: ${alert.message} ahora es ${alert.status}`,
                icon: getIconPath(alert.status)
            });
        }
    }
};

const fetchAlerts = async () => {
    const response = await fetch('https://ecocleantype-ecoclean.up.railway.app/api/alerts');
    const data = await response.json();
    const today = new Date().toISOString().split('T')[0];
    const todayAlerts = data.filter(alert => alert.dateCreation.split('T')[0] === today);
    todayAlerts.forEach(alert => {
        const existingAlert = alerts.value.find(a => a._id === alert._id);
        if (existingAlert && existingAlert.status !== alert.status) {
            showNotification(alert);
        }
    });
    alerts.value = todayAlerts.map(alert => ({
        ...alert,
        iconPath: getIconPath(alert.status)
    }));
    alertsCount.value = alerts.value.length;

    console.log('Alerts:', alerts.value);
};

const startPolling = () => {
    pollingInterval = setInterval(fetchAlerts, 3000);
};

const stopPolling = () => {
    clearInterval(pollingInterval);
};

const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('Permiso de notificación denegado. Por favor, habilítalo en la configuración de tu navegador.');
        }
    } catch (error) {
        console.error('Error al solicitar permiso de notificación:', error);
    }
};

const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('loggedInUser');
    window.location.href = '/auth/login';
};

const toggleAvatarPopover = (event) => {
    avatarPopover.value.toggle(event);
};

onMounted(async () => {
    await fetchAlerts();

    const user = localStorage.getItem('loggedInUser');
    if (user) {
        console.log('User:', JSON.parse(user));
    }

    fullName.value = user ? JSON.parse(user).firstname + ' ' + JSON.parse(user).lastname : '';
    initials.value = fullName.value.split(' ').map((n) => n[0]).join('');

    if (!('Notification' in window)) {
        alert('Este navegador no soporta notificaciones de escritorio. Por favor, utiliza un navegador compatible como Chrome, Firefox, Edge o Safari.');
    } else {
        await requestNotificationPermission();
    }

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

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <Popover ref="avatarPopover">
                        <div class="flex flex-col gap-4">
                            <Button @click="logout" text label="Cerrar sesión" icon="pi pi-sign-out" icon-pos="right"/>
                        </div>
                    </Popover>
                    <Avatar :label="initials" class="mr-2" style="background-color: #ece9fc; color: #2a1261; width: 35px; height: 35px" shape="circle" @click="toggleAvatarPopover" />
                </div>
            </div>
        </div>

        <div v-if="notification" class="notification-card">
            <img :src="notification.icon" alt="Icon" class="notification-icon" />
            <span class="notification-message">{{ notification.message }}</span>
        </div>
    </div>
</template>

<style scoped>
.notification-card {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 10px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1000;
    animation: slide-down 0.5s ease-out;
}

.notification-icon {
    width: 24px;
    height: 24px;
}

.notification-message {
    font-size: 14px;
    color: #333;
}

@keyframes slide-down {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}
</style>
