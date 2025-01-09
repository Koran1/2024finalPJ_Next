"use client"
import "./faqList.css";
import { useEffect, useRef, useState } from 'react';
import { Search } from "@mui/icons-material";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Button, Pagination, Checkbox, Modal, Typography, TextareaAutosize } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import Link from "next/link";

// 모달 스타일 정의
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
    borderRadius: '8px',
};

function Page() {
    const [selectedFAQs, setSelectedFAQs] = useState([]);
    const [adminFAQList, setAdminFAQList] = useState([]); // 관리자 사용자 정보 리스트
    const [selectedSearch, setSelectedSearch] = useState("all"); // 검색어 옵션 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [totalCount, setTotalCount] = useState(0); // 검색 결과 개수
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련
    const [page, setPage] = useState(1); // 페이징-1페이지
    const [size, setSize] = useState(10); // 페이징-한 페이지 당 데이터 개수
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const [selectedFaq, setSelectedFaq] = useState(null); // 선택된 공지사항
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태

    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const inputRef = useRef(null);

    // Admin FAQList 리스트 가져오기
    const getAdminFAQList = async () => {
        setLoading(true);
        const searchKeyword = keyword?.trim() || null;
        try {
            const response = await axios.get(`${CAMP_API_BASE_URL}/admin/faqList`, {
                params: {
                    keyword: searchKeyword,
                    option: selectedSearch,
                    page,
                    size,
                },
            });
            if (response.data.success) {
                setAdminFAQList(response.data.data.data);
                setTotalPages(response.data.data.totalPages);
                setTotalCount(response.data.data.totalCount);
                console.log("관리자 FAQ 리스트: ", response.data.data.data);
            }
        } catch (err) {
            setError("Error fetching data: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    // 데이터 로드
    useEffect(() => {
        getAdminFAQList();
    }, [page, size, selectedSearch]);

    // 검색 함수
    const handleSearch = () => {
        setPage(1);
        getAdminFAQList();
    };

    // 검색 엔터 함수
    const handleKeyUp = (e) => {
        if (!isComposing && e.key === "Enter") {
            setPage(1);
            getAdminFAQList();
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

    // 게시글 보이기 토글 함수
    const handleToggleStatus = async () => {
        console.log("selectedFAQs: ", selectedFAQs);
        if (selectedFAQs.length === 0) {
            alert("선택된 게시글이 없습니다.");
            return;
        }

        try {
            const form = new FormData();
            form.append("selectedFAQs", selectedFAQs)
            console.log(selectedFAQs)
            const response = await axios.put(
                `${CAMP_API_BASE_URL}/admin/updateFAQStatus`, form
            );

            if (response.data.success) {
                alert(response.data.message);
                setSelectedFAQs([]); // 선택 상태 초기화
                getAdminFAQList(); // 상태 변경 후 목록 갱신
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            console.error("Error updating notice status:", err);
            alert("FAQ 상태 업데이트 오류");
        }
    };


    // 공지사항명 클릭 시 모달 열기
    const handleModalClick = (faq) => {
        setSelectedFaq(faq);
        setIsModalOpen(true);
    }

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFaq(null);
    }

    // 모달 변경 사항 저장
    const handleSaveChanges = async () => {
        if (!selectedFaq) {
            alert("선택된 자주 묻는 질문이 없습니다.");
            return;
        }

        const faqIdx = selectedFaq.faqIdx;
        const faqStatus = selectedFaq.faqStatus;

        try {
            const response = await axios.put(`${CAMP_API_BASE_URL}/admin/getAdminUpdateFAQModal`, { faqIdx, faqStatus },);
            if (response.data.success) {
                alert("자주 묻는 질문 정보 업데이트 성공");
                await getAdminFAQList();
                handleCloseModal();
            } else {
                alert("자주 묻는 질문 정보 업데이트 실패");
            }
        } catch (err) {
            console.log("자주 묻는 질문 정보 업데이트 중 오류: ", err.message);
            alert("자주 묻는 질문 정보 업데이트 오류");
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
                    justifyContent="space-between"
                    mt={5}
                    mb={2}
                    sx={{
                        height: '48px',
                    }}
                >
                    {/* 게시글 OFF 버튼 */}
                    <Button
                        variant="contained"
                        size="medium"
                        sx={{
                            height: '80%',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#1976D2',
                            },
                        }}
                        onClick={handleToggleStatus}
                    >
                        게시글 OFF
                    </Button>

                    {/* 검색 영역 */}
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                            gap: '16px',
                            height: '100%',
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
                                labelId="admin-faqList-select-label"
                                id="admin-faqList-select"
                                value={selectedSearch}
                                onChange={handleSelectChange}
                                sx={{
                                    height: '48px',
                                    alignItems: 'center',
                                }}
                            >
                                <MenuItem value="all">전체</MenuItem>
                                <MenuItem value="on">ON</MenuItem>
                                <MenuItem value="off">OFF</MenuItem>
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
                                // 옵션 박스랑 위치 맞게 하려면 InputProps가 deprecated이지만 이걸 사용해야 둘의 위치를 맞출 수 있음
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
                </Box>

                {/* 테이블 */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead className="admin-faqList-table-head">
                            <TableRow>
                                {/* 체크박스 헤더 */}
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selectedFAQs.length > 0 &&
                                            selectedFAQs.length < adminFAQList.length
                                        }
                                        checked={selectedFAQs.length === adminFAQList.length}
                                        onChange={(event) => {
                                            const isChecked = event.target.checked;
                                            setSelectedFAQs(
                                                isChecked
                                                    ? adminFAQList.map((item) => item.faqIdx)
                                                    : []
                                            );
                                        }}
                                    />
                                </TableCell>
                                <TableCell>등록번호</TableCell>
                                <TableCell>FAQ Question</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>게시글 보이기</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="admin-faqList-table-body">
                            {adminFAQList.map((list, index) => (
                                <TableRow
                                    key={list.faqIdx}
                                    sx={{
                                        backgroundColor:
                                            list.faqStatus === 'off' ? '#B9B9B9' : 'inherit',
                                    }}
                                >
                                    {/* 체크박스 열 */}
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedFAQs.includes(list.faqIdx)}
                                            onChange={(event) => {
                                                const isChecked = event.target.checked;
                                                setSelectedFAQs((prev) =>
                                                    isChecked
                                                        ? [...prev, list.faqIdx]
                                                        : prev.filter((id) => id !== list.faqIdx)
                                                );
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{list.faqIdx}</TableCell>
                                    <TableCell
                                        onClick={() => handleModalClick(list)}
                                        sx={{
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            color: "#1976D2"
                                        }}
                                    >
                                        {list.faqQuestion}
                                    </TableCell>
                                    <TableCell>{list.faqReg.substring(0, 10)}</TableCell>
                                    <TableCell>{list.faqStatus}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* 페이징과 작성하기 버튼 영역 */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            padding: '16px',
                        }}
                    >
                        {/* 가운데 정렬된 Pagination */}
                        <Box
                            flex={1}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Pagination
                                count={totalPages}
                                page={page}
                                defaultPage={1}
                                onChange={(event, value) => {
                                    setPage(value);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                            />
                        </Box>
                        {/* 작성하기 버튼 */}
                        <Box
                            sx={{
                                flexShrink: 0,
                                marginLeft: 'auto',
                            }}
                        >
                            <Link href="/admin/faqList/write">
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        height: '80%',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        '&:hover': {
                                            backgroundColor: '#9DBDFF',
                                        },
                                    }}
                                >
                                    작성하기
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                </TableContainer>
                {/* 모달창 */}
                <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="notice-details-modal-title"
                    aria-describedby="notice-details-modal-description"
                >
                    <Box sx={{ ...modalStyle, position: "relative" }}>
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                color: "black",
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <Box sx={{ marginTop: 3 }}>
                            {selectedFaq ? (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" scope="row"><strong>자주 묻는 질문 Question</strong></TableCell>
                                                <TableCell>
                                                    <TextareaAutosize
                                                        minRows={6}
                                                        placeholder="FAQ 질문을 입력하세요."
                                                        value={selectedFaq.faqQuestion || ""}
                                                        onChange={(e) => {
                                                            const updatedFAQ = { ...selectedFaq, faqQuestion: e.target.value };
                                                            setSelectedFaq(updatedFAQ);
                                                        }}
                                                        style={{ width: "100%", padding: "8px" }}
                                                        disabled
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row"><strong>자주 묻는 질문 Answer</strong></TableCell>
                                                <TableCell>
                                                    <TextareaAutosize
                                                        minRows={6}
                                                        placeholder="FAQ 답변을 입력하세요."
                                                        value={selectedFaq.faqAnswer || ""}
                                                        onChange={(e) => {
                                                            const updatedFAQ = { ...selectedFaq, faqAnswer: e.target.value };
                                                            setSelectedFaq(updatedFAQ);
                                                        }}
                                                        style={{ width: "100%", padding: "8px" }}
                                                        disabled
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row"><strong>등록 일자</strong></TableCell>
                                                <TableCell>
                                                    <TextField
                                                        value={selectedFaq.faqReg.substring(0, 10) || ""}
                                                        variant="standard"
                                                        fullWidth
                                                        disabled
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row"><strong>게시글 보이기</strong></TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth>
                                                        <Select
                                                            value={selectedFaq?.faqStatus || ""} // 기본값 설정
                                                            onChange={(e) => {
                                                                const updatedFAQ = { ...selectedFaq, faqStatus: e.target.value };
                                                                setSelectedFaq(updatedFAQ);
                                                            }}
                                                            displayEmpty
                                                        >
                                                            <MenuItem value="on">ON</MenuItem>
                                                            <MenuItem value="off">OFF</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography id="faq-details-modal-description" sx={{ mt: 2 }}>
                                    FAQ 정보를 불러오는 중입니다...
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
                                <Link href={`/admin/faqList/update/${selectedFaq?.faqIdx}`}>
                                    <Button
                                        variant="outlined"
                                    >
                                        수정
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}

export default Page;