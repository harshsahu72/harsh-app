import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('flamr_token', data.token);
          return { success: true, message: data.message };
        } catch (err) {
          console.error('Login error details:', err);
          let message = 'Login failed. ';
          if (err.response) {
            message = err.response.data?.message || `Server error: ${err.response.status}`;
          } else if (err.request) {
            message = 'Network error. Could not connect to the server.';
          } else {
            message = err.message;
          }
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      signup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/signup', formData);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('flamr_token', data.token);
          return { success: true, message: data.message };
        } catch (err) {
          console.error('Signup error details:', err);
          let message = 'Signup failed. ';
          if (err.response) {
            message = err.response.data?.message || `Server error: ${err.response.status}`;
          } else if (err.request) {
            message = 'Network error. Could not connect to the server.';
          } else {
            message = err.message;
          }
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('flamr_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const { data } = await api.get('/auth/me');
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          console.error('Session validation failed:', err);
          localStorage.removeItem('flamr_token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: (userData) => {
        set((state) => ({ user: { ...state.user, ...userData } }));
      },

      logout: () => {
        localStorage.removeItem('flamr_token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'flamr-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
