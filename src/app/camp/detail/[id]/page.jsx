"use client"
import React, { useEffect, useState } from 'react'
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
    const { isAuthenticated, user } = useAuthStore(); // 로그인 상태
    const params = useParams();
    const campIdx = params?.id; // URL에서 받아온 campIdx
    const userIdx = user?.userIdx;
    const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
    const router = useRouter(); // useRouter 초기화
    useEffect(() => {

        const fetchData = async () => {
            try {
                const API_URL = `${CAMP_API_BASE_URL}/camp/detail/${campIdx}`;
                const API_URL2 = `${CAMP_API_BASE_URL}/camp/detail/log/${campIdx}`;

                // 데이터 가져오기
                const response = await axios.get(API_URL);
                const data = response.data;
                const response2 = await axios.get(API_URL2);
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

    }, [campIdx, CAMP_API_BASE_URL]);

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

    const [activeTab, setActiveTab] = useState('guide');
    const [logAlign, setLogAlign] = useState('rec');

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
                            : item.campImg2
                                ? item.campImg2
                                : "/images/campImageholder2.png"}
                        alt="캠핑장 사진"
                        className="product-image"
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
                                <PhoneIcon sx={{ color: "#5F8FF0" }} /> 전화: {item.tel}
                            </p>
                        </div>

                        {/* 예약 및 수정 버튼 */}
                        <div className="action-buttons">
                            <button className="reserve-btn">예약하기</button>
                            <button className="info-request-btn">정보수정 요청</button>
                        </div>
                    </div>
                </div>




            </div>

            {/* 지도 */}
            <Map />

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


        </>
    );
}

export default Page;