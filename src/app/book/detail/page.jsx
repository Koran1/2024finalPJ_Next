"use client";
import "./page.css";
import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { Button, IconButton } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { ContentCopy, Phone, Place } from "@mui/icons-material";
import useAuthStore from "../../../../store/authStore";

function Page() {
    const { user } = useAuthStore();
    const bookIdx = useSearchParams().get('bookIdx');
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 비 로그인 시 경고창 후 메인화면
    if (!user) {
        // alert("로그인 후 열람이 가능합니다.");
        // return window.location.href = "/";
        return window.location.replace("/");
    }

    // 예약 정보
    const [formData, setFormData] = useState({
        campIdx: "", // 캠핑장 idx
        // 날짜(달력 선택)
        bookCheckInDate: new Date().toLocaleDateString('en-CA'),
        bookCheckOutDate: addDays(new Date(), 3).toLocaleDateString('en-CA'),
        key: 'selection',
        // 사이트(구역) 선택
        bookSelectedZone: "",
        // 인원/차량 수
        bookAdultCount: 1,
        bookYouthCount: 0,
        bookChildCount: 0,
        bookCarCount: 0,
        // 예약 번호
        orderId: "",
        // 예약자 정보
        bookUserName: "",
        bookUserPhone: "",
        bookCar1: "",
        bookCar2: "",
        bookRequest: "",
        // 결제 총 가격
        bookTotalPrice: 0,
        // 결제 키
        paymentKey: ""
    });
    const differenceInDays = (new Date(formData.bookCheckOutDate) - new Date(formData.bookCheckInDate)) / (1000 * 3600 * 24);

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
            setLoading(true);
            const API_URL = `${LOCAL_API_BASE_URL}/book/detail?bookIdx=${bookIdx}`;

            // 예약 리스트 페이지에서 idx 받아서 넣고 서버에서 해당 예약 내역 데이터 받아오기
            const response = await axios.get(API_URL);
            const dataVO = response.data;
            // console.log("dataVO :" + JSON.stringify(dataVO.data, null, 2));

            setFormData(dataVO.data.bvo);
            setCampData(dataVO.data.cvo);
            console.log("dataVO.data.bvo.userIdx : ", dataVO.data.bvo.userIdx);
        } catch (error) {
            setError("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookData();
    }, []);

    const handleSubmit = async () => {
        try {
            // 예약 취소와 함께 DB 삭제
            const API_URL = `${LOCAL_API_BASE_URL}/book/cancel?bookIdx=${bookIdx}`;
            await axios.get(API_URL);
            alert("예약 취소가 완료되었습니다.");
            window.location.href = "/book/list"
        } catch (error) {
            console.error(error);
            alert("예약 취소 중 오류가 발생했습니다.");
        }
    };

    const handleCopy = () => {
        // p 태그의 텍스트를 가져오기
        const textToCopy = document.getElementById('addressText').innerText;

        // 클립보드에 텍스트 복사
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('주소가 복사되었습니다!');
            })
            .catch((err) => {
                console.error('복사 실패:', err);
            });
    };

    function textMasking(text, category) {
        if (category == "name") {
            // 이름이 3글자 이상일 경우 중간텍스트를 *처리
            if (text.length >= 3) {
                // 첫 글자, 마지막 글자, 중간 글자들
                let firstChar = text[0];
                let lastChar = text[text.length - 1];
                let middleChars = text.slice(1, text.length - 1).replace(/./g, '*');

                return firstChar + middleChars + lastChar;
            } else if (text.length == 2) { // 이름이 2글자일 경우
                // 첫 글자, 마지막 글자
                let firstChar = text[0];
                let lastChar = text[text.length - 1].replace(/./g, '*');

                return firstChar + lastChar;
            }

            // 이름이 1글자일 경우 그대로 반환
            return text;

        } else if (category == "phone") {
            // 010-1234-5678 => 010-****-5678
            let parts;
            let maskedNumber;

            // 하이픈이 있는 경우, 하이픈을 기준으로 분리
            if (text.includes("-")) {
                parts = text.split("-");

                const firstPart = parts[0];     // 첫 번째 부분 (010)
                const lastPart = parts[parts.length - 1]; // 마지막 부분 (4444)

                // 중간 부분을 *로 처리
                const maskedParts = parts.slice(1, parts.length - 1).map(() => "****");

                // 첫 번째와 마지막 부분을 그대로 두고, 중간 부분을 *로 처리하여 결합
                maskedNumber = [firstPart, ...maskedParts, lastPart].join("-");
            } else {
                // 하이픈이 없으면 3자리씩 나눠서 처리
                parts = [
                    text.slice(0, 3),
                    text.slice(3, 7),
                    text.slice(7)
                ];
            }

            // 3개의 부분으로 나눠졌다면 첫 3자리와 마지막 4자리는 그대로 두고, 중간 4자리는 *로 처리
            if (parts.length >= 3) {
                return maskedNumber;
            } else {

                return text; // 전화번호 형식이 맞지 않으면 그대로 반환 ex) 010-123-45-678 이렇게 안되게 write에서 양식주기
            }

        } else if (category == "car") {
            // 12가3456 => 12가**56
            // 차량번호 0~3번째 인덱스까지 문자열
            const frontString = text.slice(0, 3);
            // 차량번호 3번째 인덱스로부터 마지막에서3번째까지 문자열
            // const middleString = text.slice(3, text.length-2).replace(/./g, '*');
            const middleString = text.slice(3, text.length - 2).split(' ').map(() => "**");
            // 차량번호 마지막인덱스로부터 3번째 뒤의 문자열
            const lastString = text.slice(text.length - 2);

            return frontString + middleString + lastString;
        }
    }

    // 데이터 가져올 때 로딩
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>
    }

    // 결제 내역을 보여주는 페이지
    return (
        <div style={{ width: "600px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}>
                <a style={{ fontSize: "32px" }}>예약내역</a>
            </div>
            <hr />
            {/* 캠핑장 정보(이름, 주소, 전화번호) */}
            <div style={{ display: "flex", marginBottom: "20px" }}>
                <img src={campData.firstImageUrl} style={{ width: '150px', height: '150px', margin: "0 5px", borderRadius: "10px" }} />
                <div>
                    <h3>{campData.facltNm}</h3>
                    <div style={{ display: "flex", width: "430px", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ margin: "0" }} id="addressText"><Place sx={{ color: "#4D88FF" }} /> {campData.addr1}</p>
                        <IconButton onClick={handleCopy}><ContentCopy style={{ color: "#4D88FF" }} /></IconButton>
                    </div>
                    {campData.tel && <p><Phone sx={{ color: "#4D88FF" }} /> {campData.tel}</p>}
                </div>
            </div>
            <hr />
            {/* 예약 날짜 선택 */}
            <div style={{ marginBottom: "20px" }}>
                <h5>예약날짜</h5>
                <div style={{ border: "1px solid #4D88FF", borderRadius: "10px", padding: "10px", backgroundColor: "#4D88FF", color: "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <h5 style={{ textAlign: "center", marginBottom: "0" }}>
                            <b>체크인</b><br />
                            {formData.bookCheckInDate ? formData.bookCheckInDate : ''}<br />
                            <a style={{ fontSize: "12px" }}>오후 02:00</a>
                        </h5>
                        <h4 style={{ alignItems: "center" }}>~</h4>
                        <h5 style={{ textAlign: "center", marginBottom: "0" }}>
                            <b>체크아웃</b><br />
                            {formData.bookCheckOutDate ? formData.bookCheckOutDate : ''}<br />
                            <a style={{ fontSize: "12px" }}>오전 11:00</a>
                        </h5>
                    </div>
                </div>
            </div>
            <hr />
            {/* 예약번호, 캠핑구역(사이트), 인원 */}
            <div>
                <div style={{ padding: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h5>예약 번호</h5>
                        <h5>{formData.orderId ? formData.orderId : <>결제되지 않았거나 오류로 출력되지 않았습니다.</>}</h5>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h5>캠핑 구역</h5>
                        <h5>{formData.bookSelectedZone} 구역</h5>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h5 style={{ marginBottom: "0" }}>
                            인원<br />
                            총 {parseInt(formData.bookAdultCount) + parseInt(formData.bookYouthCount) + parseInt(formData.bookChildCount)}명
                        </h5>
                        <div style={{ display: "flex" }}>
                            <div style={{ textAlign: "center" }}>
                                <h5 style={{ marginBottom: "0" }}>성인</h5>
                                <h5 style={{ marginBottom: "0" }}>{formData.bookAdultCount}</h5>
                            </div>
                            {formData.bookYouthCount > 0 &&
                                <div style={{ textAlign: "center", marginLeft: "20px" }}>
                                    <h5 style={{ marginBottom: "0" }}>청소년</h5>
                                    <h5 style={{ marginBottom: "0" }}>{formData.bookYouthCount}</h5>
                                </div>
                            }
                            {formData.bookChildCount > 0 &&
                                <div style={{ textAlign: "center", marginLeft: "20px" }}>
                                    <h5 style={{ marginBottom: "0" }}>미취학아동</h5>
                                    <h5 style={{ marginBottom: "0" }}>{formData.bookChildCount}</h5>
                                </div>
                            }
                            {formData.bookCarCount > 0 &&
                                <div style={{ textAlign: "center", marginLeft: "20px" }}>
                                    <h5 style={{ marginBottom: "0" }}>차량</h5>
                                    <h5 style={{ marginBottom: "0" }}>{formData.bookCarCount}대</h5>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            {/* 예약자 정보 */}
            <h5>예약자 정보</h5>
            <div style={{ border: "1px solid #4D88FF", borderRadius: "10px", marginBottom: "30px", padding: "10px", backgroundColor: "#4D88FF", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4>이름</h4>
                    <h4>{textMasking(formData.bookUserName, "name")}</h4>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h5>휴대폰 번호</h5>
                    <h5>{textMasking(formData.bookUserPhone, "phone")}</h5>
                </div>
                {/* 차량 대수에 따라 반복 */}
                {
                    formData.bookCarCount && Array.from({ length: formData.bookCarCount }, (_, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                            <h5 style={{ marginBottom: index == formData.bookCarCount - 1 && "0" }}>차량번호{index + 1}</h5>
                            <h5 style={{ marginBottom: index == formData.bookCarCount - 1 && "0" }}>{textMasking(formData[`bookCar${index + 1}`], "car")}</h5>
                        </div>
                    ))
                }
            </div>
            <hr />
            {/* 요청 사항 */}
            {
                formData.bookRequest &&
                <>
                    <h5>요청 사항</h5>
                    <div style={{ border: "1px solid #4D88FF", borderRadius: "10px", marginBottom: "30px", padding: "10px", backgroundColor: "#4D88FF", color: "white" }}>
                        <div>
                            <h5 style={{ marginBottom: "0" }}>{formData.bookRequest}</h5>
                        </div>
                    </div>
                    <hr />
                </>
            }
            {/* 결제 정보 */}
            <h5>결제 정보</h5>
            <h5>총 금액 : {formData.bookTotalPrice}</h5>
            <div style={{ border: "1px solid #4D88FF", borderRadius: "10px", marginBottom: "30px", padding: "10px", backgroundColor: "#4D88FF", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <h4 style={{ marginRight: "auto", fontWeight: "bold" }}>숙박 요금({differenceInDays}박)</h4>
                    <h4 style={{ fontWeight: "bold" }}>총 {formData.bookTotalPrice} 원</h4>
                </div>
                <div>
                    <h5 style={{ marginBottom: "0" }}>{formData.bookCheckInDate ? formData.bookCheckInDate : ''}  ~ {formData.bookCheckOutDate ? formData.bookCheckOutDate : ''}</h5>
                </div>
            </div>
            <hr />
            {/* 예약 취소 버튼 */}
            <div style={{ margin: "20px", textAlign: "center" }}>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => { if (confirm("예약을 취소하시겠습니까?")) { handleSubmit() } }}
                >예약취소</Button>
            </div>
        </div>
    );
}

export default Page;