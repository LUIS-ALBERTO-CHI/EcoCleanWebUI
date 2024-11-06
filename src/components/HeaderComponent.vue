<template>
    <div class="card">
        <Menubar :model="items" class="w-full">
            <template #item="{ item, props, hasSubmenu, root }" >
                <a v-ripple class="flex items-center" v-bind="props.action">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                    <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                    <span v-if="item.shortcut"
                        class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
                        item.shortcut }}</span>
                    <i v-if="hasSubmenu"
                        :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
                </a>
            </template>
            <template #start>
                <img src="../assets/logo.png" alt="">
            </template>
            <template #end>
                <div class="flex align-items-center justify-content-center gap-2">
                    <div v-if="isLoggedIn" class="flex align-items-center gap-2">
                        <Avatar :label="firstInitial" size="large" shape="circle" />
                        <span>{{ firstname }}</span>
                        <Button label="Salir" text plain icon="pi pi-sign-out" @click="handleLogout" iconPos="right" />
                    </div>
                </div>
            </template>
        </Menubar>
    </div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Badge from 'primevue/badge';
import Button from 'primevue/button';

export default {
    components: {
        Menubar,
        Avatar,
        InputText,
        Badge,
        Button
    },
    props: {
        isLoggedIn: Boolean,
        firstname: String,
        userRole: String
    },
    data() {
        return {
            items: [
                {
                    label: 'Rutas',
                    icon: 'pi pi-map',
                },
                {
                    label: 'Botes',
                    icon: 'pi pi-trash',
                    badge: 3,
                    items: [
                        {
                            label: 'Core',
                            icon: 'pi pi-bolt',
                            shortcut: '⌘+S'
                        },
                        {
                            label: 'Blocks',
                            icon: 'pi pi-server',
                            shortcut: '⌘+B'
                        },
                        {
                            separator: true
                        },
                        {
                            label: 'UI Kit',
                            icon: 'pi pi-pencil',
                            shortcut: '⌘+U'
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        handleLogout() {
            localStorage.removeItem('accessToken');
            this.$emit('logout');
        },
    }, 
    computed: {
        isAdmin() {
            return this.userRole == 2 ? true : false;
        },
        firstInitial() {
            if (this.firstname){
                return this.firstname.charAt(0);
            }
        }
    }
};
</script>

<style lang="css" scoped>
img{
    width: 100px;
}

@media (max-width: 800px) {
    img {
        width: 40px;
        padding: 0;
        margin: 0;
    }
}
</style>