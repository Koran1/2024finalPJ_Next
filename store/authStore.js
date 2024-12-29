import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ 
          isAuthenticated: true, 
          token, 
          user 
        });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ 
          isAuthenticated: false, 
          token: null, 
          user: null 
        });
      },
      // 앱 시작 시 로컬 스토리지에서 상태 복원
      hydrate: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
          set({
            isAuthenticated: true,
            token,
            user
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

// 앱 시작 시 상태 복원
if (typeof window !== 'undefined') {
  useAuthStore.getState().hydrate();
}

export default useAuthStore; 