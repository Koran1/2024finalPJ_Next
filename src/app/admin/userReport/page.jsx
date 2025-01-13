"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FormControl, Grid2, IconButton, InputLabel, MenuItem, Modal, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';
import { useRouter } from 'next/navigation';
import { Close, Search } from '@mui/icons-material';
import axios from 'axios';

function Page(props) {
    const [filterStatus, setFilterStatus] = useState("all"); // 필터 옵션 박스
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련
    const [page, setPage] = useState(1);
    const size = 10;                     // 1페이지당 행 개수
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reportList, setReportList] = useState([]);
    const [isReportModalOpen, setReportModalOpen] = useState(false);// 신고 모달 창 열기
    const [selectedReportRow, setSelectedReportRow] = useState({});
    const [userNickname, setUserNickname] = useState([]);

    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    const router = useRouter(); // useRouter 훅 사용
    useEffect(() => {
        fetchData(); // Call the async function
    }, [page, size, filterStatus]);
    // Fetch camp list
    const fetchData = async () => {
        const searchData = {
            page: page,
            size: size,
            sortOption: filterStatus
        };
        setLoading(true);
        try {
            const response = await axios.post(`${LOCAL_API_BASE_URL}/admin/getReportList`, searchData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = response.data;
            if (data.success) {
                console.log("reportList : ", data.data.reportList.data);
                setReportList(data.data.reportList.data);
                console.log("userNicknameMap : ", data.data.userNicknameMap);
                setUserNickname(data.data.userNicknameMap);
                // setTotalCount(data.data.totalCount);
                setTotalPages(data.data.reportList.totalPages);

                console.log('Fetched camp list:', response);
            } else {
            }
        } catch (error) {
            console.error('Error fetching camp list:', error);
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경 핸들러
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    // TableRow 클릭 핸들러(모달 열기)
    const handleRowClick = (row) => {
        // 선택한 행의 신고 정보들 저장
        setSelectedReportRow(row);
        setReportModalOpen(true);
    };

    const changeTypeText = (tableType) => {
        let changeText;
        switch (tableType) {
            case '1': changeText = "거래 상품 신고"; break;
            case '2': changeText = "캠핑장 상세보기 댓글 신고"; break;
            case '3': changeText = "후기 글 신고"; break;
            case '4': changeText = "후기 댓/답글 신고"; break;
            default:
                break;
        }

        return changeText;
    }

    // 신고 처리(승인,반려)
    const reportProcess = async (row, state) => {
        const API_URL = `${LOCAL_API_BASE_URL}/admin/reportProcess`;

        try {
            // 반려일 땐 신고Idx 만 보내서 해당 신고Idx만 reportStatus = 2로 업데이트
            let data = {
                reportIdx: row.reportIdx,
                reportStatus: '2',
            };
            // 승인일 땐 신고 테이블 종류와 신고 테이블 Idx을 추가로 보내 reportStatus = 1로 일괄 업데이트
            if (state == "approve") {
                data.reportTableType = row.reportTableType;
                data.reportTableIdx = row.reportTableIdx;
                data.reportStatus = '1'
            }

            // 서버에 저장
            await axios.post(API_URL, data);

            // 페이지 새로 고침
            window.location.reload();
        } catch (error) {
            alert("신고 처리 오류 : " + error);
        }
    };

    return (
        <Box position="relative" display="flex">
            {/* 좌측 네비게이션 메뉴 */}
            <AdminList />

            {/* 우측 컨텐츠 */}
            <Box flex={1} p={3}>
                {/* 상단 현재 시간 */}
                <CurrentTime />

                {/* 상단 필터 영역 */}
                <Box
                    display="flex"
                    alignItems="center"
                    mt={5}
                    mb={2}
                    sx={{
                        gap: '16px',
                        height: '48px',
                    }}
                >
                    {/* 드롭다운 영역 */}
                    <FormControl
                        variant="standard"
                        sx={{
                            minWidth: 120,
                            height: '100%',
                            justifyContent: 'center',
                            boxSizing: 'border-box',
                        }}
                    >
                        <InputLabel
                            id="filter-status-label"
                            sx={{
                                lineHeight: '48px',
                            }}
                        >
                        </InputLabel>
                        <Select
                            labelId="filter-status-label"
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setPage(1);
                            }}
                            sx={{
                                height: '48px',
                                alignItems: 'center',
                            }}
                        >
                            <MenuItem value="all">전체</MenuItem>
                            <MenuItem value="deal">거래 상품</MenuItem>
                            {/* <MenuItem value="campComment">캠핑장 상세보기 댓글</MenuItem> */}
                            <MenuItem value="log">로그 글</MenuItem>
                            <MenuItem value="logComment">로그 댓/답글</MenuItem>
                        </Select>
                    </FormControl>

                </Box>

                {/* 테이블 */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead className="admin-reportlist-table-head">
                            <TableRow>
                                <TableCell align='center'>Idx</TableCell>
                                <TableCell align='center'>신고자</TableCell>
                                <TableCell align='center'>신고 테이블 종류</TableCell>
                                <TableCell align='center'>신고 테이블 Idx</TableCell>
                                <TableCell align='center'>신고 카테고리</TableCell>
                                <TableCell align='center'>신고 내용</TableCell>
                                <TableCell align='center'>신고일</TableCell>
                                <TableCell align='center'>처리여부</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="admin-reportlist-table-body">
                            {reportList.length > 0 ?
                                reportList.map((row) => (
                                    <TableRow
                                        key={row.reportIdx}
                                        sx={{
                                            backgroundColor: row.reportStatus == '0' ? 'inherit' : '#D9EAFD', // 신고 승인처리 한 경우 배경색 설정
                                        }}
                                        onClick={() => handleRowClick(row)} // TableRow 클릭 시 핸들러 호출
                                        style={{ cursor: 'pointer' }} // 마우스 포인터를 손 모양으로 변경
                                        hover // 마우스를 올렸을 때 옅은 회색으로 변경
                                    >
                                        <TableCell align='center'>{row.reportIdx}</TableCell>
                                        <TableCell align='center'>{userNickname[row.userIdx]}</TableCell>        {/* 닉네임 으로 변경하기 */}
                                        <TableCell align='center'>{changeTypeText(row.reportTableType)}</TableCell>{/* 1~4 종류별 이름으로 바꾸기 */}
                                        <TableCell align='center'>{row.reportTableIdx}</TableCell>
                                        <TableCell align='center'>{row.reportCategory}</TableCell>
                                        <TableCell align='center'>{row.reportContent ? row.reportContent : "X"}</TableCell>
                                        <TableCell align='center'>{row.reportRegDate}</TableCell>
                                        <TableCell align='center'>{row.reportStatus == '0' ? "처리중" : row.reportStatus == '1' ? "승인" : "반려"}</TableCell> {/* 신고 처리여부 텍스트로 표시 */}
                                    </TableRow>
                                ))
                                :
                                <TableRow>
                                    <TableCell colSpan={8} align="center">신고사항이 없습니다</TableCell>
                                </TableRow>
                            }
                            {/* Pagination 컴포넌트 추가 */}
                        </TableBody>

                    </Table>
                    <Pagination
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '16px',
                        }}
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </TableContainer>
            </Box>

            {/* 신고 모달 */}
            <Modal
                open={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
                aria-labelledby="reportModal"
                aria-describedby="reportModal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px',
                        height: '77%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto', // 스크롤 기능 추가
                    }}
                >
                    {/* 신고 내용 */}
                    <div>
                        {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h4 style={{ margin: "0" }}>신고 상세</h4>
                            <IconButton onClick={() => setReportModalOpen(false)}><Close /></IconButton>
                        </div>
                        <hr /> */}
                        {/* 이 div 피그마의 필드만큼 작성하기 */}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p style={{ marginBottom: "10px", width: "200px", margin: "auto" }}>신고자</p>
                            {/* <p>{userNickname[selectedReportRow.userIdx]}</p> */}
                            <TextField label="신고자" name='userNickname' fullWidth margin="normal" value={userNickname[selectedReportRow.userIdx]} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            {/* 피신고자 닉네임도 가져오기 */}
                            <p style={{ marginBottom: "10px", width: "200px", margin: "auto" }}>피신고자</p>
                            {/* <p>{userNickname[selectedReportRow.reportedUserIdx]}</p> */}
                            <TextField label="피신고자" name='reportedUserNickname' fullWidth margin="normal" value={userNickname[selectedReportRow.reportedUserIdx]} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p style={{ marginBottom: "10px", width: "200px", margin: "auto" }}>신고테이블 종류</p>
                            {/* <p>{selectedReportRow.reportTableType}</p> */}
                            <TextField label="신고테이블 종류" name='reportTableType' fullWidth margin="normal" value={changeTypeText(selectedReportRow.reportTableType)} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p style={{ marginBottom: "10px", width: "200px", margin: "auto" }}>신고테이블 Idx</p>
                            {/* <p>{selectedReportRow.reportTableIdx}</p> */}
                            <TextField label="신고테이블 Idx" name='reportTableIdx' fullWidth margin="normal" value={selectedReportRow.reportTableIdx} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p style={{ marginBottom: "10px", width: "200px", margin: "auto" }}>신고 카테고리</p>
                            {/* <p>{selectedReportRow.reportCategory}</p> */}
                            <TextField label="신고 카테고리" name='reportCategory' fullWidth margin="normal" value={selectedReportRow.reportCategory} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p style={{ marginBottom: "10px", width: "200px", margin: "auto" }}>신고일</p>
                            {/* <p>{selectedReportRow.reportRegDate}</p> */}
                            <TextField label="신고일" name='reportRegDate' fullWidth margin="normal" value={selectedReportRow.reportRegDate} />
                        </div>
                        <h5>신고내용</h5>
                        <div style={{ marginBottom: "20px", textAlign: "right" }}>
                            <TextField label="신고 내용"
                                name='reportContent'
                                value={selectedReportRow.reportContent}
                                fullWidth
                                multiline
                                maxRows={5}
                                margin="normal"
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
                            <Button
                                variant='contained'
                                color='error'
                                disabled={selectedReportRow.reportStatus == '1' ? true : false}
                                onClick={() => reportProcess(selectedReportRow, "approve")}
                            >승인</Button>
                            <Button
                                variant='contained'
                                color='inherit'
                                style={{ marginLeft: "20px" }}
                                disabled={selectedReportRow.reportStatus == '2' ? true : false}
                                onClick={() => reportProcess(selectedReportRow, "return")}
                            >반려</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </Box>
    );
}

export default Page;
