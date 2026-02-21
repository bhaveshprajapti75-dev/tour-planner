import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light' | 'dark'

      toggleTheme: () => set((s) => {
        const next = s.theme === 'light' ? 'dark' : 'light';
        applyThemeClass(next);
        return { theme: next };
      }),

      setTheme: (theme) => {
        applyThemeClass(theme);
        set({ theme });
      },

      initTheme: () => {
        const { theme } = get();
        applyThemeClass(theme);
      },
    }),
    { name: 'swiss-planner-theme' }
  )
);

function applyThemeClass(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export default useThemeStore;
