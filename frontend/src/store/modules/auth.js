// src/store/modules/auth.js
import axios from 'axios';

const state = {
  token: localStorage.getItem('token') || '',
  user: null,
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  CLEAR_TOKEN(state) {
    state.token = '';
    localStorage.removeItem('token');
  },
  SET_USER(state, user) {
    state.user = user;
  },
};

const actions = {
  async fetchUser({ commit, state }) {
    if (state.token) {
      try {
        const response = await axios.get('http://localhost:5001/users/me', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        commit('SET_USER', response.data);
      } catch (error) {
        console.error('Ошибка получения данных пользователя', error);
        commit('CLEAR_TOKEN');
      }
    }
  },
  logout({ commit }) {
    commit('CLEAR_TOKEN');
  },
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  user: (state) => state.user,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
