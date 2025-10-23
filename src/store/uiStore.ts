import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  data?: any;
}

interface UIStore {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;

  // Sidebar (desktop)
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  // Modals
  modals: Record<string, ModalState>;
  openModal: (modalId: string, data?: any) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
  getModalData: (modalId: string) => any;

  // Drawer (mobile)
  isDrawerOpen: boolean;
  drawerContent: string | null;
  openDrawer: (content: string) => void;
  closeDrawer: () => void;

  // Selected items (pour React Flow, listes, etc.)
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // Loading overlay
  isGlobalLoading: boolean;
  setGlobalLoading: (isLoading: boolean) => void;

  // Toast/Notification temporaire
  toast: {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Theme
  isDarkMode: typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
    : true,
  
  toggleDarkMode: () => {
    const newMode = !get().isDarkMode;
    set({ isDarkMode: newMode });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newMode);
    }
  },
  
  setDarkMode: (isDark) => {
    set({ isDarkMode: isDark });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  },

  // Sidebar
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  // Modals
  modals: {},
  
  openModal: (modalId, data) => set((state) => ({
    modals: {
      ...state.modals,
      [modalId]: { isOpen: true, data },
    },
  })),
  
  closeModal: (modalId) => set((state) => ({
    modals: {
      ...state.modals,
      [modalId]: { isOpen: false, data: undefined },
    },
  })),
  
  isModalOpen: (modalId) => {
    const modal = get().modals[modalId];
    return modal?.isOpen ?? false;
  },
  
  getModalData: (modalId) => {
    const modal = get().modals[modalId];
    return modal?.data;
  },

  // Drawer
  isDrawerOpen: false,
  drawerContent: null,
  openDrawer: (content) => set({ isDrawerOpen: true, drawerContent: content }),
  closeDrawer: () => set({ isDrawerOpen: false, drawerContent: null }),

  // Selected items
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // Loading
  isGlobalLoading: false,
  setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),

  // Toast
  toast: {
    isVisible: false,
    message: '',
    type: 'info',
  },
  
  showToast: (message, type) => set({
    toast: { isVisible: true, message, type },
  }),
  
  hideToast: () => set((state) => ({
    toast: { ...state.toast, isVisible: false },
  })),
}));