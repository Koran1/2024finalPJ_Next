import axios from "axios";

export default async function handler(req, res) {
  const { orderId, paymentKey, amount } = req.query; // 클라이언트에서 전달받은 결제 정보
  const secretKey = process.env.TOSS_SECRET_KEY; // 토스 비밀키

  const url = "https://api.tosspayments.com/v1/payments/confirm"; // 결제 데이터 토스에 저장하기 위한 url
  const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64"); // 인증용 Basic 토큰 생성

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL; // DB 저장용 url

  try {
    // 토스서버에 보낼 결제 확인 데이터
    await fetch(url, {
      method: "post",
      body: JSON.stringify({
        orderId,
        amount,
        paymentKey, // 결제 키
      }),
      headers: {
        Authorization: `Basic ${basicToken}`, // 인증정보
        "Content-Type": "application/json",   // JSON 데이터 형식
      },
    }).then((res) => res.json()); // 응답을 JSON으로 변환

    const API_URL = `${LOCAL_API_BASE_URL}/book/write`;
    await axios.post(API_URL, null, {
      params: {
        orderId: orderId,
        paymentKey: paymentKey
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 결제 확인 후 완료 페이지로 리다이렉트
    res.redirect(`/book/list`);

  } catch (error) {
    console.error("Payment confirmation error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
