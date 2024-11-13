// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import LoginPage from '../views/LoginPage.vue';
import VerifyMFAPage from '../views/VerifyMFAPage.vue'; // Если компонент существует
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/verify-mfa',
    name: 'VerifyMFAPage',
    component: VerifyMFAPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Защита маршрутов
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'LoginPage' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
