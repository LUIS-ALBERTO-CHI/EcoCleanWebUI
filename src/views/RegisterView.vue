<template>
    <div class="container">
    <Toast />
      <div class="box">
        <h3>Bienvenido a la aplicación Eco Clean</h3>
        <span class="p1">Crear una cuenta</span>
        <form @submit.prevent="createUser">
            <div class="input">
            <input type="firstname" id="firstname" v-model="firstname" required placeholder="Nombre (s)">
          </div>
          <div class="input">
            <input type="lastname" id="lastname" v-model="lastname" required placeholder="Apellidos">
          </div>
          <div class="input">
            <input type="mail" id="mail" v-model="mail" required placeholder="Correo">
          </div>
          <div class="input">
            <input type="password" id="password" v-model="password" required placeholder="Contraseña"/>
          </div>
          <button type="submit">Registrarse</button>
        </form>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Password from 'primevue/password';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';

export default {
    components: {
        Card,
        InputText,
        Button,
        Password,
        Toast
    },

    data() {
        return {

            firstname: '',
            lastname: '',
            mail: '',
            password: '',
        }
    },

    methods: {
        async createUser() {
            try {
                const response = await axios.post('http://localhost:5000/api/user/register', {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    mail: this.mail,
                    password: this.password
                });
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'User created successfully', life: 3000 });
                this.$router.push('/login');
            } catch (error) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user', life: 3000 });
                console.error(error);
            }
        }
    }
};
</script>

<style scoped>
*{
    margin: 20px;
    padding: 0;
    font-family: sans-serif;
}

.container{
    display: flex;
    justify-content: center;
}

.box{
    width: 640px;
    height: 60vh;
    background-color: #f9fafb;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

.logo{
    width: 300px;
    cursor: pointer;
    margin: 12px 0;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, .5));
}

.img{
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, .4));
}

p{
    font-size: 26px;
    font-weight: bold;
}

.p1{
    font-size: 15px;
    margin-top: 8px;
}

.input{
    display: flex;
    align-items: center;
    width: 300px;
    height: 42px;
    border: 2px solid #ccc;
    border-radius: 8px;
    margin-top: 12px;
}

.input input{
    outline: 0;
    border: 0;
    font-size: 17px;
    width: 100%;
    padding: 5px 8px;
    background-color: transparent;
}

button {
    width: 300px;
    border: 0;
    background-color: #ccc;
    margin-top: 12px;
    font-size: 18px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 12px;
    cursor: pointer;
}

.button{
  width: 300px;
    border: 0;
    background-color: #ccc;
    margin-top: 12px;
    font-size: 18px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 12px;
    cursor: pointer;
}

label{
    font-size: 17px;
    font-weight: bold;
    color: #444;
    margin-top: 12px;
}

label input{
    margin-right: 5px;
    cursor: pointer;
}
</style>