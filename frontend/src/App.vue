<!-- src/App.vue -->
<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/MainNavbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>
