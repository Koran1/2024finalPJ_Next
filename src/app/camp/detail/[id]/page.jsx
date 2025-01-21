"use client"
import React, { useEffect, useMemo, useState } from 'react'
import './detail.css'
import Map from './../../detailPage/detail_map/page'
import './../../detailPage/detail_map/detail_map.css'
import Info from './../../detailPage/detail_info/page'
import './../../detailPage/detail_info/detail_info.css'
import Etc from './../../detailPage/detail_etc/page'
import './../../detailPage/detail_etc/detail_etc.css'
import './../../detailPage/detail_log/detail_log.css'
import axios from 'axios'
import Log from './../../detailPage/detail_log/page'
import './../../detailPage/detail_log/detail_log.css'
// 아이콘
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
// 로그인 정보
import useAuthStore from './../../../../../store/authStore';
import { useParams, useRouter } from 'next/navigation'

function Page() {
    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [item, setItem] = useState([]); //캠프 상세 데이터 상태
    const [posts, setPosts] = useState([]); //Log 데이터 상태
    const { isAuthenticated, user, token } = useAuthStore(); // 로그인 상태
    const params = useParams();
    const campIdx = params?.id; // URL에서 받아온 campIdx
    const userIdx = user?.userIdx;
    const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
    const router = useRouter(); // useRouter 초기화
    const [activeTab, setActiveTab] = useState('guide');
    const [logAlign, setLogAlign] = useState('rec');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 모달 상태 추가
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스

    // 이미지 배열 생성
    const images = useMemo(() => {
        if (!item) return [];
        return [
            item.firstImageUrl,
            item.campImg3,
            item.campImg4,
            item.campImg5
        ].filter(img => img); // null/undefined 제거
    }, [item]);

    // 이미지 모달 관련 핸들러들
    const handleImageClick = () => {
        setCurrentImageIndex(0);
        setIsImageModalOpen(true);
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            (prev - 1 + images.length) % images.length
        );
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            (prev + 1) % images.length
        );
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const API_URL = `${CAMP_API_BASE_URL}/camp/detail/${campIdx}`;
                const API_URL2 = `${CAMP_API_BASE_URL}/camp/detail/log/${campIdx}`;

                // 데이터 가져오기
                const response = await axios.get(API_URL);
                const data = response.data;
                const response2 = await axios.get(API_URL2, {
                    params: { logAlign: logAlign, },
                });
                const data2 = response2.data;
                if (data.success) {
                    setItem(data.data);
                } else {
                    console.error("Failed to fetch camp details.");
                }
                if (data2.success) {
                    setPosts(data2.data);
                } else {
                    console.error("Failed to fetch camp logs.");
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();

    }, [campIdx, CAMP_API_BASE_URL, logAlign]);

    // 좋아요 상태를 가져오는 useEffect
    useEffect(() => {
        if (isAuthenticated && campIdx) {
            axios
                .get(`${CAMP_API_BASE_URL}/camp/like-status`, {
                    params: {
                        userIdx: userIdx,
                        campIdx: campIdx,
                    },
                })
                .then((response) => {
                    console.log("Full response:", response.data); // Log the full response
                    setIsLiked(response.data.data);
                    console.log("a:", response.data.data);
                })
                .catch((error) => {
                    console.error("Failed to fetch like status", error);
                });
        }
    }, [isAuthenticated, userIdx, campIdx, CAMP_API_BASE_URL]);



    const handleLike = () => {
        if (!isAuthenticated) {
            // 로그인하지 않은 경우 로그인 페이지로 이동
            router.push("/user/login");
            return;
        }

        // 서버에 좋아요 추가/삭제 요청
        console.log("c:", isLiked);

        try {
            axios.get(`${CAMP_API_BASE_URL}/camp/like`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    userIdx: userIdx,
                    campIdx: campIdx,
                    isLiked: isLiked,
                },
            });
            setIsLiked(!isLiked); // 상태 업데이트
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }

    };



    const extractFeatureNm = (featureNm) => {
        if (!featureNm) return ""; // null이나 undefined 체크
        return featureNm.split("  ", 1)[0]; // 두 개의 공백으로 분리 후 첫 번째 부분 반환
    };


    return (
        <>

            <div className="detail-container">
                {/* 캠핑장 상세보기기 */}
                <div className="product-main">
                    {/* 캠핑장 이미지 */}
                    <img
                        src={item.firstImageUrl
                            ? item.firstImageUrl
                            : item.campImg3
                                ? item.campImg3
                                : "/images/campImageholder2.png"}
                        alt="캠핑장 사진"
                        onError={(e) => e.target.src = "/images/campImageholder2.png"}
                        className="product-image"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                    />

                    {/* 캠핑장 정보 섹션 */}
                    <div className="product-info">
                        {/* 캠핑장 이름과 좋아요 버튼 */}
                        <div className="product-header">
                            <h3>{item.facltNm}</h3>
                            <button
                                className="like-btn"
                                onClick={handleLike}
                            >
                                {isLiked ? '❤️' : '🤍'}
                            </button>
                        </div>
                        <hr />



                        <div className="product-description">

                            {item.lineIntro && (<p>{item.lineIntro}</p>)}
                            {!item.lineIntro && item.featureNm && (<p>{extractFeatureNm(item.featureNm)}</p>)}
                            {item.induty && (<p>{item.induty}</p>)}

                            <p>
                                <LocationOnIcon sx={{ color: "#5F8FF0" }} /> 위치: {item.addr1}
                                <br />
                                <HomeIcon sx={{ color: "#5F8FF0" }} /> 홈페이지: <a href={item.homepage} target="_blank" rel="noopener noreferrer">{item.homepage}</a>
                                <br />
                                {item.tel && <><PhoneIcon sx={{ color: "#5F8FF0" }} /> 전화: {item.tel}</>}
                            </p>
                        </div>

                        {/* 예약 및 수정 버튼 */}
                        <div className="action-buttons">
                            <button className="reserve-btn"
                                onClick={() => userIdx > 0 ? router.push(`/book/write?campIdx=${campIdx}`) :
                                    (alert("로그인 후 예약작성이 가능합니다"))}
                            >예약하기</button>
                            {/* <button className="info-request-btn" onClick={() => { alert("report 창으로") }}>정보수정 요청</button> */}
                        </div>
                    </div>
                </div>

            </div>

            {/* 지도 */}
            <Map item={item} />

            {/* 이용안내/기타 주요시설 */}
            <div className="usage-guide-container">
                <div className="tab-container">
                    <div
                        className={`tab ${activeTab === 'guide' ? 'active' : ''}`}
                        onClick={() => setActiveTab('guide')}
                    >
                        이용 안내
                    </div>
                    <div
                        className={`tab ${activeTab === 'facility' ? 'active' : ''}`}
                        onClick={() => setActiveTab('facility')}
                    >
                        기타 주요시설
                    </div>
                </div>

                <div className="content-section">
                    {activeTab === 'guide' && (
                        <div>
                            <Info item={item} /> {/* item 정보를 props로 전달 */}
                        </div>
                    )}
                    {activeTab === 'facility' && (
                        <div>
                            <Etc item={item} />
                        </div>
                    )}
                </div>
            </div>

            {/* 캠핑장 후기 */}
            <div className="log-container">
                <div className="log-header">
                    <div>
                        캠핑장 후기
                    </div>
                    <div className="log-tab">
                        <div
                            className={`log ${logAlign === 'rec' ? 'active' : ''}`}
                            onClick={() => setLogAlign('rec')}
                        >
                            공감순
                        </div>
                        <div
                            className={`log ${logAlign === 'new' ? 'active' : ''}`}
                            onClick={() => setLogAlign('new')}
                        >
                            최신순
                        </div>
                    </div>
                </div>
                <Log posts={posts} />
            </div>

            {/* 캠핑장 댓글 */}

            {/* 이미지 모달 */}
            {isImageModalOpen && (
                <div className="image-modal-overlay" onClick={() => setIsImageModalOpen(false)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[currentImageIndex] || '/images/campImageholder2.png'}
                            alt="확대된 캠핑장 이미지"
                            className="modal-image"
                        />
                        <button
                            className="close-modal-btn"
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            ✕
                        </button>
                        {images.length > 1 && (
                            <>
                                <button
                                    className="nav-btn prev-btn"
                                    onClick={handlePrevImage}
                                >
                                    ❮
                                </button>
                                <button
                                    className="nav-btn next-btn"
                                    onClick={handleNextImage}
                                >
                                    ❯
                                </button>
                                <div className="image-counter">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Page;