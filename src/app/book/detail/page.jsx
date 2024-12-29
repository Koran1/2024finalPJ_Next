"use client";
import "./page.css";
import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { Button } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "next/navigation";

function Page() {
    const bookIdx = useSearchParams().get('bookIdx');
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    // 예약 정보
    const [formData, setFormData] = useState({
        campIdx: "", // 캠핑장 idx
        // 날짜(달력 선택)
        bookCheckInDate : new Date().toLocaleDateString('en-CA'),
        bookCheckOutDate : addDays(new Date(), 3).toLocaleDateString('en-CA'),
        key: 'selection',
        // 사이트(구역) 선택
        bookSelectedZone : "",
        // 인원/차량 수
        bookAdultCount : 1,
        bookYouthCount : 0,
        bookChildCount : 0,
        bookCarCount : 0,
        // 예약 번호
        orderId: "",
        // 예약자 정보
        bookUserName : "",
        bookUserPhone : "",
        bookCar1 : "",
        bookCar2 : "",
        bookRequest : "",
        // 결제 총 가격
        bookTotalPrice : 0
    });
    const [differenceInDays, setDifferenceInDays] = useState();
    // 캠핑장 정보
    const [campData, setCampData] = useState({
        // 캠핑장이름, 캠핑장 썸네일일, 주소, 전화번호, 캠핑구역(일반, 자동차, 글램핑, 카라반, 개인카라반)
        facltNm: "",       // 캠핑장 이름 = facltNm
        firstImageUrl: "https://gocamping.or.kr/upload/camp/100008/thumb/thumb_720_6107z9OQLZWk9dvIhx8OblHM.jpg", // 캠핑장 썸네일 = firstImageUrl
        addr1: "",    // 캠핑장 주소 = addr1
        tel: "",      // 캠핑장 전화번호 = tel
    });

    const getBookData = async () => {
        try {
            const API_URL = `${LOCAL_API_BASE_URL}/book/detail?bookIdx=${bookIdx}`;

            // 예약 리스트 페이지에서 idx 받아서 넣고 서버에서 해당 예약 내역 데이터 받아오기
            const response = await axios.get(API_URL);
            const dataVO = response.data;
            console.log("dataVO :" + JSON.stringify(dataVO.data, null, 2));

            setFormData(dataVO.data.bvo);
            setCampData(dataVO.data.cvo);

            setDifferenceInDays((new Date(formData.bookCheckOutDate) - new Date(formData.bookCheckInDate)) / (1000 * 3600 * 24));
        } catch (error) {
            console.error('Error sending bookIdx:', error);
        }
    };

    useEffect(() => {
        getBookData();
    }, []);

    const handleSubmit = async () => {
        try {
            // 토스 API 결제 취소 코드 작성하기
            // const { paymentKey, amount, orderId } = response.data; // 예약 취소 API에서 결제 정보 받아옴

            // if (!paymentKey || !orderId) {
            //     throw new Error("결제 정보가 올바르지 않습니다.");
            // }

            // // 토스 API 결제 취소 요청
            // const cancelResponse = await axios.post('https://api.tosspayments.com/v1/payments/cancel', {
            //     paymentKey,     // 결제 키
            //     amount,         // 취소할 금액
            //     orderId         // 주문 ID
            // }, {
            //     headers: {
            //         'Authorization': `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString('base64')}`,
            //         'Content-Type': 'application/json'
            //     }
            // });

            // // 결제 취소 성공 처리
            // if (cancelResponse.status === 200) {
            //     alert("예약 및 결제 취소가 완료되었습니다.");
            // 결제 취소와 함께 DB 삭제
                const API_URL = `${LOCAL_API_BASE_URL}/book/cancel?bookIdx=${bookIdx}`;
                await axios.get(API_URL);
            // } else {
            //     throw new Error("결제 취소에 실패했습니다.");
            // }


        } catch (error) {
            alert("예약 취소 중 오류가 발생했습니다.");
        }
    };
    
    // 결제 내역을 보여주는 페이지
    return (
        <div style={{width:"600px", margin: "0 auto"}}>
            <div style={{textAlign: "center", marginBottom: "20px", fontWeight: "bold"}}>
                <a style={{fontSize: "32px"}}>예약내역</a>
            </div>
            {/* 캠핑장 정보(이름, 주소, 전화번호) */}
            <div style={{display: "flex", marginBottom: "20px"}}>
                <img src={campData.firstImageUrl} style={{ width: '150px', height: '150px', marginRight: "15px", borderRadius: "25px"}} />
                <div>
                    <h3>{campData.facltNm}</h3>
                    <p>{campData.addr1} <a>복사하기</a></p>
                    { campData.tel && <p>{campData.tel}</p> }
                </div>
            </div>
            {/* 예약 날짜 선택 */}
            <div style={{marginBottom: "20px"}}>
                <h5>예약날짜</h5>
                <div style={{border: "1px solid #4D88FF", borderRadius: "10px", padding: "10px", backgroundColor:"#4D88FF", color:"white"}}>
                    <div style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                        <h5 style={{textAlign: "center", marginBottom: "0"}}>
                            <b>체크인</b><br />
                            {formData.bookCheckInDate ? new Date(formData.bookCheckInDate).toLocaleDateString() : ''}<br />
                            <a style={{fontSize: "12px"}}>오후 02:00</a>
                        </h5>
                        <h4 style={{alignItems: "center"}}>~</h4>
                        <h5 style={{textAlign: "center", marginBottom: "0"}}>
                            <b>체크아웃</b><br />
                            {formData.bookCheckOutDate ? new Date(formData.bookCheckOutDate).toLocaleDateString() : ''}<br />
                            <a style={{fontSize: "12px"}}>오후 12:00</a>
                        </h5>
                    </div>
                </div>
            </div>
            {/* 예약번호, 캠핑구역(사이트), 인원 */}
            <div>
                <div style={{padding: "10px", marginBottom: "30px"}}>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <h5 style={{marginRight: "auto"}}>예약 번호</h5>
                        <h5>{formData.orderId ? formData.orderId : <>결제되지 않았거나 오류로 출력되지 않았습니다.</>}</h5>
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <h5 style={{marginRight: "auto"}}>캠핑 구역</h5>
                        <h5>{formData.bookSelectedZone} 구역</h5>
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <h5 style={{marginRight: "auto", marginBottom: "0"}}>
                            인원<br />
                            총 {parseInt(formData.bookAdultCount) + parseInt(formData.bookYouthCount) + parseInt(formData.bookChildCount)} 명
                        </h5>
                        <h5 style={{marginBottom: "0"}}>성인{formData.bookAdultCount}명</h5>
                        {formData.bookYouthCount > 0 && <h5 style={{marginBottom: "0"}}>,청소년{formData.bookYouthCount}명</h5>}
                        {formData.bookChildCount > 0 && <h5 style={{marginBottom: "0"}}>,미취학아동{formData.bookChildCount}명</h5>}
                        {formData.bookCarCount > 0 && <h5 style={{marginBottom: "0"}}>,차량{formData.bookCarCount}대</h5>}
                    </div>
                </div>
            </div>
            {/* 예약자 정보 */}
            <h5>예약자 정보</h5>
            <div style={{border: "1px solid #4D88FF", borderRadius: "10px", marginBottom: "30px", padding: "10px", backgroundColor:"#4D88FF", color:"white"}}>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <h4 style={{marginRight: "auto"}}>이름</h4>
                    <h4>{formData.bookUserName}</h4>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <h5 style={{marginRight: "auto"}}>휴대폰 번호</h5>
                    <h5>{formData.bookUserPhone}</h5>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <h5 style={{marginRight: "auto", marginBottom: "0"}}>차량번호</h5>
                    <h5 style={{marginBottom: "0"}}>{formData.bookCar1}</h5>
                </div>
            </div>
            {/* 예약자 정보 */}
            <h5>요청 사항</h5>
            <div style={{border: "1px solid #4D88FF", borderRadius: "10px", marginBottom: "30px", padding: "10px", backgroundColor:"#4D88FF", color:"white"}}>
                <div>
                    <h5 style={{marginBottom: "0"}}>{formData.bookRequest}</h5>
                </div>
            </div>
            {/* 결제 정보 */}
            <h5>결제 정보</h5>
            <h5>총 금액 : {formData.bookTotalPrice}</h5>
            <div style={{border: "1px solid #4D88FF", borderRadius: "10px", marginBottom: "30px", padding: "10px", backgroundColor:"#4D88FF", color:"white"}}>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <h4 style={{marginRight: "auto", fontWeight:"bold"}}>숙박 요금({differenceInDays}박)</h4>
                    <h4 style={{fontWeight:"bold"}}>총 {formData.bookTotalPrice} 원</h4>
                </div>
                <div>
                    <h5 style={{marginBottom: "0"}}>{formData.bookCheckInDate ? new Date(formData.bookCheckInDate).toLocaleDateString() : ''}  ~ {formData.bookCheckOutDate ? new Date(formData.bookCheckOutDate).toLocaleDateString() : ''}</h5>
                </div>
            </div>
            {/* 예약 취소 버튼 */}
            <div style={{margin:"20px", textAlign:"center"}}>
                <Button
                    variant='contained'
                    color='primary'
                    href="/"
                    onClick={handleSubmit}
                >예약취소</Button>
            </div>
        </div>
    );
}

export default Page;