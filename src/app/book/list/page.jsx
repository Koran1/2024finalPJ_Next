"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./booklist.css"; // CSS 파일 가져오기
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Button, Grid2, IconButton, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useAuthStore from "../../../../store/authStore";
import axios from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { ContentCopy, Phone, Place } from "@mui/icons-material";
import { addDays } from "date-fns";

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
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const KakaoAK = process.env.KakaoAK_KEY;

    const { user, token } = useAuthStore(); // authStore에서 사용자 정보 가져오기
    const userIdx = user?.userIdx; // userIdx 추출
    const [navMenu, setNavMenu] = useState("/book/list");
    const [mybookList, setMybookList] = useState([]); // mybook 리스트
    const [loading, setLoading] = useState(false); // 로딩상태
    const [error, setError] = useState(false); // 에러상태
    const [displayLimit, setDisplayLimit] = useState(3); // 더보기 3개 데이터 default
    const [showScrollTop, setShowScrollTop] = useState(false); // 페이지 상단으로 가기

    // 선택한 예약 정보(모달용)
    const [selectedBook, setSelectedBook] = useState({
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
    // 선택한 예약의 캠핑장 정보(모달용)
    const [campData, setCampData] = useState({
        // 캠핑장이름, 캠핑장 썸네일일, 주소, 전화번호, 캠핑구역(일반, 자동차, 글램핑, 카라반, 개인카라반)
        facltNm: "",       // 캠핑장 이름 = facltNm
        firstImageUrl: "https://gocamping.or.kr/upload/camp/100008/thumb/thumb_720_6107z9OQLZWk9dvIhx8OblHM.jpg", // 캠핑장 썸네일 = firstImageUrl
        addr1: "",    // 캠핑장 주소 = addr1
        tel: "",      // 캠핑장 전화번호 = tel
    });
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);// 예약 상세 정보 모달 창 열기
    const differenceInDays = selectedBook && (new Date(selectedBook.bookCheckOutDate) - new Date(selectedBook.bookCheckInDate)) / (1000 * 3600 * 24);
    const today = new Date().toISOString().split('T')[0];
    const isYesterday = selectedBook && today >= selectedBook.bookCheckInDate;
    console.log(today);

    const handleModalClick = async (bookIdx) => {
        try {
            // setLoading(true);
            const API_URL = `${baseUrl}/book/detail?bookIdx=${bookIdx}`;

            // 예약 리스트 페이지에서 idx 받아서 넣고 서버에서 해당 예약 내역 데이터 받아오기
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const dataVO = response.data;
            // console.log("dataVO :" + JSON.stringify(dataVO.data, null, 2));

            setSelectedBook(dataVO.data.bvo);
            setCampData(dataVO.data.cvo);
        } catch (error) {
            setError("Error fetching data:", error);
        } finally {
            // setLoading(false);
        }
        // 로그 글 삭제 또는 신고 버튼 클릭 시 해당 모달 활성화
        setIsBookModalOpen(true);
    }

    const bookCancelBtn = async () => {
        if (confirm("예약을 취소하시겠습니까?")){
            try {
                // 예약 취소와 함께 DB 삭제
                const API_URL = `${baseUrl}/book/cancel?bookIdx=${selectedBook.bookIdx}`;
                await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert("예약 취소가 완료되었습니다.");
                window.location.href = "/book/list"
            } catch (error) {
                console.error(error);
                alert("예약 취소 중 오류가 발생했습니다.");
            }
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




    const getActiveClass = (link) => {
        return navMenu === link ? "active" : "";
    };

    const getMyBookList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/book/list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
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
        .filter((reservation) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 시간 제거
            const checkOutDate = new Date(reservation.bookCheckOutDate);
            checkOutDate.setHours(0, 0, 0, 0); // 시간 제거
            return checkOutDate >= today; // 체크아웃 날짜가 오늘 이후 또는 오늘인 경우
        })
        .sort((a, b) => {
            const checkInDateA = new Date(a.bookCheckInDate);
            const checkInDateB = new Date(b.bookCheckInDate);
            return checkInDateA - checkInDateB; // bookCheckInDate 오름차순 정렬
        });

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
            // 지역, 좌표
            addr1: reservation.addr1,
            mapY: reservation.mapY,
            mapX: reservation.mapX,

            // 날씨 관련
            regionCode: reservation.regionCode,
            wthrLunAge: reservation.wthrLunAge,
            wthrMoonrise: reservation.wthrMoonrise,
            wthrMoonset: reservation.wthrMoonset,
            wthrPOP: reservation.wthrPOP,
            wthrSKY_PTY: reservation.wthrSKY_PTY,
            wthrSunrise: reservation.wthrSunrise,
            wthrSunset: reservation.wthrSunset,
            wthrTMax: reservation.wthrTMax,
            wthrTMin: reservation.wthrTMin,
        };
    });

    const [selectedReservation, setSelectedReservation] = useState(null);

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
        afterChange: (currentIndex) => setSelectedReservation(slides[currentIndex]), // Update state on slide change
    };

    useEffect(() => {
        // Set the initial selected reservation on the first load
        if (slides.length > 0 && !selectedReservation) {
            setSelectedReservation(slides[0]); // Set the first slide as the selected reservation
        }
    }, [slides, selectedReservation]);

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
        .filter((reservation) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 시간 제거
            const checkOutDate = new Date(reservation.bookCheckOutDate);
            checkOutDate.setHours(0, 0, 0, 0); // 시간 제거
            return checkOutDate < today; // 체크아웃 날짜가 오늘 이전인 경우
        })
        .map((reservation) => {
            const checkInDate = new Date(reservation.bookCheckInDate);
            const checkOutDate = new Date(reservation.bookCheckOutDate);
            const differenceInTime = checkOutDate - checkInDate;
            const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            // 당일 예약 계산
            const isSameDay = checkInDate.toDateString() === checkOutDate.toDateString();
            const { siteKor, site } = getZoneDetails(reservation.bookSelectedZone);

            // 년, 월, 일 계산
            const years = Math.floor(differenceInDays / 365);
            const months = Math.floor((differenceInDays % 365) / 30);
            // const days = (differenceInDays % 365) % 30;
            const days = isSameDay ? 1 : (differenceInDays % 365) % 30;

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

    // 아래 pastReservations 주석 코드는 날짜 변환이 실패한 경우를 처리하는 코드가 포함되어 있어 주석 해뒀음
    /*
    const pastReservations = (mybookList || [])
    .filter((reservation) => {
        const checkOutDate = new Date(reservation.bookCheckOutDate);
        const currentDate = new Date();
        console.log("CheckOutDate:", checkOutDate, "CurrentDate:", currentDate);
    
        // 날짜 변환이 실패한 경우 처리
        if (isNaN(checkOutDate.getTime())) {
            console.error("Invalid Date:", reservation.bookCheckOutDate);
            return false;
        }
    
        return checkOutDate <= currentDate;
    })
    .map((reservation) => ({
        ...reservation,
        guests: (reservation.bookAdultCount || 0) +
                (reservation.bookYouthCount || 0) +
                (reservation.bookChildCount || 0),
    }))
    .sort(
        (a, b) => new Date(b.bookCheckOutDate) - new Date(a.bookCheckOutDate)
    );
    */

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


    // 날씨 정보 관련
    const getMoonImage = (lunAge) => {
        const basePath = '/moon_img/new_calendar_moon';
        const phase = Math.floor(lunAge); // Get the integer part of lunAge
        const phaseRange = phase < 14 ? `${phase}_${phase + 1}` : `${14}_${17}`;
        return `${basePath}${phaseRange}.png`;
    };

    // 길찾기 관련 Modal 창
    const [modalOpen, setModalOpen] = useState(false);

    const handlePathModal = () => setModalOpen(true)
    const handleCloseModal = () => {
        setModalOpen(false)
        setPathSearch("");   // Clear the search input
        setMarkers([]);      // Clear markers
        setCoords([]);       // Clear Polyline path
        setDistance("");     // Clear distance
        setTime("");         // Clear time
    }

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [info, setInfo] = useState()
    const [pathSearch, setPathSearch] = useState("")
    const [markers, setMarkers] = useState([])
    const [map, setMap] = useState(null)


    // 출발지 설정
    const handleSetOrigin = (e) => {
        if (e.key === "Enter") {
            if (!map) {
                return
            }
            setMarkers([]);
            setCoords([]);
            const places = new kakao.maps.services.Places();

            places.keywordSearch(pathSearch, (data, status, _pagination) => {

                if (status === kakao.maps.services.Status.OK) {
                    const bounds = new kakao.maps.LatLngBounds()
                    let markers = []
                    console.log(data)
                    for (var i = 0; i < data.length; i++) {
                        markers.push({
                            position: {
                                lat: data[i].y,
                                lng: data[i].x,
                            },
                            content: data[i].place_name,
                        })
                        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
                    }
                    setMarkers(markers)

                    map.setBounds(bounds);
                } else {
                    alert('검색 결과 없음')
                }
            })
        }
    }

    const [distance, setDistance] = useState("");
    const [time, setTime] = useState("");
    const [coords, setCoords] = useState([]);


    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDistance = (meters) => {
        return (meters / 1000).toFixed(2); // Convert to kilometers and round to 2 decimal places
    };

    // 경로 탐색
    const handlePathSearch = async (selectedReservation, originLat, originLng, originContent) => {
        const destLat = selectedReservation.mapY;
        const destLng = selectedReservation.mapX;
        console.log(destLat)
        console.log(destLng)
        console.log(originLat)
        console.log(originLng)

        try {
            const origin = `${originLng},${originLat}`;
            const destination = `${destLng},${destLat}`;

            const API_url = "https://apis-navi.kakaomobility.com/v1/directions?origin=" + origin + "&destination="
                + destination;

            const response = await axios.get(API_url, {
                headers: {
                    // Authorization: `KakaoAK ${KakaoAK}`,
                    Authorization: `KakaoAK 1a31dbd4bb00984c5b2d38a62c3d2f0f`,
                    'Content-Type': 'application/json',
                }
            });
            const route = response.data.routes[0];
            const distanceInMeters = route.summary.distance;
            const durationInSeconds = route.summary.duration;

            setDistance(formatDistance(distanceInMeters)); // Convert to km
            setTime(formatTime(durationInSeconds));

            const road = response.data.routes[0].sections[0].roads;
            const vertexes = [];
            road.map((item) => {
                item.vertexes.map((ver) => {
                    vertexes.push(ver);
                })
            })
            const coords = [];
            for (let i = 0; i < vertexes.length; i += 2) {
                coords.push({
                    lat: vertexes[i + 1],
                    lng: vertexes[i]
                })
            }

            setCoords(coords);

            // Add markers for origin, destination, and waypoints
            const newMarkers = [
                {
                    position: { lat: originLat, lng: originLng },
                    content: `출발: ${originContent}`,
                },
                {
                    position: { lat: destLat, lng: destLng },
                    content: `목적: ${selectedReservation.addr1}`,
                },
            ];


            setMarkers(newMarkers);

            // Update the map bounds to fit all markers and the route
            const bounds = new kakao.maps.LatLngBounds();
            newMarkers.forEach((marker) => {
                bounds.extend(new kakao.maps.LatLng(marker.position.lat, marker.position.lng));
            });
            coords.forEach((coord) => {
                bounds.extend(new kakao.maps.LatLng(coord.lat, coord.lng));
            });

            map.setBounds(bounds); // Adjust the map view

        } catch (error) {
            console.log(error)
        }
    }

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
                <Link href="/book/list"
                    className={`btn1 ${getActiveClass('/book/list')}`}
                    onClick={() => setNavMenu('/book/list')}
                >
                    나의 예약
                </Link>
                <Link href="/mycamp/mylog/list"
                    className={`btn1 ${getActiveClass('/mycamp/mylog/list')}`}
                    onClick={() => setNavMenu('/mycamp/mylog/list')}
                >
                    나의 캠핑로그
                </Link>
                <Link href="/camp/favCamp"
                    className={`btn1 ${getActiveClass('/camp/favCamp')}`}
                    onClick={() => setNavMenu('/camp/favCamp')}
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
                                            {/* <Button href={`/book/detail?bookIdx=${list.id}`} variant="contained" size="small" sx={{ borderRadius: "13px" }}> */}
                                            <Button onClick={() => handleModalClick(list.id)} variant="contained" size="small" sx={{ borderRadius: "13px" }}>
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

                    {/* 기상 예측 정보, 출발지 검색(캠핑장과의 거리) */}
                    <div className="connect-plan-container">
                        <p className="connect-plan-header">예측 정보</p>
                        <div className="connect-plan-body">
                            <>
                                {selectedReservation &&
                                    (new Date(selectedReservation.date.substring(0, 10)).getTime() <= Date.now() ?
                                        <>
                                            <span className="connect-plan-text">
                                                <CardTravelIcon />
                                                즐거운 여행 되세요!
                                            </span>
                                        </>
                                        :
                                        new Date(selectedReservation.date.substring(0, 10)).getTime() <= Date.now() + 10 * 24 * 60 * 60 * 1000 ? (
                                            <div style={{ width: "100%" }}>
                                                <TableContainer component={Paper}>
                                                    <Table className="custom-table" >
                                                        <TableHead>
                                                            <TableRow >
                                                                {['날짜', '최저', '최고', '날씨', '강수', '일출 / 일몰', '월출 / 월몰', '달모양']
                                                                    .map(header => <TableCell key={header} className="table-header">{header}</TableCell>)}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>{selectedReservation.date.substring(0, 10)}</TableCell>
                                                                <TableCell>{Math.round(selectedReservation.wthrTMin)}</TableCell>
                                                                <TableCell>{Math.round(selectedReservation.wthrTMax)}</TableCell>
                                                                <TableCell>{selectedReservation.wthrSKY_PTY}</TableCell>
                                                                <TableCell>{selectedReservation.wthrPOP}</TableCell>
                                                                <TableCell>
                                                                    {selectedReservation.wthrSunrise && selectedReservation.wthrSunrise.substring(0, 2)}:{selectedReservation.wthrSunrise && selectedReservation.wthrSunrise.substring(2)}
                                                                    /&nbsp;
                                                                    {selectedReservation.wthrSunset && selectedReservation.wthrSunset.substring(0, 2)}:{selectedReservation.wthrSunset && selectedReservation.wthrSunset.substring(2)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {selectedReservation.wthrMoonrise && selectedReservation.wthrMoonrise.substring(0, 2)}:{selectedReservation.wthrMoonrise && selectedReservation.wthrMoonrise.substring(2)}
                                                                    /&nbsp;
                                                                    {selectedReservation.wthrMoonset && selectedReservation.wthrMoonset.substring(0, 2)}:{selectedReservation.wthrMoonset && selectedReservation.wthrMoonset.substring(2)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <img src={getMoonImage(selectedReservation.wthrLunAge)} alt={`Moon phase for age ${selectedReservation.wthrLunAge}`} />
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="connect-plan-text">
                                                    <AddCircleOutlineIcon />
                                                    기상 정보는 최대 10일까지 제공됩니다.
                                                </span>
                                            </>
                                        ))
                                }
                                {selectedReservation && (
                                    <>
                                        <Button variant="contained" color="success" sx={{ maxWidth: "150px" }} onClick={handlePathModal} >경로 검색</Button>
                                        <Modal
                                            open={modalOpen}
                                            onClose={handleCloseModal}
                                        >
                                            <Box sx={modalStyle}>
                                                <Box sx={{ width: '100%', minHeight: '600px', display: "flex", flexDirection: "row" }}>
                                                    <Box sx={{
                                                        width: "30%",
                                                        alignContent: "center", justifyItems: "center",
                                                        padding: "0px 10px"
                                                    }}>
                                                        <TextField
                                                            value={pathSearch}
                                                            onChange={(e) => setPathSearch(e.target.value)}
                                                            onKeyUp={(e) => handleSetOrigin(e)}
                                                            label="출발지 입력"
                                                        />
                                                        <p>
                                                            <ExpandMoreIcon fontSize="large" />
                                                        </p>
                                                        <p>{selectedReservation.addr1}</p>
                                                        <p>예상거리 : {distance ?? ""} Km</p>
                                                        <p>예상시간 : {time ?? ""}</p>
                                                    </Box>

                                                    <Box sx={{ width: "70%", backgroundColor: "blue" }}>
                                                        <Map
                                                            id="map"
                                                            center={{ lat: selectedReservation.mapY, lng: selectedReservation.mapX }}
                                                            style={{ width: "100%", height: "100%" }}
                                                            level={3}
                                                            onCreate={setMap}
                                                        >
                                                            {
                                                                markers.length == 0 ?
                                                                    <MapMarker position={{ lat: selectedReservation.mapY, lng: selectedReservation.mapX }}>
                                                                        <div style={{ textAlign: 'center', height: '100%' }} className="info-window">
                                                                            <b>{selectedReservation.addr1}</b> <br />
                                                                            <a href={`https://map.kakao.com/link/map/${selectedReservation.addr1},${selectedReservation.mapY},${selectedReservation.mapX}`} style={{ color: 'blue' }} target="_blank">
                                                                                큰지도보기
                                                                            </a>

                                                                        </div>
                                                                    </MapMarker>
                                                                    :
                                                                    markers.map((marker) => (
                                                                        <MapMarker
                                                                            key={`${marker.position.lat},${marker.position.lng}`}
                                                                            position={marker.position}
                                                                            onClick={() => setInfo(marker)} // Optional for showing info on click
                                                                        >
                                                                            {coords.length > 0 ? (
                                                                                <div style={{ color: "#000", fontWeight: "bold" }} className="info-window">
                                                                                    {marker.content}
                                                                                </div>
                                                                            ) : (
                                                                                info &&
                                                                                info.content === marker.content && (
                                                                                    <div style={{ color: "#000" }} className="info-window">
                                                                                        {marker.content}
                                                                                        <Button
                                                                                            size="small"
                                                                                            variant="contained"
                                                                                            onClick={() => handlePathSearch(selectedReservation, marker.position.lat, marker.position.lng, marker.content)}
                                                                                        >
                                                                                            출발지로 선택
                                                                                        </Button>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </MapMarker>
                                                                    ))
                                                            }
                                                            {coords && (
                                                                <Polyline
                                                                    path={coords}
                                                                    strokeWeight={5} // 선의 두께 입니다
                                                                    strokeColor={"#000000"} // 선의 색깔입니다
                                                                    strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                                                    strokeStyle={"solid"} // 선의 스타일입니다
                                                                />
                                                            )}
                                                        </Map>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Modal>
                                    </>
                                )}
                            </>
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
                                        {/* <Button variant="contained" size="small" className="action-button"> */}
                                        <Button onClick={() => handleModalClick(list2.bookIdx)} variant="contained" size="small" className="action-button">
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


            {/* 예약 상세 정보 모달 */}
            <Modal
                open={isBookModalOpen}
                onClose={() => setIsBookModalOpen(false)}
                aria-labelledby="commentDeleteModal"
                aria-describedby="commentDeleteModal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '700px',
                        height: '90%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: "10px",
                        p: 4,
                        overflowY: 'auto', // 스크롤 기능 추가
                    }}
                >
                    <div style={{ width: "600px", margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}>
                            <a style={{ fontSize: "32px" }}>예약내역</a>
                        </div>
                        <hr />
                        {/* 캠핑장 정보(이름, 주소, 전화번호) */}
                        <div style={{ display: "flex", marginBottom: "20px" }}>
                            <a href={`/camp/detail/${selectedBook.campIdx}`}><img src={campData.firstImageUrl} style={{ width: '150px', height: '150px', margin: "0 5px", borderRadius: "10px" }} /></a>
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
                                        {selectedBook.bookCheckInDate ? selectedBook.bookCheckInDate : ''}<br />
                                        <a style={{ fontSize: "12px" }}>오후 02:00</a>
                                    </h5>
                                    <h4 style={{ alignItems: "center" }}>~</h4>
                                    <h5 style={{ textAlign: "center", marginBottom: "0" }}>
                                        <b>체크아웃</b><br />
                                        {selectedBook.bookCheckOutDate ? selectedBook.bookCheckOutDate : ''}<br />
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
                                    <h5>{selectedBook.orderId ? selectedBook.orderId : <>결제되지 않았거나 오류로 출력되지 않았습니다.</>}</h5>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h5>캠핑 구역</h5>
                                    <h5>{selectedBook.bookSelectedZone} 구역</h5>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <h5 style={{ marginBottom: "0" }}>
                                        인원<br />
                                        총 {parseInt(selectedBook.bookAdultCount) + parseInt(selectedBook.bookYouthCount) + parseInt(selectedBook.bookChildCount)}명
                                    </h5>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ textAlign: "center" }}>
                                            <h5 style={{ marginBottom: "0" }}>성인</h5>
                                            <h5 style={{ marginBottom: "0" }}>{selectedBook.bookAdultCount}</h5>
                                        </div>
                                        {selectedBook.bookYouthCount > 0 &&
                                            <div style={{ textAlign: "center", marginLeft: "20px" }}>
                                                <h5 style={{ marginBottom: "0" }}>청소년</h5>
                                                <h5 style={{ marginBottom: "0" }}>{selectedBook.bookYouthCount}</h5>
                                            </div>
                                        }
                                        {selectedBook.bookChildCount > 0 &&
                                            <div style={{ textAlign: "center", marginLeft: "20px" }}>
                                                <h5 style={{ marginBottom: "0" }}>미취학아동</h5>
                                                <h5 style={{ marginBottom: "0" }}>{selectedBook.bookChildCount}</h5>
                                            </div>
                                        }
                                        {selectedBook.bookCarCount > 0 &&
                                            <div style={{ textAlign: "center", marginLeft: "20px" }}>
                                                <h5 style={{ marginBottom: "0" }}>차량</h5>
                                                <h5 style={{ marginBottom: "0" }}>{selectedBook.bookCarCount}대</h5>
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
                                <h4>{textMasking(selectedBook.bookUserName, "name")}</h4>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h5>휴대폰 번호</h5>
                                <h5>{textMasking(selectedBook.bookUserPhone, "phone")}</h5>
                            </div>
                            {/* 차량 대수에 따라 반복 */}
                            {
                                selectedBook.bookCarCount && Array.from({ length: selectedBook.bookCarCount }, (_, index) => (
                                    <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                                        <h5 style={{ marginBottom: index == selectedBook.bookCarCount - 1 && "0" }}>차량번호{index + 1}</h5>
                                        <h5 style={{ marginBottom: index == selectedBook.bookCarCount - 1 && "0" }}>{textMasking(selectedBook[`bookCar${index + 1}`], "car")}</h5>
                                    </div>
                                ))
                            }
                        </div>
                        <hr />
                        {/* 요청 사항 */}
                        {
                            selectedBook.bookRequest &&
                            <>
                                <h5>요청 사항</h5>
                                <div style={{ border: "1px solid #4D88FF", borderRadius: "10px", marginBottom: "30px", padding: "10px", backgroundColor: "#4D88FF", color: "white" }}>
                                    <div>
                                        <h5 style={{ marginBottom: "0" }}>{selectedBook.bookRequest}</h5>
                                    </div>
                                </div>
                                <hr />
                            </>
                        }
                        {/* 결제 정보 */}
                        <h5>결제 정보</h5>
                        <h5>총 금액 : {selectedBook.bookTotalPrice}</h5>
                        <div style={{ border: "1px solid #4D88FF", borderRadius: "10px", marginBottom: "30px", padding: "10px", backgroundColor: "#4D88FF", color: "white" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <h4 style={{ marginRight: "auto", fontWeight: "bold" }}>숙박 요금({differenceInDays}박)</h4>
                                <h4 style={{ fontWeight: "bold" }}>총 {selectedBook.bookTotalPrice} 원</h4>
                            </div>
                            <div>
                                <h5 style={{ marginBottom: "0" }}>{selectedBook.bookCheckInDate ? selectedBook.bookCheckInDate : ''}  ~ {selectedBook.bookCheckOutDate ? selectedBook.bookCheckOutDate : ''}</h5>
                            </div>
                        </div>
                        <hr />
                        {/* 예약 취소 버튼 */}
                        <div style={{ margin: "20px", textAlign: "center" }}>
                            {isYesterday ? 
                                <p>예약 취소 가능한 날짜가 아닙니다.</p> : 
                                <Button
                                    variant='contained'
                                    color='error'
                                    disabled={isYesterday} // 체크인 날짜가 오늘 이거나 오늘 이후일 때
                                    onClick={bookCancelBtn}
                                >예약취소</Button>
                            }
                        </div>
                    </div>
                </Box>
            </Modal>
        </div >
    );
}

export default Page;
