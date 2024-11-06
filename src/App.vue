<script>
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'

export default {
  components: {
    RouterLink,
    RouterView,
    HeaderComponent
  },
  data() {
    return {
      isLoggedIn: false,
      firstname: '',
      userRole: null
    };
  },
  methods: {
    handleLogin(token) {
    if (!token) {
      console.error('Invalid token received:', token);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));

      console.log(user);

      this.isLoggedIn = true;
      this.firstname = user.firstname;

    } catch (error) {
      console.error('Error accessing user data:', error);
    }
  },
  handleLogout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('loggedInUser');
      this.isLoggedIn = false;
      this.username = '';
      this.$router.push('/');
    },
    checkAuth() {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('loggedInUser');

      if (token && user) {
        try {
          const payloadBase64 = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));

          // Actualizar el estado de autenticación
          this.isLoggedIn = true;
          console.log('User logged in', decodedPayload);

          // Recuperar y asignar los datos del usuario
          const parsedUser = JSON.parse(user);
          this.firstname = parsedUser.firstname;
        } catch (error) {
          console.error('Invalid token or user data:', error);
          this.isLoggedIn = false;
          this.firstname = '';
        }
      }
    }
  },
  mounted() {
    this.checkAuth();
  }
}

</script>

<template>
  <div class="layout">
    <header class="header">
    <HeaderComponent :isLoggedIn="isLoggedIn" :firstname="firstname" @logout="handleLogout" @darkMode="toggleDarkMode"/>
  </header>
  <main class="main-content">
      <RouterView @login-success="handleLogin" :isLoggedIn="isLoggedIn"/>
    </main>

    <footer class="footer">
      <p>Version 1.0 - copyright &copy; 2024, EcoClean</p>
      <img src="./assets/logo.png" alt="">
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.main-content {
  flex: 1;
  margin: 50px;
  margin-bottom: 0px;
  padding-bottom: 0px;
}

.footer {
  color: rgb(2, 2, 2);
  padding: 1rem;
  text-align: center;
}

.footer img {
  width: 100px;
}
</style>
