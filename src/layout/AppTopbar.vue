<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { onMounted, ref } from 'vue';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

const alerts = ref([]);
const fullName = ref('');
const initials = ref('');

onMounted(async () => {
    const response = await fetch('http://localhost:5000/api/alerts');
    const data = await response.json();
    alerts.value = data.length;

    const user = localStorage.getItem('loggedInUser');
    if (user) {
        console.log('User:', JSON.parse(user));
    }

    fullName.value = user ? JSON.parse(user).firstname + ' ' + JSON.parse(user).lastname : '';

    initials.value = fullName.value.split(' ').map((n) => n[0]).join('');
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
                <Button text>
                    <OverlayBadge :value="4">
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
