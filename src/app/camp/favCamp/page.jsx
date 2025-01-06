'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Modal, Pagination } from '@mui/material';
import Link from 'next/link';
import "./favCamp.css";
import MapModalContent from './kakao_map/page';
import useAuthStore from '../../../../store/authStore';

function Page(props) {
    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [campList, setCampList] = useState([]);
    const itemsPerPage = 9;
    const [currentItems, setCurrentItems] = useState([]);
    const [navMenu, setNavMenu] = useState("/mylog/favcamp");
    const [isModalOpen, setModalOpen] = useState(false);
    const [coordinates, setCoordinates] = useState([]);

    const { user } = useAuthStore();
    const userIdx = user?.userIdx;

    const [currentPage, setCurrentPage] = useState(1);

    const getActiveClass = (link) => {
        return navMenu === link ? 'active' : '';
    };

    const handleMapView = () => {
        const coords = campList.map((camp) => ({
            facltNm: camp.facltNm,
            mapX: camp.mapX,
            mapY: camp.mapY,
        }));
        setCoordinates(coords);
        setModalOpen(true); // 모달 열기
    };

    useEffect(() => {
        // Fetch favcamp list
        const fetchData = async () => {
            try {
                const response = await axios.get(`${CAMP_API_BASE_URL}/mycamp/favCampList`, {
                    params: {
                        userIdx: userIdx,
                    },
                });
                const data = response.data;
                if (data.success) {
                    setCampList(data.data);
                    console.log('Fetched camp list2:', response);
                } else {
                }
            } catch (error) {
                console.error('Error fetching camp list:', error);
            }
        };

        fetchData(); // Call the async function
    }, [userIdx]);


    const totalPages = Math.ceil(campList.length / itemsPerPage);
    useEffect(() => {
        const slicedItems = campList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(camp => ({
            ...camp,
            isLiked: true
        }));
        setCurrentItems(slicedItems);
    }, [campList, currentPage, itemsPerPage]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const extractFeatureNm = (featureNm) => {
        if (!featureNm) return ""; // null이나 undefined 체크
        return featureNm.split("  ", 1)[0]; // 두 개의 공백으로 분리 후 첫 번째 부분 반환
    };

    const handleLike = (campIdx, facltNm, isLiked) => {
        try {
            axios.get(`${CAMP_API_BASE_URL}/camp/like`, {
                params: {
                    userIdx: userIdx,
                    campIdx: campIdx,
                    isLiked: isLiked,
                },
            }).then(() => {
                // alert 창 띄우기
                !isLiked
                    ? alert(`${facltNm}이/가 찜한 캠핑장에 추가되었습니다.`)
                    :
                    alert(`${facltNm}이/가 찜한 캠핑장에서 제거되었습니다.`);
                setCurrentItems(prevItems =>
                    prevItems.map(camp =>
                        camp.campIdx === campIdx ? { ...camp, isLiked: !camp.isLiked } : camp
                    )
                );


            });
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    return (
        <>
            <div className="mylog-navmenu-container">
                {/* 상단 네비게이션바 */}
                <Link href="/mycamp/plan/list"
                    className={`btn1 ${getActiveClass('/mylog/plan')}`}
                    onClick={() => setNavMenu('/mylog/plan')}
                >
                    캠핑플래너
                </Link>
                <Link href="/book/list"
                    className={`btn1 ${getActiveClass('/book/list')}`}
                    onClick={() => setNavMenu('/book/list')}
                >
                    나의 예약
                </Link>
                <Link href="/mylog/list"
                    className={`btn1 ${getActiveClass('/mylog/list')}`}
                    onClick={() => setNavMenu('/mylog/list')}
                >
                    나의 캠핑로그
                </Link>
                <Link href="/camp/favCamp"
                    className={`btn1 ${getActiveClass('/mylog/favcamp')}`}
                    onClick={() => setNavMenu('/mylog/favcamp')}
                >
                    위시리스트
                </Link>
            </div>

            <div className="mylog-favcamp-main-container">
                <div style={{ padding: '20px' }}>
                    {/* 헤더 제목 영역 */}
                    <div className="mylog-favcamp-header-container">
                        <p style={{ fontSize: "35px", fontWeight: "bold" }}>위시리스트</p>

                        <div style={{ marginBottom: '20px' }}>
                            저장된 장소: {campList.length}개
                            <button
                                style={{
                                    marginTop: '-40px', // 버튼을 위로 10px 올림
                                    marginRight: '30px',
                                    float: 'right',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    background: '#007BFF',
                                    color: '#fff',
                                }}
                                onClick={handleMapView}
                            >
                                지도에서 보기
                            </button>
                        </div>
                        {/* 모달 */}
                        <Modal
                            open={isModalOpen}
                            onClose={() => setModalOpen(false)}
                            aria-labelledby="map-modal-title"
                            aria-describedby="map-modal-description"
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '80%',
                                    height: '80%',
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                }}
                            >
                                {/* 지도 모달 내용  */}
                                <MapModalContent coordinates={coordinates} />
                            </Box>
                        </Modal>
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            maxWidth: '1200px',
                            margin: '0 auto',
                            gap: '50px',
                            padding: '0 20px',
                        }}
                    >

                        {Array.isArray(currentItems) && currentItems.length > 0 ? (
                            currentItems.map((camp) => (

                                <div
                                    key={camp.campIdx}
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Link href={`/camp/detail/${camp.campIdx}`}>
                                        <img
                                            src={camp.firstImageUrl ? camp.firstImageUrl : camp.campImg2 ? camp.campImg2 : "/images/campImageholder.png"}
                                            onError={(e) => e.target.src = "/images/campImageholder2.png"}
                                            alt={camp.facltNm}
                                            width={200}
                                            height={250}
                                            style={{
                                                objectFit: 'cover', width: '100%', borderRadius: '50px', backgroundColor: '#fff',
                                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', border: '1px solid #eee'
                                            }}
                                        />
                                    </Link>
                                    <div className='info' style={{ padding: '10px' }}>
                                        <Link href={`/camp/detail/${camp.campIdx}`} style={{ textDecoration: 'none', color: 'inherit' }}></Link>
                                        <Link href={`/camp/detail/${camp.campIdx}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <h3 style={{ fontSize: '16px', margin: '5px 0' }}>{camp.facltNm}</h3>
                                            {camp.lineIntro && (<p style={{ fontSize: '12px', color: '#555', margin: '5px 0' }}>{camp.lineIntro}</p>)}
                                            {!camp.lineIntro && camp.featureNm && (<p style={{ fontSize: '12px', color: '#777', margin: '5px 0' }}>{extractFeatureNm(camp.featureNm)}</p>)}
                                            <p style={{ fontWeight: 'bold', margin: '10px 0', fontSize: '14px' }}>{camp.induty}</p>
                                        </Link>
                                        <button
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleLike(camp.campIdx, camp.facltNm, camp.isLiked)}
                                        >
                                            <span style={{ fontSize: '1.5em' }}>
                                                {camp.isLiked ? '❤️' : '🤍'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>찜한 캠핑 정보가 없습니다.</p>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}

export default Page;