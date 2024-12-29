export default async function handler(req, res) {
    const { orderId, paymentKey, amount } = req.query; // 클라이언트에서 전달받은 결제 정보
    const secretKey = process.env.TOSS_SECRET_KEY; // 토스 비밀키
  
    const url = "https://api.tosspayments.com/v1/payments/confirm"; // 결제 확인 API URL
    const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64"); // 인증용 Basic 토큰 생성

    try {
      // 토스서버에 보낼 결제 확인 데이터
      await fetch(url, {
        method: "post",
        body: JSON.stringify({
          orderId,
          amount,
          paymentKey, // 결제 키키
        }),
        headers: {
          Authorization: `Basic ${basicToken}`, // 인증정보
          "Content-Type": "application/json",   // JSON 데이터 형식
        },
      }).then((res) => res.json()); // 응답을 JSON으로 변환환
    
      // 결제 확인 후 완료 페이지로 리다이렉트
      res.redirect(`/book/list`);
      
    } catch (error) {
      console.error("Payment confirmation error:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
  