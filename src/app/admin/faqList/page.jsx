"use client"
import "./faqList.css";
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Search } from "@mui/icons-material";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Button, Pagination, Checkbox } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';
import axios from "axios";

function Page() {
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

    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const inputRef = useRef(null);

    // Admin noticeList 리스트 가져오기
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
                                        indeterminate={adminFAQList.some((list) => list.isChecked) && adminFAQList.some((list) => !list.isChecked)}
                                        checked={adminFAQList.every((list) => list.isChecked)}
                                        onChange={(event) => {
                                            const isChecked = event.target.checked;
                                            setAdminFAQList((prevList) =>
                                                prevList.map((item) => ({ ...item, isChecked }))
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
                        <TableBody className="admin-noticeList-table-body">
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
                                            checked={list.isChecked || false}
                                            onChange={(event) => {
                                                const isChecked = event.target.checked;
                                                setAdminFAQList((prevList) =>
                                                    prevList.map((item, idx) =>
                                                        idx === index
                                                            ? { ...item, isChecked }
                                                            : item
                                                    )
                                                );
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{list.faqIdx}</TableCell>
                                    <TableCell>{list.faqQuestion}</TableCell>
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
                        </Box>
                    </Box>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Page;
