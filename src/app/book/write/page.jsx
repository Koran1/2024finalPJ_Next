"use client";
import "./page.css";
import 'react-date-range/dist/styles.css'; // 기본 스타일
import 'react-date-range/dist/theme/default.css'; // 기본 테마 스타일
import { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import useAuthStore from "../../../../store/authStore";
import axios from "axios";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { DateRange } from 'react-date-range';
import { addDays, set } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useSearchParams } from "next/navigation";

function Page() {
    const campIdx = useSearchParams().get("campIdx");
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const {isAuthenticated, token} = useAuthStore(); // 로그인 상태
    const [amount, setAmount] = useState(150); // 결제 금액
    const [siteAndPrice, setSiteAndPrice] = useState([]); // 캠핑장 구역과 가격
    // 날짜 선택 상태
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 3),
        key: 'selection'
    });

    // 날짜 차이 계산 (밀리초 단위로 차이를 구하고, 이를 1일(밀리초로 86400000)로 나눔)
    const differenceInTime = selectionRange.endDate - selectionRange.startDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // 밀리초 -> 일로 변환
    
    const [campData, setCampData] = useState({
        // 캠핑장이름, 캠핑장 썸네일일, 주소, 전화번호, 캠핑구역(일반, 자동차, 글램핑, 카라반, 개인카라반)
        facltNm: "",       // 캠핑장 이름 = facltNm
        firstImageUrl: "https://gocamping.or.kr/upload/camp/100008/thumb/thumb_720_6107z9OQLZWk9dvIhx8OblHM.jpg", // 캠핑장 썸네일 = firstImageUrl
        addr1: "",    // 캠핑장 주소 = addr1
        tel: "",      // 캠핑장 전화번호 = tel
        induty: [],       // 캠핑장 구역 = induty(일반야영장,자동차야영장,글램핑,카라반,개인카라반) ',' split 사용해서 배열로 저장
    });

    const [formData, setFormData] = useState({
        campIdx: campIdx,
        // 날짜(달력 선택)
        bookCheckInDate :  new Date().toLocaleDateString('en-CA'),
        bookCheckOutDate : addDays(new Date(), 3).toLocaleDateString('en-CA'),
        key: 'selection',
        // 사이트(구역) 선택
        bookSelectedZone : "",
        // 인원/차량 수
        bookAdultCount : 1,
        bookYouthCount : 0,
        bookChildCount : 0,
        bookCarCount : 0,
        // 결제 총 가격
        bookTotalPrice : 0,
        // 예약자 정보
        bookUserName : "",
        bookUserPhone : "",
        bookCar1 : "",
        bookCar2 : "",
        bookRequest : "",
        // 주문 번호
    });

    const getData = async () => {
        try {
            const API_URL = `${LOCAL_API_BASE_URL}/book/goBookPage?campIdx=${campIdx}`;
            // 캠핑장 정보 페이지에서 idx 받아서 넣고 서버에서 해당 캠핑장의 데이터 받아오기
            const response = await axios.get(API_URL);
            const dataVO = response.data;
            console.log("dataVO : " + dataVO);

            const { facltNm, firstImageUrl, addr1, tel, induty } = dataVO.data;

            // induty(캠핑장 구역)는 콤마로 구분된 문자열일 경우 배열로 변환
            const campSite = induty ? induty.split(',') : [];
            
            // 서버에서 받은 데이터를 campData에 설정
            setCampData(prev => ({
                ...prev,
                facltNm: facltNm,       // 캠핑장 이름
                firstImageUrl: firstImageUrl, // 캠핑장 썸네일
                addr1: addr1,      // 캠핑장 주소
                tel: tel,          // 캠핑장 전화번호
                induty: campSite,               // 캠핑장 구역 (배열)
            }));
            
            // 캠핑장 구역과 가격 설정
            campSite.forEach((siteKor) => {
                setSiteAndPrice((prev) => {
                    return updateSiteAndPriceArray(siteKor, prev);
                });
            });
        } catch (error) {
            console.error('Error sending campIdx:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const updateSiteAndPriceArray = (siteKor, prev) => {
        const newData = {
            "일반야영장": { siteImg: "https://moonlightcamp.co.kr/theme/tlog_a/img/nagdong/6.jpg?t=1", siteKor: "일반야영장", site: "A", maxPeople: 6, price: 10 },
            "자동차야영장": { siteImg: "https://www.5gcamp.com/files/camping/2018/02/17/90a60c2625038d83d7f2a62f335dc474221103.jpg", siteKor: "자동차야영장", maxPeople: 4, site: "P", price: 50 },
            "글램핑": { siteImg: "https://media.triple.guide/triple-cms/c_limit,f_auto,h_1024,w_1024/95ba8d50-6fb5-486c-babc-8835e8cdac55.jpeg", siteKor: "글램핑", site: "G", maxPeople: 8, price: 90 },
            "카라반": { siteImg: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fn5SMv%2FbtqEBPtsLaH%2FzDxzTkjkhMpYwrKkXkcVD0%2Fimg.jpg", siteKor: "카라반", site: "C", maxPeople: 4, price: 130 },
            "개인카라반": { siteImg: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fn5SMv%2FbtqEBPtsLaH%2FzDxzTkjkhMpYwrKkXkcVD0%2Fimg.jpg", siteKor: "개인카라반", site: "I", maxPeople: 6, price: 170 }
        };
    
        if (newData[siteKor]) {
            const filteredPrev = Array.isArray(prev) ? prev.filter((item) => item.siteKor !== siteKor) : [];
            return [...filteredPrev, newData[siteKor]];
        } else {
            console.warn(`Unknown siteKor: ${siteKor}`);
            return prev;  // 변경 사항이 없으면 기존 상태를 그대로 반환
        }
    };

    const selectSite = (item) => {
        setAmount(item.price);
        setFormData(prevCounts => ({
            ...prevCounts,
            bookSelectedZone: item.site,
            bookTotalPrice: item.price * differenceInDays
        }));
    };

    const increment = (category) => {
        const totalCount = formData.bookAdultCount + formData.bookYouthCount + formData.bookChildCount;
        console.log(totalCount);
        if (totalCount >= 8) return;

        setFormData(prevCounts => ({
            ...prevCounts,
            [category]: prevCounts[category] + 1
        }));
    };

    const decrement = (category) => {
        if (formData[category] <= 0) return;

        setFormData(prevCounts => ({
            ...prevCounts,
            [category]: prevCounts[category] - 1
        }));
    };

    const incrementCar = () => {
        if (formData.bookCarCount >= 2) return;

        setFormData(prevCounts => ({
            ...prevCounts,
            bookCarCount: prevCounts.bookCarCount + 1
        }));
    };

    const decrementAdult = () => {
        if (formData.bookAdultCount <= 1) return;

        setFormData(prevCounts => ({
            ...prevCounts,
            bookAdultCount: prevCounts.bookAdultCount - 1
        }));
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        const API_URL = `${LOCAL_API_BASE_URL}/book/write`;
        const data = new FormData();
        const date = new Date();
        const YYMMDD = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');;  // 0부터 9999까지의 랜덤 숫자 생성 빈자리수수는 0으로 넣어줌
        const orderId = `${campIdx}-${formData.bookSelectedZone}-${YYMMDD + randomNumber}`
        try {
            // 서버에 보낼거 한번에 넣기
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });
            data.append("orderId", orderId);

            console.log(data);
            // 서버에 전달 및 DB저장
            await axios.post(API_URL, data);

            console.log("토스 서버 시작");
            
            const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
            if(!clientKey) return;
            // 결제 화면 띄우기
            const tossPayments = await loadTossPayments(clientKey);

            await tossPayments.requestPayment("카드", { // 결제 방식("카드"에 QR결제있음)
                orderId: orderId, // 고유 주문 ID(값 변경) 캠핑장idx + 구역 + -YYMMDD + 랜덤수4자리
                orderName: `${campData.facltNm} 예약 결제`,          // 결제할 때 표시될 제목(값 변경)
                amount: formData.bookTotalPrice, // 실제 예약 데이터에 따라 금액 설정(값 변경)
                successUrl: `${window.location.origin}/api/payments`,   // http://localhost:3000/pages/api/payments
                failUrl: `${window.location.origin}/api/payments/fail`, // http://localhost:3000/pages/api/payments/fail
            });
        } catch (error) {
            alert("결제 중 오류가 발생했습니다.");
        }
    };

    const handleSelect = (ranges) => {
        setSelectionRange(ranges.selection);
        console.log(ranges)
        // 날짜가 바뀌면 선택된 구역도 초기화
        setFormData(prev => ({
            ...prev,
            bookCheckInDate: new Date(ranges.selection.startDate).toLocaleDateString('en-CA'),
            bookCheckOutDate: new Date(ranges.selection.endDate).toLocaleDateString('en-CA'),
            bookSelectedZone: "", // 날짜가 바뀌면 구역 선택 초기화
            bookTotalPrice: 0 // 금액도 초기화
        }));
    };

    const isFormValid = 
        // isAuthenticated &&
        formData.bookUserName.trim() !== "" &&
        formData.bookUserPhone.trim() !== "";
        // formData.bookCar1.trim() !== "" &&
        // formData.bookCar2.trim() !== "";

    return (
        <div style={{width:"600px", margin: "0 auto"}}>
            <div>
                <a style={{fontSize: "32px"}}>예약하기</a>
                {/* <a style={{right: "20px"}}>성수기/비성수기</a> */}
            </div>
            {/* 캠핑장 정보(이름, 주소, 전화번호) */}
            <div style={{display: "flex", marginBottom: "20px"}}>
                <img src={campData.firstImageUrl} style={{ width: '150px', height: '150px', margin: "0 5px"}} />
                <div>
                    <h3>{campData.facltNm}</h3>
                    <p>{campData.addr1} <a>복사하기</a></p>
                    { campData.tel && <p>{campData.tel}</p> }
                </div>
            </div>
            {/* 예약 날짜 선택 */}
            <div style={{marginBottom: "20px"}}>
                <h5>예약날짜</h5>
                <DateRange style={{width: "300px"}}
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                    months={2} // 한 번에 2개월 표시
                    direction="horizontal" // 날짜 선택기 방향 (수평/수직)
                    minDate={new Date()} // 최소 선택 가능 날짜
                    locale={ko}  // 한글 로케일 적용
                />
            </div>
            
            {/* 캠핑장 구역 선택 */}
            <div>
                <h5>↓ 캠핑구역(사이트) 선택</h5>
                {Array.isArray(siteAndPrice) && siteAndPrice.map((item, index) => (
                    <div key={index} style={{border: "1px solid black", display: "flex", marginBottom: "20px", padding: "5px"}}>
                        <img src={item.siteImg} style={{ width: '200px', height: '200px', marginRight: "5px"}} />
                        <div>
                            <h3>{item.site} 구역({item.siteKor})</h3>
                            <p>입실 : 14:00시 ~ 퇴실 : 11:00시</p>
                            <p>최대인원 {item.maxPeople}명</p>
                            <h5 style={{textAlign: "right"}}>{item.price}원</h5>
                            <Button className="bookBtn" variant='contained' color='primary' onClick={() => selectSite(item)}>예약하기</Button>
                        </div>
                    </div>
                ))}
            </div>
            {selectionRange.endDate && formData.bookSelectedZone && (
                <>
                    {/* 전체 인원 정보 설정 공간 */}
                    <div>
                        <h4>전체 인원 정보</h4>
                        <div style={{display:"flex", justifyContent: "flex-end"}}>
                            <h5 style={{marginRight: "auto"}}>성인</h5>
                            <Button className="plusMinusBtn" variant="outlined" onClick={() => decrementAdult()}> - </Button>
                            <h5 style={{margin: "0 10px"}}>{formData.bookAdultCount}</h5>
                            <Button className="plusMinusBtn" variant="outlined" onClick={() => increment('bookAdultCount')}> + </Button>
                        </div>
                        <div style={{display:"flex", justifyContent: "flex-end"}}>
                            <h5 style={{marginRight: "auto"}}>청소년</h5>
                            <Button className="plusMinusBtn" variant="outlined" onClick={() => decrement('bookYouthCount')}> - </Button>
                            <h5 style={{margin: "0 10px"}}>{formData.bookYouthCount}</h5>
                            <Button className="plusMinusBtn" variant="outlined" onClick={() => increment('bookYouthCount')}> + </Button>
                        </div>
                        <div style={{display:"flex", justifyContent: "flex-end"}}>
                            <h5 style={{marginRight: "auto"}}>미취학 아동</h5>
                            <Button className="plusMinusBtn" variant="outlined" onClick={() => decrement('bookChildCount')}> - </Button>
                            <h5 style={{margin: "0 10px"}}>{formData.bookChildCount}</h5>
                            <Button className="plusMinusBtn" variant="outlined" onClick={() => increment('bookChildCount')}> + </Button>
                        </div>
                        <div style={{display:"flex", justifyContent: "flex-end"}}>
                            <h5 style={{marginRight: "auto"}}>예약 차량</h5>
                            <Button className="plusMinusBtn" variant="outlined" onClick={() => decrement('bookCarCount')}> - </Button>
                            <h5 style={{margin: "0 10px"}}>{formData.bookCarCount}</h5>
                            <Button className="plusMinusBtn" variant="outlined" onClick={() => incrementCar()}> + </Button>
                        </div>
                    </div>
                    {/* 구역(사이트)의 총 인원 제한 수, 차량 제한 수 */}
                    <div style={{border: "1px solid #4D88FF", borderRadius: "10px", padding: "10px", backgroundColor:"#4D88FF", color:"white"}}>
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <h5 style={{marginRight: "auto"}}>총 인원 제한</h5>
                            <h5>8명</h5>
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <h5 style={{marginRight: "auto", marginBottom: "0"}}>차량 제한</h5>
                            <h5 style={{marginBottom: "0"}}>2대</h5>
                        </div>
                    </div>
                    {/* 예약자 정보 입력 필드 */}
                    <div style={{padding: "20px"}}>
                        <h5>예약자 정보</h5>
                        <TextField label="예약자명"
                            name='bookUserName'
                            value={formData.bookUserName}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField label="휴대폰 번호"
                            name='bookUserPhone'
                            value={formData.bookUserPhone}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        {/* 차량 번호 입력 필드는 예약 차량(counts.car)수에 맞춰서 생성되게하기 */}
                        <TextField label="차량번호"
                            name='bookCar1'
                            value={formData.bookCar1}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField label="요청사항"
                            name='bookRequest'
                            value={formData.bookRequest}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    </div>
                    {/* 캠핑 구역, 숙박 당 금액 */}
                    <div style={{padding: "10px"}}>
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <h5 style={{marginRight: "auto"}}>캠핑 구역</h5>
                            <h5>{formData.bookSelectedZone} 구역</h5>
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <h5 style={{marginRight: "auto", marginBottom: "0"}}>숙박 당 금액</h5>
                            <h5 style={{marginBottom: "0"}}>{amount}원</h5>
                        </div>
                    </div>
                    {/* 총 요금 */}
                    <div style={{border: "1px solid #4D88FF", borderRadius: "10px", padding: "10px", backgroundColor:"#4D88FF", color:"white"}}>
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <h4 style={{marginRight: "auto", fontWeight:"bold"}}>숙박 요금({differenceInDays}박)</h4>
                            <h4 style={{fontWeight:"bold"}}>총 {formData.bookTotalPrice} 원</h4>
                        </div>
                        <div>
                            <h5 style={{marginBottom: "0"}}>{selectionRange.startDate.toLocaleDateString()} ~ {selectionRange.endDate.toLocaleDateString()}</h5>
                        </div>
                    </div>
                    {/* 결제하기 버튼 */}
                    <div style={{margin:"20px", textAlign:"center"}}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                        >결제하기</Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Page;