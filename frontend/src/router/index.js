import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import UserRegister from '../components/UserRegister.vue';
import UserLogin from '../components/UserLogin.vue';
import Dashboard from '../components/Dashboard.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister,
    meta: { requiresGuest: true },
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin,
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
    next('/login');
  } else if (to.meta.requiresGuest && store.getters.isLoggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
