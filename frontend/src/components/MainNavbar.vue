<template>
    <nav>
      <router-link to="/">Home</router-link>
      <div v-if="isLoggedIn">
        <span>Welcome, {{ user.name }}</span>
        <button @click="logout">Logout</button>
      </div>
      <div v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </div>
    </nav>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'MainNavbar',
    computed: {
      ...mapGetters(['isLoggedIn', 'user']),
    },
    methods: {
      ...mapActions(['logout']),
    },
  };
  </script>
  
  <style>
  </style>
  