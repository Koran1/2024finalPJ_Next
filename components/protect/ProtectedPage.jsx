import { useRouter } from "next/navigation";
import useAuthStore from "../../store/authStore";
import { useEffect } from "react";

const ProtectedPage = () => {
    const router = useRouter();
    const { isAuthenticated, isExpired } = useAuthStore();

    useEffect(() => {

        if (!isAuthenticated || isExpired()) {
            alert("로그인이 필요한 서비스입니다.");
            router.push("/user/login"); // Redirect to login page
        }
    }, [isAuthenticated, isExpired])

};

export default ProtectedPage;
