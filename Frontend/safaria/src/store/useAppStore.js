/**
 * ============================================================
 * SAFARIA Platform - Global State Management (Zustand)
 * ============================================================
 * Centralized state management for the application
 * ============================================================
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { defaultLanguage } from '../utils/i18n';

const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ============================================================
        // LANGUAGE STATE
        // ============================================================
        language: defaultLanguage,
        
        setLanguage: (lang) => {
          set({ language: lang });
          // Update document direction for RTL languages
          document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = lang;
        },
        
        // ============================================================
        // LOADING STATE
        // ============================================================
        isLoading: false,
        loadingMessage: '',
      
      setLoading: (isLoading, message = '') => 
        set({ isLoading, loadingMessage: message }),
      
      // ============================================================
      // ERROR STATE
      // ============================================================
      error: null,
      errorMessage: '',
      
      setError: (error, message = '') => 
        set({ error, errorMessage: message }),
      
      clearError: () => 
        set({ error: null, errorMessage: '' }),
      
      // ============================================================
      // GLOBAL DIALOG/MODAL STATE
      // ============================================================
      dialogOpen: false,
      dialogType: null, // 'success', 'error', 'confirm', 'info'
      dialogTitle: '',
      dialogMessage: '',
      dialogAction: null,
      
      openDialog: (type, title, message, action = null) => 
        set({ 
          dialogOpen: true, 
          dialogType: type, 
          dialogTitle: title, 
          dialogMessage: message,
          dialogAction: action 
        }),
      
      closeDialog: () => 
        set({ 
          dialogOpen: false, 
          dialogType: null, 
          dialogTitle: '', 
          dialogMessage: '',
          dialogAction: null 
        }),
      
      // ============================================================
      // SELECTED ITEM STATE (For Map & Details)
      // ============================================================
      selectedItem: null,
      selectedItemType: null, // 'artisanat', 'sejour', 'caravane'
      
      setSelectedItem: (item, type) => 
        set({ selectedItem: item, selectedItemType: type }),
      
      clearSelectedItem: () => 
        set({ selectedItem: null, selectedItemType: null }),
      
      // ============================================================
      // MAP STATE
      // ============================================================
      mapCenter: [31.7917, -7.0926], // Morocco center (default)
      mapZoom: 6,
      showMapMarkers: true,
      
      setMapCenter: (center) => 
        set({ mapCenter: center }),
      
      setMapZoom: (zoom) => 
        set({ mapZoom: zoom }),
      
      toggleMapMarkers: () => 
        set((state) => ({ showMapMarkers: !state.showMapMarkers })),
      
      // Focus map on specific item
      focusOnItem: (latitude, longitude, zoom = 13) => 
        set({ 
          mapCenter: [latitude, longitude], 
          mapZoom: zoom 
        }),
      
      // ============================================================
      // FILTER STATE
      // ============================================================
      activeFilters: {
        category: 'all', // 'all', 'artisanat', 'sejour', 'caravane'
        priceRange: [0, 5000],
        searchQuery: '',
      },
      
      setFilter: (filterKey, value) => 
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            [filterKey]: value
          }
        })),
      
      setFilters: (filters) => 
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            ...filters
          }
        })),
      
      resetFilters: () => 
        set({
          activeFilters: {
            category: 'all',
            priceRange: [0, 5000],
            searchQuery: '',
          }
        }),
      
      // ============================================================
      // USER STATE
      // ============================================================
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => 
        set({ user, isAuthenticated: !!user }),
      
      clearUser: () => 
        set({ user: null, isAuthenticated: false }),
      
      // ============================================================
      // ITEMS CACHE (To avoid redundant API calls)
      // ============================================================
      artisans: [],
      sejours: [],
      caravanes: [],
      lastFetched: null,
      
      setArtisans: (artisans) => 
        set({ artisans, lastFetched: new Date() }),
      
      setSejours: (sejours) => 
        set({ sejours, lastFetched: new Date() }),
      
      setCaravanes: (caravanes) => 
        set({ caravanes, lastFetched: new Date() }),
      
      setAllItems: (artisans, sejours, caravanes) => 
        set({ 
          artisans, 
          sejours, 
          caravanes, 
          lastFetched: new Date() 
        }),
      
      clearItemsCache: () => 
        set({ 
          artisans: [], 
          sejours: [], 
          caravanes: [], 
          lastFetched: null 
        }),
      
      // Get all items as a single array
      getAllItems: () => {
        const state = get();
        return [
          ...state.artisans.map(item => ({ ...item, type: 'artisanat' })),
          ...state.sejours.map(item => ({ ...item, type: 'sejour' })),
          ...state.caravanes.map(item => ({ ...item, type: 'caravane' })),
        ];
      },
      
      // Get filtered items based on active filters
      getFilteredItems: () => {
        const state = get();
        let items = state.getAllItems();
        const { category, priceRange, searchQuery } = state.activeFilters;
        
        // Filter by category
        if (category !== 'all') {
          items = items.filter(item => item.type === category);
        }
        
        // Filter by price range
        items = items.filter(
          item => item.price >= priceRange[0] && item.price <= priceRange[1]
        );
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          items = items.filter(
            item =>
              item.name?.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query)
          );
        }
        
        return items;
      },
      
      // ============================================================
      // RESERVATION STATE
      // ============================================================
      reservationData: null,
      
      setReservationData: (data) => 
        set({ reservationData: data }),
      
      clearReservationData: () => 
        set({ reservationData: null }),
      
      // ============================================================
      // MOBILE MENU STATE
      // ============================================================
      mobileMenuOpen: false,
      
      toggleMobileMenu: () => 
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      
      closeMobileMenu: () => 
        set({ mobileMenuOpen: false }),
      
      // ============================================================
      // TOAST NOTIFICATIONS STATE
      // ============================================================
      toasts: [],
      
      addToast: (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        set((state) => ({
          toasts: [...state.toasts, { id, message, type, duration }]
        }));
        
        // Auto-remove toast after duration
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
          }));
        }, duration);
      },
      
      removeToast: (id) => 
        set((state) => ({
          toasts: state.toasts.filter(toast => toast.id !== id)
        })),
      
      // ============================================================
      // UTILITY ACTIONS
      // ============================================================
      
      // Reset all state to initial values
      resetStore: () => 
        set({
          isLoading: false,
          loadingMessage: '',
          error: null,
          errorMessage: '',
          dialogOpen: false,
          dialogType: null,
          dialogTitle: '',
          dialogMessage: '',
          dialogAction: null,
          selectedItem: null,
          selectedItemType: null,
          activeFilters: {
            category: 'all',
            priceRange: [0, 5000],
            searchQuery: '',
          },
          artisans: [],
          sejours: [],
          caravanes: [],
          lastFetched: null,
          reservationData: null,
          mobileMenuOpen: false,
          toasts: [],
        }),
      }),
      {
        name: 'safaria-storage',
        partialize: (state) => ({ 
          language: state.language,
        }),
      }
    ),
    {
      name: 'safaria-store',
      enabled: import.meta.env.DEV, // Enable devtools only in development
    }
  )
);

export default useAppStore;

