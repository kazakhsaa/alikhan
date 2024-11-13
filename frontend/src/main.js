// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Импорт Vuetify
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // Убедитесь, что пакет установлен
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Импорт Toastification
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Создание экземпляра Vuetify
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});

const app = createApp(App);

router.beforeEach((to, from, next) => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    store.commit('auth/SET_TOKEN', token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  next();
});

// Используем Toastification и Vuetify
app.use(store)
   .use(router)
   .use(vuetify)
   .use(Toast, { position: POSITION.TOP_RIGHT })
   .mount('#app');
