import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null, // 사용자 정보
            token: null, // JWT 토큰
            isAuthenticated: false, // 로그인 여부
            expiresAt: null, // 토큰 만료 시간


            // 로그인 처리
            login: (user, token) => {
                const expirationTime = Date.now() + 3600000; // 1시간
                set({ user, token, isAuthenticated: true, expiresAt: expirationTime });
            },

            // 로그아웃 처리
            logout: () => {
                set({ user: null, token: null, isAuthenticated: false, expiresAt: null });

                // 추가로 로컬 스토리지에서 삭제 (보안 강화)
                localStorage.removeItem("auth-storage");
            },

            // 토큰 만료 여부 확인
            isExpired: () => {
                const { logout, expiresAt } = get();
                if (expiresAt && Date.now() > expiresAt) {
                    logout();
                    return true;
                } else {
                    return false;
                }
            },


        }),
        {
            name: "auth-storage", // 로컬스토리지 키 이름
            getStorage: () => localStorage, // 로컬스토리지 사용
        }
    )
);

export default useAuthStore;