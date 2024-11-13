<template>
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {{ user.name }}!</p>
      <p>Your email: {{ user.email }}</p>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters(['user']),
    },
  };
  </script>
  