import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,                 // 사용자 정보
            token: null,                // JWT 정보
            isAuthenticated: false,    // 로그인 여부

            // 처리
            login: (user, token) => set(({ user, token, isAuthenticated: true })),
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                })

                // local storage 에서 삭제
                localStorage.removeItem("auth.storage");
            },
            reset: () => {
                set({ user: null, token: null, isAuthenticated: false });
            }
        }),
        {
            name: "auth-storage",
            getStorage: () => localStorage
        }
    ))

export default useAuthStore;
