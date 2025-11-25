/**
 * ============================================================
 * SAFARIA Platform - Authentication Store (Zustand)
 * ============================================================
 * Manages user authentication state and actions
 * ============================================================
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import api from '../utils/api';

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ============================================================
        // AUTH STATE
        // ============================================================
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        
        // ============================================================
        // LOGIN ACTION
        // ============================================================
        login: async (email, password) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await api.login({ email, password });
            const { user, token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
            
            return { success: true, user };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur de connexion';
            set({ 
              error: errorMessage, 
              isLoading: false,
              isAuthenticated: false 
            });
            
            return { success: false, error: errorMessage };
          }
        },
        
        // ============================================================
        // REGISTER ACTION
        // ============================================================
        register: async (userData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await api.register(userData);
            const { user, token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
            
            return { success: true, user };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur d\'inscription';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            
            return { success: false, error: errorMessage };
          }
        },
        
        // ============================================================
        // LOGOUT ACTION
        // ============================================================
        logout: () => {
          // Clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            error: null 
          });
        },
        
        // ============================================================
        // UPDATE PROFILE ACTION
        // ============================================================
        updateProfile: async (userId, profileData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await api.updateProfile(userId, profileData);
            const updatedUser = response.data.user;
            
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            set({ 
              user: updatedUser, 
              isLoading: false,
              error: null 
            });
            
            return { success: true, user: updatedUser };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur de mise à jour';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            
            return { success: false, error: errorMessage };
          }
        },
        
        // ============================================================
        // CHANGE PASSWORD ACTION
        // ============================================================
        changePassword: async (currentPassword, newPassword) => {
          set({ isLoading: true, error: null });
          
          try {
            await api.changePassword({ currentPassword, newPassword });
            
            set({ 
              isLoading: false,
              error: null 
            });
            
            return { success: true };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur de changement de mot de passe';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            
            return { success: false, error: errorMessage };
          }
        },
        
        // ============================================================
        // CHECK AUTH STATUS (Restore from localStorage)
        // ============================================================
        checkAuth: () => {
          const token = localStorage.getItem('token');
          const userStr = localStorage.getItem('user');
          
          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              set({ 
                user, 
                token, 
                isAuthenticated: true 
              });
            } catch (error) {
              // Invalid stored data, clear it
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              set({ 
                user: null, 
                token: null, 
                isAuthenticated: false 
              });
            }
          }
        },
        
        // ============================================================
        // CLEAR ERROR
        // ============================================================
        clearError: () => set({ error: null }),
        
        // ============================================================
        // UTILITY: Check if user is admin
        // ============================================================
        isAdmin: () => {
          const state = get();
          return state.user?.role === 'admin';
        },
      }),
      {
        name: 'safaria-auth-storage',
        partialize: (state) => ({ 
          user: state.user, 
          token: state.token,
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    {
      name: 'safaria-auth-store',
      enabled: import.meta.env.DEV,
    }
  )
);

export default useAuthStore;
