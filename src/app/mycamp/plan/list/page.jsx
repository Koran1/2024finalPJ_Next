'use client';
import React, { use, useEffect, useState } from 'react';
import './planlist.css';
import { Button, Pagination } from '@mui/material';
import Link from 'next/link';
import useAuthStore from '../../../../../store/authStore';
import axios from 'axios';

function Page(props) {

    const { user } = useAuthStore();
    const userIdx = user?.userIdx;
    const [plans, setPlans] = useState([]);
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    useEffect(() => {
        // Fetch favcamp list
        const fetchData = async () => {
            try {
                const response = await axios.post(`${CAMP_API_BASE_URL}/mycamp/plan/list`, userIdx);
                const data = response.data;
                if (data.success) {
                    setPlans(data.data);
                    console.log('Fetched camp list2:', response);
                } else {
                }
            } catch (error) {
                console.error('Error fetching camp list:', error);
            }
        };
        console.log('userIdx:', userIdx);
        fetchData(); // Call the async function
    }, [userIdx]);


    const formatUpdateDate = (updateDateStr) => {
        const updateDate = new Date(updateDateStr);
        const now = new Date();

        const diffInMilliseconds = now - updateDate;
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

        if (diffInDays >= 7) {
            // 일주일 이상: yyyy.MM.dd 형식
            const year = updateDate.getFullYear();
            const month = String(updateDate.getMonth() + 1).padStart(2, '0');
            const day = String(updateDate.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        } else if (diffInDays >= 1) {
            // 하루 전
            return `${diffInDays}일 전`;
        } else if (diffInHours >= 1) {
            // n시간 전
            return `${diffInHours}시간 전`;
        } else {
            // n분 전
            return `${diffInMinutes}분 전`;
        }
    };




    // 개별 체크박스 선택 핸들러
    const handleCheckboxChange = (planId) => {
        setSelectedPlans((prevSelected) =>
            prevSelected.includes(planId)
                ? prevSelected.filter((id) => id !== planId)
                : [...prevSelected, planId]
        );

    };

    // 체크박스 관리
    useEffect(() => {
        if (selectedPlans.length === currentPlans.length && currentPlans.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
        console.log(selectedPlans);

    }, [selectedPlans]);



    // 전체 선택/해제 핸들러
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedPlans([]); // 전체 해제
        } else {
            setSelectedPlans(plans.map((plan) => plan.planIdx)); // 전체 선택
        }
        setSelectAll(!selectAll);
    };

    // 삭제 버튼 함수
    const handleDelete = (selectedPlans) => {
        try {
            axios.post(`${CAMP_API_BASE_URL}/mycamp/plan/delete`,
                selectedPlans,
                {
                    headers: {
                        'Content-Type': 'application/json', // JSON 요청임을 명시
                    }
                }).then(() => {
                    // alert 창 띄우기
                    alert(`${selectedPlans.length}개의 계획이 삭제되었습니다.`)
                    // 새로고침
                    window.location.reload();
                });
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 페이지 변경 핸들러
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // 현재 페이지에 해당하는 데이터 필터링
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPlans = plans.slice(startIndex, startIndex + itemsPerPage);

    // 네비게이션 메뉴 상태
    const [navMenu, setNavMenu] = useState("/mylog/plan");

    const getActiveClass = (link) => {
        return navMenu === link ? 'active' : '';
    };

    return (
        <>
            <div className="mylog-navmenu-container">
                {/* 상단 네비게이션바 */}
                <Link href="/mycamp/plan/list"
                    className={`btn1 ${getActiveClass('/mycamp/plan/list')}`}
                    onClick={() => setNavMenu('/mycamp/plan/list')}
                >
                    캠핑플래너
                </Link>
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
            <div className="camping-planner">
                <h1>Camping Planner</h1>
                <div className="planner-header">
                    {/* 전체 선택/해제 체크박스 */}
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                        style={{ marginLeft: '25px' }}
                    />
                    <Button variant="contained" color="primary"
                        onClick={() => handleDelete(selectedPlans)}
                        style={{ marginLeft: '10px' }}                     >
                        삭제
                    </Button>
                    <div className="columns">
                        <span>계획일정/캠핑장</span>
                        <span>제목</span>
                        <span>날짜/등록순</span>
                    </div>
                </div>
                <button className="add-plan-button">+ 새 계획 등록하기</button>
                <div className="plan-list">
                    {currentPlans.length === 0 ? (
                        <p>캠핑 계획이 없습니다.</p>
                    ) : (
                        currentPlans.map((plan) => (
                            <div key={plan.planIdx} className="plan-item">
                                {/* 개별 체크박스 */}
                                <input
                                    type="checkbox"
                                    checked={selectedPlans.includes(plan.planIdx)}
                                    onChange={() => handleCheckboxChange(plan.planIdx)}
                                />
                                <img src={plan.firstImageUrl ? plan.firstImageUrl : plan.campImg2 ? plan.campImg2 : "/images/campImageholder.png"} alt={plan.facltNm} className="plan-image" />
                                <div className="plan-details" style={{ marginLeft: '15px' }}>
                                    <p>{plan.planBeginDate2}~{plan.planEndDate2}</p>
                                    <p>{plan.facltNm}</p>
                                </div>
                                <p className="plan-title" style={{ marginLeft: '15px' }}>{plan.planTitle}</p>
                                <p className="plan-update">{formatUpdateDate(plan.planUpdateDate)}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="pagination">
                    <Pagination
                        count={Math.ceil(plans.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="medium"
                    />
                </div>
            </div>
        </>
    );
}

export default Page;