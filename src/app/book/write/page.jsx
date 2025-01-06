"use client";
import "./page.css";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import useAuthStore from "../../../../store/authStore";
import axios from "axios";
import PaymentsPage, { RequestPayments, requestPayments } from "@/app/payments/planpay/page";

function Page(props) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const {isAuthenticated, token} = useAuthStore(); // 로그인 상태

    const [formData, setFormData] = useState({
        bookAdultCount : 1,
        bookYouthCount : 0,
        bookChildCount : 0,
        bookCarCount : 0,
        bookUserName : "",
        bookUserPhone : "",
        bookCar1 : "",
        bookCar2 : "",
        bookRequest : ""
    });

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

    const handleSubmit = async() => {
        const API_URL = `${LOCAL_API_BASE_URL}/book/write`;
        const data = new FormData();
        data.append("bookAdultCount", formData.bookAdultCount);
        data.append("bookYouthCount", formData.bookYouthCount);
        data.append("bookChildCount", formData.bookChildCount);
        data.append("bookCarCount", formData.bookCarCount);
        data.append("bookUserName", formData.bookUserName);
        data.append("bookUserPhone", formData.bookUserPhone);
        data.append("bookCar1", formData.bookCar1);
        data.append("bookCar2", formData.bookCar2);
        data.append("bookRequest", formData.bookRequest);

        try {
            const response = await axios.post(API_URL, data, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    // "Content-Type" : "multipart/form-data"
                }
            });
            if(response.data.success){
                alert(response.data.message);
            }else{
                alert(response.data.message);
            }
        } catch (error) {
            alert("오류 발생");
        }
    }

    const isFormValid = 
        // isAuthenticated &&
        formData.bookUserName.trim() !== "" &&
        formData.bookUserPhone.trim() !== "";
        // formData.bookCar1.trim() !== "" &&
        // formData.bookCar2.trim() !== "";
    
    return (
        <div style={{width:"600px", margin: "0 auto"}}>
            <h1>예약 작성 화면 입니다.</h1>
            <div>
                <a style={{fontSize: "32px"}}>예약하기</a>
                <a style={{right: "20px"}}>성수기/비성수기</a>
            </div>
            {/* 캠핑장 정보(이름, 주소, 전화번호) */}
            <div style={{display: "flex", marginBottom: "20px"}}>
                <img src="/images/kitten-3.jpg" style={{ width: '150px', height: '150px', margin: "0 5px"}} />
                <div>
                    <h3>무주붉은노을캠핑장</h3>
                    <p>경남 양산시 원동면 원동로 1899-30 <a>복사하기</a></p>
                    <p>010-4456-7472 <a>전화하기</a></p>
                </div>
            </div>
            {/* 예약 날짜 선택택 공간 현재 mui꺼는 유료라 대안 필요 */}
            <div style={{marginBottom: "20px"}}>
                <h5>예약날짜</h5>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateRangePicker']}>
                        <DatePicker localeText={{start : 'Check-in', end: 'Check-out'}} />
                    </DemoContainer>
                </LocalizationProvider>
            </div>
            {/* 구역(사이트) 설정 공간 받아온 캠핑장 정보DB에 induty를 ','으로 나눠서 배열에 저장후
            저장된 배열속에 캠핑장종류들에 따라 캠핑구역들을 출력하는데 gnrlSiteCo~indvdlCaravSiteCo 등
            비교해서 0이면 매진 표시하기, 예약하기 선택 하면 해당 구역의 최대인원, 가격으로 아래 총 인원 제한, 숙박 당 금액 설정 */}
            <div>
                <h5>↓ 캠핑구역(사이트)  선택</h5>
                <div style={{border: "1px solid black", display: "flex", marginBottom: "20px", padding: "5px"}}>
                    <img src="/images/kitten-3.jpg" style={{ width: '200px', height: '200px', marginRight: "5px"}} />
                    <div>
                        <h3>G구역(글램핑)</h3>
                        <p>입실 : 14:00시 ~ 퇴실 : 11:00시</p>
                        <p>최대인원 8명</p>
                        <h5 style={{textAlign: "right"}}>150,000원</h5>
                        <Button className="bookBtn" variant='contained' color='primary'>예약하기</Button>
                    </div>
                </div>
            </div>
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
                    margin="normal"
                />
                <TextField label="휴대폰 번호"
                    name='bookUserPhone'
                    value={formData.bookUserPhone}
                    onChange={handleChange}
                    fullWidth
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
                    <h5>G구역</h5>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <h5 style={{marginRight: "auto", marginBottom: "0"}}>숙박 당 금액</h5>
                    <h5 style={{marginBottom: "0"}}>150,000원</h5>
                </div>
            </div>
            {/* 총 요금 */}
            <div style={{border: "1px solid #4D88FF", borderRadius: "10px", padding: "10px", backgroundColor:"#4D88FF", color:"white"}}>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <h4 style={{marginRight: "auto", fontWeight:"bold"}}>숙박 요금(2박)</h4>
                    <h4 style={{fontWeight:"bold"}}>300,000원</h4>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <h5 style={{marginRight: "auto", marginBottom: "0"}}>12.30~12.31</h5>
                    <h5 style={{marginBottom: "0"}}>150,000원</h5>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <h5 style={{marginRight: "auto", marginBottom: "0"}}>12.31~01.01</h5>
                    <h5 style={{marginBottom: "0"}}>150,000원</h5>
                </div>
            </div>
            {/* 결제하기 버튼 */}
            <div style={{margin:"20px", textAlign:"center"}}>
                <Button href="/payments/planpay"
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >결제하기</Button>
            </div>
            <PaymentsPage />
            
        </div>
    );
}

export default Page;