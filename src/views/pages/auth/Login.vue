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
                        <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                    </div>

                    <div>
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email1" type="text" placeholder="Direccion de correo"
                            class="w-full md:w-[30rem] mb-8" v-model="mail" />

                        <label for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Min. 8 caracteres" :toggleMask="true"
                            class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recordar </label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Recuperar
                                contraseña</span>
                        </div>
                        <Button label="Iniciar sesión" class="w-full" @click="login"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Button from 'primevue/button';

export default {
    name: 'LoginPage',
    components: {
        Button
    },
    data() {
        return {
            mail: '',
            password: '',
            error: ''
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:5000/api/user/login', {
                    mail: this.mail,
                    password: this.password
                });

                const token = response.data.accessToken;
                const user = response.data.user;

                console.log(token, user);
                localStorage.setItem('accessToken', token);
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                this.$emit('login-success', token);
                this.$router.push('/dashboard');
            } catch (err) {
                this.error = 'Login failed. Please check your credentials and try again.';
            }
        }
    }
};
</script>


<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
