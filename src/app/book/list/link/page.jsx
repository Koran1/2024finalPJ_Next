"use client"
import { Box, Button, ButtonGroup, IconButton, InputBase, Modal, Pagination, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useAuthStore from '../../../../../store/authStore';
import SearchIcon from '@mui/icons-material/Search';

function Page(myBookList) {
    const { user, token } = useAuthStore();
    const userIdx = user?.userIdx;
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null); // 선택된 planIdx
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [searchTerm, setSearchTerm] = useState('');

    // 검색어 입력 시 상태 업데이트
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

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

    // 검색어 필터링
    const filteredPlans = plans.filter((plan) => {
        return plan.planTitle.includes(searchTerm);
    });

    // 현재 페이지에 해당하는 데이터 필터링
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

    const plan = currentPlans.find(plan => plan.planIdx === myBookList.planIdx);

    useEffect(() => {
        // Fetch favcamp list
        const fetchData = async () => {
            try {
                const response = await axios.post(`${CAMP_API_BASE_URL}/mycamp/plan/list`, userIdx, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
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

    const handleSelectPlan = (planIdx) => {
        setSelectedPlan(planIdx === selectedPlan ? null : planIdx);
    };





    return (
        <div>
            {myBookList.campIdx === null ? (
                <div className="connect-plan-body" onClick={() => setModalOpen(true)}
                    style={{ cursor: 'pointer' }} // 마우스 포인터를 손 모양으로 변경
                >
                    <AddCircleOutlineIcon />
                    <span className="connect-plan-text">현재 연동된 계획이 없습니다.</span>
                </div>
            ) : (
                <div className="plan-item">
                    <div className="plan-details" style={{ marginLeft: '15px' }}>
                        <p>{plan.planBeginDate2}~{plan.planEndDate2}</p>
                        <p>{plan.facltNm}</p>
                    </div>
                    <p className="plan-title" style={{ marginLeft: '15px' }}>{plan.planTitle}</p>
                    <p className="plan-update">{formatUpdateDate(plan.planUpdateDate)}</p>
                </div>
            )}

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
                        width: '900px',
                        height: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto', // 스크롤 기능 추가
                    }}
                >
                    {/* 지도 모달 내용  */}
                    <div className="plan-list">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px', // 검색 바와 버튼 그룹 간 간격
                            }}
                        >
                            <Paper
                                component="form"
                                sx={{
                                    p: '2px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flex: 1, // 공간을 균등하게 차지
                                }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="계획 제목을 입력하세요"
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                />
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                            <ButtonGroup
                                variant="outlined"
                                aria-label="Basic button group"
                                style={{
                                    marginLeft: 'auto', // 오른쪽 끝으로 정렬
                                }}
                            >
                                <Button>계획 연동</Button>
                                <Button>연동 해제</Button>
                            </ButtonGroup>
                        </div>

                        {currentPlans.length === 0 ? (
                            <p>캠핑 계획이 없습니다.</p>
                        ) : (
                            currentPlans.map((plan) => (
                                <div key={plan.planIdx} className={`plan-item ${selectedPlan === plan.planIdx ? "selected" : ""
                                    }`} style={{ fontSize: '21px', cursor: "pointer" }} onClick={() => handleSelectPlan(plan.planIdx)}>
                                    <img src={plan.firstImageUrl ? plan.firstImageUrl : plan.campImg2 ? plan.campImg2 : "/images/campImageholder.png"} alt={plan.facltNm} className="plan-image" />
                                    <div className="plan-details" style={{ marginLeft: '15px' }}>
                                        <p>{plan.facltNm}</p>
                                        <p>{plan.planBeginDate2}~{plan.planEndDate2}</p>
                                    </div>
                                    <p className="plan-title" style={{ marginLeft: '15px' }}>{plan.planTitle}</p>
                                    <p className="plan-update" style={{ fontSize: '17px' }}>{formatUpdateDate(plan.planUpdateDate)}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="pagination">
                        <Pagination
                            count={Math.ceil(filteredPlans.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="medium"
                        />
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default Page;