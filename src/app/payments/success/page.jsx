"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

// 결제 qr 코드 스캔하고 서버에 보내는 페이지
export default function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const router = useRouter();
    // const { orderId, paymentKey, amount } = searchParams; // URL에서 데이터 추출
    const searchParams = useSearchParams(); // useSearchParams로 쿼리 추출

    const orderId = searchParams.get("orderId");
    const paymentKey = searchParams.get("paymentKey");
    const amount = searchParams.get("amount");

    useEffect(() => {
        // 서버로 결제 성공 데이터 전송
        const sendPaymentDataToServer = async () => {
            const API_URL = `${LOCAL_API_BASE_URL}/payments/success`;
            try {
                const response = await axios.post(API_URL, {
                    orderId,
                    paymentKey, // 결제 여부
                    amount,
                });

                if (response.status === 200) {
                    console.log("결제 성공 데이터 서버 전송 완료");
                    // 성공 시 다른 화면으로 이동 (예: 완료 페이지)
                    router.push(`/payments/complete?orderId=${orderId}`);
                }
            } catch (error) {
                console.error("서버 전송 실패:", error.response?.data || error);
            }
        };

        if (orderId && paymentKey && amount) {
            sendPaymentDataToServer();
        }
    }, [orderId, paymentKey, amount, router]);

    return (
        <div>
            <h1>결제 처리 중...</h1>
            <h3>{orderId}</h3>
            <h3>{paymentKey}</h3>
            <h3>{amount}</h3>
        </div>
    );
}