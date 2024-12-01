<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const getAccessToken = () => {
    return localStorage.getItem('loggedInUser');
};

const isAdmin = () => {
    const token = getAccessToken();
    return token ? JSON.parse(token).isAdmin : false;
};

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Mapa', icon: 'pi pi-fw pi-map', to: '/dashboard' }]
    },
    ...(isAdmin() ? [{
        label: 'Páginas',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/users' },
        ]
    }] : [])
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
