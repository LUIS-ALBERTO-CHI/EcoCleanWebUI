<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    fetchUsers();
});

const toast = useToast();
const users = ref([]);

const fetchUsers = async () => {
    try {
        const response = await fetch('https://ecocleantype-ecoclean.up.railway.app/api/users');
        const data = await response.json();
        users.value = data;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
};


</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                </template>
            </Toolbar>

            <DataTable
                :value="users"
                dataKey="_id"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Lista de usuarios</h4>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="_id" header="Id" sortable style="min-width: 12rem"></Column>
                <Column field="firstname" header="Nombre(s)" sortable style="min-width: 16rem"></Column>
                <Column field="lastname" header="Apellidos" sortable style="min-width: 16rem"></Column>
                <Column field="mail" header="Correo electrónico" sortable style="min-width: 16rem"></Column>
                <Column field="isAdmin" header="Administrador" sortable style="min-width: 16rem"></Column>
            </DataTable>
        </div>

    </div>
</template>
