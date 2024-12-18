"use client"
import React, { useEffect, useState } from 'react'
import './detail.css'
import Map from './../../page/detail_map/page'
import './../../page/detail_map/detail_map.css'
import Info from './../../page/detail_info/page'
import './../../page/detail_info/detail_info.css'
import Etc from './../../page/detail_etc/page'
import './../../page/detail_etc/detail_etc.css'
import './../../page/detail_log/detail_log.css'
import axios from 'axios'

function Page({ params }) {
    const CAMP_API_BASE_URL = "http://localhost:8080/api"
    const [item, setItem] = useState([]); //데이터 상태

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { id } = await Promise.resolve(params);
                const API_URL = `${CAMP_API_BASE_URL}/camp/detail/${id}`;
                console.log(API_URL);

                // 데이터 가져오기
                const response = await axios.get(API_URL);
                const data = response.data;
                if (data.success) {
                    setItem(data.data);
                } else {
                    console.error("data fail");
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();

    }, [params, CAMP_API_BASE_URL]);
    console.log(item);
    // info 가 없는경우



    const [isLiked, setIsLiked] = useState(false);
    const handleLike = () => {
        setIsLiked(!isLiked);
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
                        src={item.firstImageUrl}
                        alt="캠핑장 이미지"
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

                            <p>
                                📍 위치: {item.addr1}
                                <br />
                                🔗 홈페이지: <a href={item.homepage} target="_blank" rel="noopener noreferrer">{item.homepage}</a>
                                <br />
                                ☎️ 전화: {item.tel}
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
            </div>

            {/* 캠핑장 댓글 */}


        </>
    );
}

export default Page;