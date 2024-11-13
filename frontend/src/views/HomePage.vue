<!-- src/views/HomePage.vue -->
<template>
  <v-container>
    <h2>Добро пожаловать, {{ user.name }}!</h2>
    <p>Email: {{ user.email }}</p>
  </v-container>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HomePage',
  setup() {
    const store = useStore();
    const user = computed(() => store.getters['auth/user']);

    onMounted(() => {
      store.dispatch('auth/fetchUser');
    });

    return { user };
  },
};
</script>
