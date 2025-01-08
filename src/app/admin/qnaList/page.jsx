"use client"
import { useEffect, useRef, useState } from 'react';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import './qnaList.css';
import { useRouter } from 'next/navigation';

function Page(props) {
    const [filterStatus, setFilterStatus] = useState("all"); // 검색어 옵션 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [qnaList, setQnaList] = useState([]); // QnA 리스트 데이터
    const [filteredQnaList, setFilteredQnaList] = useState([]); // 필터링된 QnA 리스트 데이터
    const [totalPages, setTotalPages] = useState(0); // 검색 결과 총 페이지 수
    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    const router = useRouter();

    const inputRef = useRef(null); // 검색어 입력창 ref

    // 키워드 검색
    const handleKeyUp = (e) => {
        if (e.key === 'Enter' && !isComposing) {
            handleSearch();
        }
    };

    const handleSearch = () => {
        setPage(1); // 검색 시 페이지를 1로 초기화
        filterAndPaginate(); // 필터링과 페이징 처리
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleRowClick = (row) => {
        console.log("클릭한 행의 데이터:", row);
        router.push(
            `/admin/qnaList/detail?${row.qnaIdx}`, // 실제 경로와 쿼리
            '/admin/qnaList/detail' // 표시될 경로
        );
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${CAMP_API_BASE_URL}/admin/qnaList`);
            const data = response.data;
            if (data.success) {
                setQnaList(data.data);
                console.log('Fetched QnA List:', response);
                filterAndPaginate(data.data); // 초기 필터링 처리
            }
        } catch (error) {
            console.error('Error fetching QnA list:', error);
        }
    };

    const filterAndPaginate = (list = qnaList) => {
        // 필터링 조건 적용
        setPage(1);
        const filtered = list.filter((item) => {
            const matchesStatus = filterStatus === "all" || item.qnaStatus === filterStatus;
            const matchesKeyword = !keyword || item.qnaSubject.includes(keyword) || item.userNickname.includes(keyword);
            return matchesStatus && matchesKeyword;
        });

        // 페이징 처리
        const startIdx = (page - 1) * size;
        const paginated = filtered.slice(startIdx, startIdx + size);

        setFilteredQnaList(paginated);
        setTotalPages(Math.ceil(filtered.length / size)); // 총 페이지 수 설정
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterAndPaginate();
    }, [qnaList, page, size, filterStatus, keyword]);

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
                        <InputLabel id="filter-status-label"></InputLabel>
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
                            <MenuItem value="진행중">진행중</MenuItem>
                            <MenuItem value="답변 중">답변 중</MenuItem>
                            <MenuItem value="답변완료">답변완료</MenuItem>
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
                            variant="standard"
                            placeholder="검색어 입력"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyUp={handleKeyUp}
                            inputRef={inputRef}
                            InputProps={{
                                style: {
                                    height: '48px',
                                    padding: '0 10px',
                                },
                            }}
                        />

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
                        <TableHead className="admin-qnalist-table-head">
                            <TableRow>
                                <TableCell>등록번호</TableCell>
                                <TableCell>닉네임</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>답변상태</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="admin-qnalist-table-body">
                            {filteredQnaList.map((row) => (
                                <TableRow
                                    key={row.qnaIdx}
                                    sx={{
                                        backgroundColor: row.qnaStatus === '답변완료' ? '#D9EAFD' : 'inherit',
                                    }}
                                    onClick={() => handleRowClick(row)}
                                    style={{ cursor: 'pointer' }}
                                    hover
                                >
                                    <TableCell>{row.qnaIdx}</TableCell>
                                    <TableCell>{row.userNickname}</TableCell>
                                    <TableCell>{row.qnaSubject}</TableCell>
                                    <TableCell>{row.qnaReRegDate}</TableCell>
                                    <TableCell>{row.qnaStatus}</TableCell>
                                </TableRow>
                            ))}
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
        </Box>
    );
}

export default Page;
