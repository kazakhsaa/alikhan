<!-- src/App.vue -->
<template>
  <v-app>
    <Navbar />
    <router-view></router-view>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>
