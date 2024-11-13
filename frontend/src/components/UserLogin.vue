<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label>Email:</label>
          <input v-model="email" type="email" />
        </div>
        <div>
          <label>Password:</label>
          <input v-model="password" type="password" />
        </div>
        <button type="submit">Login</button>
        <p v-if="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'UserLogin',
    data() {
      return {
        email: '',
        password: '',
        error: '',
      };
    },
    methods: {
      ...mapActions(['login']),
      async login() {
        try {
          await this.login({
            email: this.email,
            password: this.password,
          });
          this.$router.push('/dashboard');
        } catch (err) {
          this.error = 'Login failed. Please check your credentials.';
        }
      },
    },
  };
  </script>
  