"use client";
import "./userList.css";
import { useEffect, useRef, useState } from 'react';
import { Search } from "@mui/icons-material";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField,
    Select, MenuItem, InputLabel, FormControl, IconButton, Button, Pagination, Modal, Typography
} from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';
import axios from "axios";

// 모달 스타일 정의
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
    borderRadius: '8px',
};

function Page() {
    const [adminUserList, setAdminUserList] = useState([]); // 관리자 사용자 정보 리스트
    const [selectedSearch, setSelectedSearch] = useState("all"); // 검색어 옵션 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [totalCount, setTotalCount] = useState(0); // 검색 결과 개수
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련
    const [page, setPage] = useState(1); // 페이징-1페이지
    const [size, setSize] = useState(10); // 페이징-한 페이지 당 데이터 개수
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태

    // 편집 가능한 필드 상태
    const [editedEmail, setEditedEmail] = useState("");

    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const inputRef = useRef(null);

    // Admin userList 리스트 가져오기
    const getAdminUserList = async () => {
        setLoading(true);
        const searchKeyword = keyword?.trim() || null;
        try {
            const response = await axios.get(`${CAMP_API_BASE_URL}/admin/userList`, {
                params: {
                    keyword: searchKeyword,
                    option: selectedSearch,
                    page,
                    size,
                },
            });
            if (response.data.success) {
                setAdminUserList(response.data.data.data);
                setTotalPages(response.data.data.totalPages);
                setTotalCount(response.data.data.totalCount);
                console.log("관리자 사용자 정보 리스트: ", response.data.data.data);
            }
        } catch (err) {
            setError("데이터를 가져오는 중 오류가 발생했습니다: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    // 데이터 로드
    useEffect(() => {
        getAdminUserList();
    }, [page, size, selectedSearch]);

    // 검색 함수
    const handleSearch = () => {
        setPage(1);
        getAdminUserList();
    };

    // 검색 엔터 함수
    const handleKeyUp = (e) => {
        if (!isComposing && e.key === "Enter") {
            setPage(1);
            getAdminUserList();
        }
    };

    // 검색어 필드 클릭 시 초기화
    const handleInputClick = () => {
        setKeyword("");
    };

    // 옵션 박스 변경 함수
    const handleSelectChange = (e) => {
        setSelectedSearch(e.target.value);
        setPage(1);
    };

    // userId, n_userId, k_userId *표 마스킹 처리
    const maskUserId = (str) => {
        if (!str || str.length < 3) return str;
        return str.slice(0, -3) + '***';
    };

    // userName *표 마스킹 처리
    const maskUserName = (str) => {
        if (!str) return str; 
        const len = str.length;

        if (len === 1) {
            return '*';
        } else if (len === 2) {
            return str[0] + '*';
        } else {
            const middle = Math.floor(len / 2);
            return str.slice(0, middle) + '*' + str.slice(middle + 1);
        }
    };

    // userPhone *표 마스킹 처리
    const maskUserPhone = (str) => {
        const len = str.length;
        if (len === 13) {
            return str.slice(0,4) + '****' + str.slice(8,13)
        } else if (len === 12) {
            return str.slice(0,4) + '***' + str.slice(7, 12)
        }
    }

    // 닉네임 클릭 시 모달 열기
    const handleNicknameClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    // 모달 변경 사항 저장
    const handleSaveChanges = async () => {
        if (!selectedUser) {
            alert("선택된 사용자가 없습니다.");
            return;
        }

        const userIdx = selectedUser.userIdx;
        const userLevel = selectedUser.userLevel;

        try {
            const response = await axios.put(
                `${CAMP_API_BASE_URL}/admin/getAdminUpdateUser`,
                { userIdx, userLevel },
            );

            if (response.data.success) {
                alert("회원 정보 업데이트 성공");
                await getAdminUserList();
                handleCloseModal();
            } else {
                alert("회원 정보 업데이트 실패");
            }
        } catch (err) {
            console.error("회원 정보 업데이트 중 오류: ", err.message);
            alert("회원 정보 업데이트 오류");
        }
    };

    // 로딩 중 화면
    if (loading) {
        return <div style={{ textAlign: "center", padding: "20px" }}>로딩 중...</div>;
    }

    // 에러 발생 시 화면
    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>에러: {error}</div>
        );
    }

    return (
        <Box position="relative" display="flex">
            {/* 좌측 네비게이션 메뉴 */}
            <AdminList />

            {/* 우측 컨텐츠 */}
            <Box flex={1} p={3}>
                {/* 상단 현재 시간 */}
                <CurrentTime />

                {/* 검색 영역 */}
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
                            labelId="admin-userList-select-label"
                            id="admin-userList-select"
                            value={selectedSearch}
                            onChange={handleSelectChange}
                            sx={{
                                height: '48px',
                                alignItems: 'center',
                            }}
                        >
                            <MenuItem value="all">전체</MenuItem>
                            <MenuItem value="general">일반</MenuItem>
                            <MenuItem value="bad">악성</MenuItem>
                            <MenuItem value="rest">휴면/탈퇴</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 검색어 입력 */}
                    <Box
                        display="flex"
                        alignItems="center"
                        flex={1}
                        sx={{
                            height: '100%',
                        }}
                    >
                        <TextField
                            id="keyword-search"
                            label="검색어 입력"
                            variant="standard"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onClick={handleInputClick}
                            onKeyUp={handleKeyUp}
                            inputRef={inputRef}
                            InputProps={{
                                style: {
                                    height: '32px',
                                    padding: '0 10px',
                                },
                            }}
                        />

                        {/* 돋보기 아이콘 */}
                        <IconButton
                            onClick={handleSearch}
                            sx={{
                                height: '48px',
                                width: '48px',
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Box>
                </Box>

                {/* 테이블 */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead className="admin-userList-table-head">
                            <TableRow>
                                <TableCell>이름</TableCell>
                                <TableCell>아이디</TableCell>
                                <TableCell>Naver</TableCell>
                                <TableCell>Kakao</TableCell>
                                <TableCell>닉네임</TableCell>
                                <TableCell>회원등급</TableCell>
                                <TableCell>회원우호점수</TableCell>
                                <TableCell>가입일</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="admin-userList-table-body">
                            {adminUserList.map((list) => (
                                <TableRow
                                    key={list.userIdx}
                                    sx={{
                                        backgroundColor:
                                            list.userLevel === '2' ? '#B9B9B9' :
                                                list.userLevel === '3' ? '#fddde5' :
                                                    'inherit',
                                    }}
                                >
                                    <TableCell>{maskUserName(list.userName)}</TableCell>
                                    <TableCell>{maskUserId(list.userId)}</TableCell>
                                    <TableCell>{maskUserId(list.n_userId)}</TableCell>
                                    <TableCell>{maskUserId(list.k_userId)}</TableCell>
                                    <TableCell
                                        onClick={() => handleNicknameClick(list)}
                                        sx={{
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            color: '#1976D2',
                                        }}
                                    >
                                        {list.userNickname}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: list.userLevel === '3' ? 'red' : 'inherit',
                                            fontWeight: list.userLevel === '3' ? 'bold' : 'normal',
                                        }}
                                    >
                                        {list.userLevel === '1' && '일반'}
                                        {list.userLevel === '2' && '휴면/탈퇴'}
                                        {list.userLevel === '3' && '악성'}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: list.userLevel === '3' ? 'red' : 'inherit',
                                            fontWeight: list.userLevel === '3' ? 'bold' : 'normal',
                                        }}
                                    >
                                        {list.dealSatisSellerScore}
                                    </TableCell>
                                    <TableCell>{list.userReg.substring(0, 10)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="camplog-pagination">
                        <Pagination
                            count={totalPages}
                            page={page}
                            defaultPage={1}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '16px',
                            }}
                            onChange={(event, value) => {
                                setPage(value);
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }}
                        />
                    </div>
                </TableContainer>

                {/* 모달 창 */}
                <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="user-details-modal-title"
                    aria-describedby="user-details-modal-description"
                >
                    <Box sx={modalStyle}>
                        {selectedUser ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>회원번호</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={selectedUser.userIdx || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>아이디</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={maskUserId(selectedUser.userId) || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>Naver ID</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={maskUserId(selectedUser.n_userId) || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>Kakao ID</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={maskUserId(selectedUser.k_userId) || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>이름</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={maskUserName(selectedUser.userName) || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>닉네임</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={selectedUser.userNickname || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>email</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={selectedUser.userMail || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>전화번호</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={maskUserPhone(selectedUser.userPhone) || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>회원등급</strong></TableCell>
                                            <TableCell>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={selectedUser?.userLevel || ""} // 기본값 설정
                                                        onChange={(e) => {
                                                            const updatedUser = { ...selectedUser, userLevel: e.target.value };
                                                            setSelectedUser(updatedUser);
                                                        }}
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="1">일반</MenuItem>
                                                        <MenuItem value="2">휴면/탈퇴</MenuItem>
                                                        <MenuItem value="3">악성</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>주소</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={selectedUser.userAddr || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>회원 등록일</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={selectedUser.userReg.substring(0, 10) || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>회원정보수정 날짜</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={selectedUser.userUdpReg || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>회원 접속 날짜</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={selectedUser.userConnReg || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"><strong>유저 신고 횟수</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={selectedUser.userReported || ""}
                                                    variant="standard"
                                                    fullWidth
                                                    disabled
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography id="user-details-modal-description" sx={{ mt: 2 }}>
                                사용자 정보를 불러오는 중입니다...
                            </Typography>
                        )}
                        <Box
                            mt={2}
                            display="flex"
                            justifyContent="center"  // 가로 방향 중앙 정렬
                            alignItems="center"      // 세로 방향 중앙 정렬
                        >
                            {/* 저장 버튼 추가 */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                sx={{ mr: 2 }}
                            >
                                저장
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleCloseModal}
                            >
                                닫기
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}

export default Page;
