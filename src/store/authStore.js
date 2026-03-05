import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authAPI.login(email, password);

          // API returns { tokens: { access, refresh }, user: { full_name, is_super_admin, ... } }
          const access = data.tokens?.access || data.access;
          const refresh = data.tokens?.refresh || data.refresh;
          const rawUser = data.user || {};

          // Normalize user shape for the frontend
          const user = {
            id: rawUser.id,
            email: rawUser.email,
            name: rawUser.full_name || rawUser.name || '',
            role: rawUser.role,
            is_superuser: rawUser.is_super_admin || rawUser.is_superuser || false,
          };

          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true, user };
        } catch (err) {
          const errData = err.response?.data;
          // DRF ValidationError wraps messages in non_field_errors array
          const raw =
            errData?.detail ||
            errData?.non_field_errors?.[0] ||
            errData?.error ||
            (typeof errData === 'string' ? errData : null);
          const message = typeof raw === 'string' ? raw : 'Login failed';
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      register: async (formData) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authAPI.register(formData);
          set({ loading: false, error: null });
          return { success: true, data };
        } catch (err) {
          const message = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Registration failed';
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) {
            await authAPI.logout(refreshToken);
          }
        } catch {
          // Ignore logout errors
        } finally {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => set({ error: null }),

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'SUPER_ADMIN' || user?.is_superuser;
      },

      isAgent: () => {
        const { user } = get();
        return user?.role === 'AGENT';
      },
    }),
    {
      name: 'tour-planner-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrate: (state) => {
        // Restore tokens to localStorage on rehydrate
        if (state?.accessToken) {
          localStorage.setItem('access_token', state.accessToken);
        }
        if (state?.refreshToken) {
          localStorage.setItem('refresh_token', state.refreshToken);
        }
      },
    }
  )
);

export default useAuthStore;
