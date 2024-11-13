<!-- src/components/Navbar.vue -->
<template>
    <v-app-bar app>
      <v-toolbar-title>Мое Приложение</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text :to="'/'">Главная</v-btn>
      <v-btn text v-if="!isAuthenticated" :to="'/register'">Регистрация</v-btn>
      <v-btn text v-if="!isAuthenticated" :to="'/login'">Вход</v-btn>
      <v-btn text v-else @click="logout">Выйти</v-btn>
    </v-app-bar>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'Navbar',
    setup() {
      const store = useStore();
      const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
  
      const logout = () => {
        store.dispatch('auth/logout');
      };
  
      return { isAuthenticated, logout };
    },
  };
  </script>
  