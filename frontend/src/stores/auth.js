import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this._setSession(data.data.user, data.data.token);
    },
    async register(nombre, email, password) {
      const { data } = await api.post('/auth/register', { nombre, email, password });
      this._setSession(data.data.user, data.data.token);
    },
    async logout() {
      try { await api.post('/auth/logout'); } catch {}
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    _setSession(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }
  }
});