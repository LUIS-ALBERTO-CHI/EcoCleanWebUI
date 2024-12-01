<template>
    <FloatingConfigurator />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="flex justify-center">
                            <img src="./Content/lOGO.svg" style="width: 150px;" class="mb-4" />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido a Eco
                            Clean!</div>
                        <span class="text-muted-color font-medium">Crea una cuenta para continuar</span>
                    </div>

                    <div>
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email1" type="text" placeholder="Direccion de correo"
                            class="w-full md:w-[30rem] mb-2" v-model="mail" />
                        <Message v-if="emailError" severity="error" class="mb-8"> Correo no valido </Message>

                        <label for="firstname"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nombre
                            (s)</label>
                        <InputText id="firstname" type="text" placeholder="Nombre" class="w-full md:w-[30rem] mb-8"
                            v-model="firstname" />

                        <label for="lastname"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Apellidos</label>
                        <InputText id="firstname" type="text" placeholder="Apellidos" class="w-full md:w-[30rem] mb-8"
                            v-model="lastname" />

                        <label for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Min. 8 caracteres" :toggleMask="true" :invalid="password == ''"
                            class="mb-2" fluid :feedback="false"></Password>
                        <Message v-if="passwordError" severity="error"class="mb-4" >La contraseña debe tener al menos 8 caracteres</Message>

                        <Button label="Registrarse" class="w-full" @click="createUser"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Password from 'primevue/password';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import Message from 'primevue/message';

export default {
    components: {
        InputText,
        Button,
        Password,
        Toast,
        Message
    },

    data() {
        return {
            firstname: '',
            lastname: '',
            mail: '',
            password: '',
            emailError: false,
            passwordError: false
        }
    },

    methods: {
        async createUser() {
            this.emailError = !this.validateEmail(this.mail);
            this.passwordError = this.password.length < 8;

            if (this.emailError || this.passwordError) {
                return;
            }

            try {
                const response = await axios.post('https://ecocleantype-ecoclean.up.railway.app/api/users', {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    mail: this.mail,
                    password: this.password
                });
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'User created successfully', life: 3000 });
                this.$router.push('/auth/login');
            } catch (error) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user', life: 3000 });
                console.error(error);
            }
        },
        validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
            return re.test(email);
        }
    }
};
</script>