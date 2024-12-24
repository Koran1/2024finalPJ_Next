// 결제 성공시 보여줄 화면단
export default async function Page({ searchParams }) {
    const secretKey = process.env.TOSS_SECRET_KEY || ""; // 환경 변수에서 토스 비밀키 가져오기
    const basicToken = Buffer.from(`${secretKey}:`, `utf-8`).toString("base64"); // 인증용 Basic 토큰 생성
    const orderId = searchParams?.orderId;
    
    if (!orderId) {
        throw new Error("Order ID is missing in the query parameters");
    }

    // 실제 결제 정보를 가져올 API의 URL
    const url = `https://api.tosspayments.com/v1/payments/orders/${orderId}`;
    const payments = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicToken}`, // Basic 인증 헤더 추가
        "Content-Type": "application/json",   // JSON 데이터 형식 지정
      },
    }).then((res) => res.json()); // 응답을 JSON으로 변환
  
    // const { card } = payments;

    // 결제 내역을 보여주는 페이지
    return (
      <div>
        <h1>결제가 완료되었습니다</h1>
        <ul>
          <li>결제 상품 : {payments.orderName}</li>
          <li>주문 번호 : {payments.orderId} </li>
          {/* <li>카드회사 {card.company}</li>
          <li>카드번호 {card.number}</li>
          <li>결제금액 {card.amount}</li> */}
          <li>
            결제승인날짜{" "}
            {Intl.DateTimeFormat().format(new Date(payments.approvedAt))}
          </li>
        </ul>
      </div>
    );
  }
  