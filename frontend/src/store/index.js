import { createStore } from 'vuex';
import axios from '../utils/axios';

const store = createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: {},
    status: '',
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, { token, user }) {
      state.status = 'success';
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.user = {};
    },
  },
  actions: {
    async login({ commit }, user) {
      commit('auth_request');
      try {
        const res = await axios.post('/auth/login', user);
        const token = res.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const userRes = await axios.get('/users/me');
        commit('auth_success', { token, user: userRes.data });
      } catch (err) {
        commit('auth_error');
        localStorage.removeItem('token');
        throw err;
      }
    },
    async register({ commit }, user) {
      commit('auth_request');
      try {
        const res = await axios.post('/auth/register', user);
        const token = res.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const userRes = await axios.get('/users/me');
        commit('auth_success', { token, user: userRes.data });
      } catch (err) {
        commit('auth_error');
        localStorage.removeItem('token');
        throw err;
      }
    },
    logout({ commit }) {
      commit('logout');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    user: state => state.user,
  },
});

export default store;
