"use client";
import { Button } from "@mui/material";
import { loadTossPayments } from "@tosspayments/payment-sdk";

// 가장 처음에 보이는 화면단 (결제하기 버튼)
export default function PaymentsPage() {
  const handleClick = async () => {
    // 결제 SDK 로드 (토스에서 제공하는 클라이언트 키 사용)
    const tossPayments = await loadTossPayments(
      process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
    );
    
    // 결제 요청
    await tossPayments.requestPayment("카드", {
      amount: 10, // 결제 금액 (서버와 동기화 필요)
      orderId: Math.random().toString(36).slice(2), // 주문(예약) 번호
      orderName: "테스트 구역1", // 결제 상품명(캠핑장이름/사이트번호) (서버와 동기화 필요)
      successUrl: `${window.location.origin}/api/payments`, // 결제 성공 시 리다이렉트 경로
      failUrl: `${window.location.origin}/api/payments/fail`, // 결제 실패 시 리다이렉트 경로(가상결제로는 항상 결제 성공이라 사용못함)
    });
  };
  return (
    <div>
      <Button 
          variant='contained'
          color='primary'
          onClick={handleClick}
          // disabled={!isFormValid}
      >결제하기 테스트</Button>
    </div>
  );
}