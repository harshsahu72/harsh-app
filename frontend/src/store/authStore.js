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
          const message = err.response?.data?.message || 'Login failed.';
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
          const message = err.response?.data?.message || 'Signup failed.';
          set({ error: message, isLoading: false });
          return { success: false, message };
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
