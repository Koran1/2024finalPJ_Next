"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./booklist.css"; // CSS 파일 가져오기
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Grid2 } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useAuthStore from "../../../../store/authStore";
import axios from "axios";

// 커스텀 화살표 컴포넌트
const CustomArrow = ({ className, style, onClick, direction }) => (
    <div
        className={className}
        style={{
            ...style,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute", // 슬라이드 영역에 고정
            top: "50%", // 슬라이드 세로 중앙 정렬
            transform: "translateY(-50%)", // 완벽한 중앙 배치
            background: "none",
            color: "black",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
            zIndex: 2,
            [direction === "left" ? "left" : "right"]: "-50px", // 슬라이드 영역 밖으로 이동
        }}
        onClick={onClick}
    >
        {direction === "left" ? "<" : ">"}
    </div>
);

function Page() {
    const { user } = useAuthStore(); // authStore에서 사용자 정보 가져오기
    const userIdx = user?.userIdx; // userIdx 추출
    const [navMenu, setNavMenu] = useState("/book/list");
    const [mybookList, setMybookList] = useState([]); // mybook 리스트
    const [loading, setLoading] = useState(false); // 로딩상태
    const [error, setError] = useState(false); // 에러상태
    const [displayLimit, setDisplayLimit] = useState(3); // 더보기 3개 데이터 default
    const [showScrollTop, setShowScrollTop] = useState(false); // 페이지 상단으로 가기

    const getActiveClass = (link) => {
        return navMenu === link ? "active" : "";
    };

    // mybook 리스트 가져오기
    // const getMyBookList = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/book/list`, {
    //             params: { userIdx },
    //         });
    //         if (response.data.success) {
    //             setMybookList(response.data.data.data);
    //             console.log("Auth Store에 있는 user: ", user);
    //             console.log("데이터 가져오기", response.data.data);
    //         } else {
    //             setError(response.data.message);
    //         }
    //     } catch (err) {
    //         setError("Error fetching data: " + err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const getMyBookList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/book/list`, {
                params: { userIdx },
            });
            console.log("서버 응답 데이터:", response.data);
            if (response.data.success) {
                setMybookList(response.data.data || []);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("데이터 가져오기 실패:", err.message);
            setError("Error fetching data: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    // 데이터 로드
    useEffect(() => {
        getMyBookList();
    }, [userIdx]);


    // 다가오는 예약
    const upcomingReservations = (mybookList || [])
        .filter((reservation) => new Date(reservation.bookCheckOutDate) > new Date())
        .sort(
            (a, b) => new Date(a.bookCheckInDate) - new Date(b.bookCheckInDate) // bookCheckInDate 오름차순 정렬
        );

    // 다가오는 예약 슬라이더 데이터 생성
    const slides = upcomingReservations.map((reservation) => {
        const currentDate = new Date(); // 현재 날짜
        const checkInDate = new Date(reservation.bookCheckInDate); // 체크인 날짜
        const diffTime = checkInDate - currentDate; // 밀리초 차이 계산
        const countdown = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 일 단위로 변환

        return {
            id: reservation.bookIdx,
            title: reservation.facltNm || "예약 제목 없음",
            date: `${reservation.bookCheckInDate} ~ ${reservation.bookCheckOutDate}`,
            img: reservation.firstImageUrl
                ? reservation.firstImageUrl
                : reservation.campImg2
                    ? reservation.campImg2
                    : "/images/campImageholder.png",
            countdown: countdown > 0
                ? `D-${countdown}` // 현재 날짜 이전
                : countdown === 0
                    ? "D-day" // 오늘
                    // : `D+${Math.abs(countdown)}`, // 현재 날짜 이후
                    : "(캠프 진행 중)", // 현재 날짜 이후
        };
    });

    // 슬라이더 설정
    const sliderSettings = {
        dots: slides.length > 1, // 슬라이드가 2개 이상일 때만 점(dot) 표시
        infinite: slides.length > 1, // 슬라이드가 2개 이상일 때만 반복
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: slides.length > 1, // 슬라이드가 2개 이상일 때만 화살표 표시
        prevArrow: <CustomArrow direction="left" />,
        nextArrow: <CustomArrow direction="right" />,
    };

    const getZoneDetails = (zone) => {
        const newData = {
            "A": { siteKor: "일반야영장", site: "A" },
            "P": { siteKor: "자동차야영장", site: "P" },
            "G": { siteKor: "글램핑", site: "G" },
            "C": { siteKor: "카라반", site: "C" },
            "I": { siteKor: "개인카라반", site: "I" },
        };

        return newData[zone] || { siteKor: "알 수 없는 구역", site: "-" }; // 기본값 추가
    };

    // 지난 예약 필터링 및 정렬
    const pastReservations = (mybookList || [])
        .filter((reservation) => new Date(reservation.bookCheckOutDate) <= new Date())
        .map((reservation) => {
            const checkInDate = new Date(reservation.bookCheckInDate);
            const checkOutDate = new Date(reservation.bookCheckOutDate);
            const differenceInTime = checkOutDate - checkInDate;
            const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            const { siteKor, site } = getZoneDetails(reservation.bookSelectedZone);

            // 년, 월, 일 계산
            const years = Math.floor(differenceInDays / 365);
            const months = Math.floor((differenceInDays % 365) / 30);
            const days = (differenceInDays % 365) % 30;

            return {
                ...reservation,
                guests: (reservation.bookAdultCount || 0) +
                    (reservation.bookYouthCount || 0) +
                    (reservation.bookChildCount || 0), // 기준 인원 계산
                differenceInTime, // 밀리초 차이 저장
                differenceInDays, // 일 단위 차이 저장
                difference: { years, months, days }, // 년, 월, 일 차이 저장
                siteKor, // 구역 이름
                site,    // 구역 코드
            };
        })
        .sort(
            (a, b) => new Date(b.bookCheckInDate) - new Date(a.bookCheckInDate)
        );

    // const pastReservations = (mybookList || [])
    // .filter((reservation) => {
    //     const checkOutDate = new Date(reservation.bookCheckOutDate);
    //     const currentDate = new Date();
    //     console.log("CheckOutDate:", checkOutDate, "CurrentDate:", currentDate);

    //     // 날짜 변환이 실패한 경우 처리
    //     if (isNaN(checkOutDate.getTime())) {
    //         console.error("Invalid Date:", reservation.bookCheckOutDate);
    //         return false;
    //     }

    //     return checkOutDate <= currentDate;
    // })
    // .map((reservation) => ({
    //     ...reservation,
    //     guests: (reservation.bookAdultCount || 0) +
    //             (reservation.bookYouthCount || 0) +
    //             (reservation.bookChildCount || 0),
    // }))
    // .sort(
    //     (a, b) => new Date(b.bookCheckOutDate) - new Date(a.bookCheckOutDate)
    // );

    // 스크롤 관련
    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollTop(true);
        } else {
            setShowScrollTop(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    // 더보기 함수
    const handleLoadMore = () => {
        setDisplayLimit((prevLimit) => prevLimit + 3);
    };


    // 로딩 중 화면
    if (loading) {
        return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
    }

    // 에러 발생 시 화면
    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>Error: {error}</div>
        );
    }

    return (
        <div className="book-list-main-container">
            {/* 상단 네비게이션 */}
            <div className="book-navmenu-container">
                <Link
                    href="/mycamp/plan"
                    className={`btn1 ${getActiveClass("/mylog/plan")}`}
                    onClick={() => setNavMenu("/mylog/plan")}
                >
                    캠핑플래너
                </Link>
                <Link
                    href="/book/list"
                    className={`btn1 ${getActiveClass("/book/list")}`}
                    onClick={() => setNavMenu("/book/list")}
                >
                    나의 예약
                </Link>
                <Link
                    href="/mycamp/mylog/list"
                    className={`btn1 ${getActiveClass("/mylog/list")}`}
                    onClick={() => setNavMenu("/mylog/list")}
                >
                    나의 캠핑로그
                </Link>
                <Link
                    href="/camp/favCamp"
                    className={`btn1 ${getActiveClass("/mylog/favcamp")}`}
                    onClick={() => setNavMenu("/mylog/favcamp")}
                >
                    위시리스트
                </Link>
            </div>

            {/* 다가오는 예약 슬라이더 */}
            <Grid2 container spacing={0}>
                <Grid2 size={2} />
                <Grid2 size={8}>
                    <div className="comming-book-container">
                        <p className="comming-book-header">다가오는 예약</p>
                        <Slider {...sliderSettings}>
                            {slides.length > 0 ? (
                                slides.map((list) => (
                                    <div key={list.id} className="slide-item">
                                        <div className="slide-content">
                                            <img
                                                src={list.img}
                                                alt="캠핑장 사진"
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    borderRadius: "8px",
                                                    objectFit: "cover",
                                                }}
                                                onError={(e) => e.target.src = "/images/campImageholder.png"}
                                            />
                                            <div className="text-wrapper">
                                                {/* 캠핑장명과 D-3 */}
                                                <div className="title-wrapper">
                                                    <p className="book-title">{list.title}</p>
                                                    <p className="book-d-day">{list.countdown}</p>
                                                </div>
                                                {/* 날짜 */}
                                                <p className="date">{list.date}</p>
                                            </div>
                                            <Button variant="contained" size="small" sx={{ borderRadius: "13px" }}>
                                                예약 정보 확인
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="slide-item">
                                    <div className="slide-content">
                                        <p style={{ textAlign: "center", margin: "0 auto", color: "#999", fontWeight: "bold" }}>
                                            다가오는 예약이 없습니다.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Slider>
                    </div>

                    {/* 연동된 계획 */}
                    <div className="connect-plan-container">
                        <p className="connect-plan-header">연동된 계획</p>
                        <div className="connect-plan-body">
                            <AddCircleOutlineIcon />
                            <span className="connect-plan-text">현재 연동된 계획이 없습니다.</span>
                        </div>
                    </div>
                    <hr className="separated-hr" />

                    {/* 지난 예약 */}
                    <div className="prev-book-container">
                        <p className="prev-book-header">지난 예약</p>
                        {pastReservations.length > 0 ? (
                            pastReservations.slice(0, displayLimit).map((list2) => (
                                <div key={list2.bookIdx} className="reservation-item">
                                    <img
                                        src={list2.firstImageUrl ? list2.firstImageUrl : list2.campImg2 ? list2.campImg2 : "/images/campImageholder.png"}
                                        alt="캠핑장 이미지"
                                        className="reservation-image"
                                    />
                                    <div className="reservation-details">
                                        <p className="reservation-title">{list2.facltNm}</p>
                                        <p className="reservation-location">
                                            {/* {list2.bookSelectedZone} */}
                                            {list2.site}구역({list2.siteKor})
                                        </p>
                                        <p className="reservation-info">
                                            참여 인원: {list2.guests}명 | 차량: {list2.bookCarCount}대
                                        </p>
                                        <div className="reservation-dates">
                                            <div className="date-block">
                                                <span className="check-in">체크인</span>
                                                <div className="date-time">{list2.bookCheckInDate}</div>
                                            </div>
                                            <span className="stay-duration">
                                                {list2.difference.years > 0 && `${list2.difference.years}년 `}
                                                {list2.difference.months > 0 && `${list2.difference.months}개월 `}
                                                {list2.difference.days > 0 && `${list2.difference.days}일`}
                                            </span>
                                            <div className="date-block">
                                                <span className="check-out">체크아웃</span>
                                                <div className="date-time">{list2.bookCheckOutDate}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="reservation-actions">
                                        <Button variant="contained" size="small" className="action-button">
                                            예약정보 확인
                                        </Button>
                                        <Button variant="outlined" size="small" className="action-button">
                                            후기 작성하기
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="reservation-item">
                                <div className="no-reservation">지난 예약이 없습니다.</div>
                            </div>
                        )}

                        {/* 더보기 버튼 */}
                        {pastReservations.length > displayLimit && (
                            <Button
                                variant="outlined"
                                onClick={handleLoadMore}
                                className="load-more-button"
                            >
                                더보기
                            </Button>
                        )}
                    </div>
                    {/* 페이지 상단으로 가기 */}
                    {showScrollTop && (
                        <button
                            className="scroll-to-top"
                            onClick={scrollToTop}
                        >
                            &#9650;
                        </button>
                    )}

                </Grid2>
                <Grid2 size={2} />
            </Grid2 >
        </div >
    );
}

export default Page;
