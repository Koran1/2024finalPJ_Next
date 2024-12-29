import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/authStore";

const ProtectedPage = () => {
    const router = useRouter();
    const { isAuthenticated, token, isExpired } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || !token || isExpired()) {
            alert("로그인이 필요한 서비스입니다.");
            router.push("/user/login"); // Redirect to login page
        }
    }, [isAuthenticated, token, isExpired, router]);

};

export default ProtectedPage;
