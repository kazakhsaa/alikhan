// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './utils/axios';
import { VuelidatePlugin } from '@vuelidate/core'; // Правильный импорт для Vue 3

// Установка токена из localStorage при инициализации приложения
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VuelidatePlugin); // Регистрация VuelidatePlugin
app.mount('#app');
