"use client"
import { useEffect, useRef, useState } from 'react';
import "./campList.css";
import { Search } from "@mui/icons-material";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Button, Pagination } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function Page() {
    const [filterStatus, setFilterStatus] = useState("all"); // 검색어 옵션 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0); // 검색 결과 개수
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [campList, setCampList] = useState([]);

    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    const inputRef = useRef(null);
    const router = useRouter(); // useRouter 훅 사용
    useEffect(() => {
        fetchData(); // Call the async function
    }, [page, size, filterStatus]);
    // Fetch camp list
    const fetchData = async () => {
        const searchData = {
            page: page,
            size: size,
            keyword: keyword?.trim() || null, // keyword가 존재하면 trim(), 없으면 null
            sortOption: filterStatus
        };
        setLoading(true);
        try {
            const response = await axios.post(`${CAMP_API_BASE_URL}/admin/campList`, searchData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = response.data;
            if (data.success) {
                setCampList(data.data.data);
                setTotalCount(data.data.totalCount);
                setTotalPages(data.data.totalPages);

                console.log('Fetched camp list:', response);
            } else {
            }
        } catch (error) {
            console.error('Error fetching camp list:', error);
        } finally {
            setLoading(false);
        }
    };



    // 검색 핸들러
    const handleSearch = () => {
        setPage(1);
        fetchData();
        inputRef.current.blur();
    };

    // 검색 엔터 함수
    const handleKeyUp = (e) => {
        if (!isComposing && e.key === "Enter") {
            // setKeyword("");
            handleSearch();
        }
    };

    // 페이지 변경 핸들러
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    // 신규등록 버튼 클릭 핸들러
    const handleNewRegistration = () => {
        alert("신규 등록 페이지로 이동합니다.");
        router.push('/admin/campList/detail');
    };

    // TableRow 클릭 핸들러
    const handleRowClick = (row) => {
        // 객체를 JSON 문자열로 직렬화하고 URL에 안전하게 인코딩
        const queryString = new URLSearchParams({
            data: encodeURIComponent(JSON.stringify(row)), // JSON.stringify로 직렬화 후 encodeURIComponent
        }).toString();

        // 쿼리 파라미터를 사용해 URL을 생성하고, as로 깔끔한 URL 유지
        router.push(
            `/admin/campList/detail?${row.campIdx}`, // 실제 경로와 쿼리
            '/admin/campList/detail' // 표시될 경로
        );
    };

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
                            <MenuItem value="open">운영</MenuItem>
                            <MenuItem value="closed">휴장</MenuItem>
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
                            // onFocus={() => setKeyword("")}
                            inputRef={inputRef}
                            // 옵션 박스랑 위치 맞게 하려면 InputProps가 deprecated이지만 이걸 사용해야 둘의 위치를 맞출 수 있음
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
                    <Box
                        sx={{
                            marginLeft: 'auto',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={handleNewRegistration}
                        >
                            신규 등록
                        </Button>
                    </Box>
                </Box>

                {/* 테이블 */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead className="admin-camplist-table-head">
                            <TableRow>
                                <TableCell>Idx</TableCell>
                                <TableCell>콘텐츠 ID</TableCell>
                                <TableCell>야영장명</TableCell>
                                <TableCell>운영/관리상태</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>수정일</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="admin-camplist-table-body">
                            {campList.map((row) => (
                                <TableRow
                                    key={row.campIdx}
                                    sx={{
                                        backgroundColor: row.manageSttus === '휴장' ? '#D9EAFD' : 'inherit', // 휴장인 경우 배경색 설정
                                    }}
                                    onClick={() => handleRowClick(row)} // TableRow 클릭 시 핸들러 호출
                                    style={{ cursor: 'pointer' }} // 마우스 포인터를 손 모양으로 변경
                                    hover // 마우스를 올렸을 때 옅은 회색으로 변경
                                >
                                    <TableCell>{row.campIdx}</TableCell>
                                    <TableCell>{row.contentId}</TableCell>
                                    <TableCell>{row.facltNm}</TableCell>
                                    <TableCell>{row.manageSttus}</TableCell>
                                    <TableCell>{row.createdtime}</TableCell>
                                    <TableCell>{row.modifiedtime}</TableCell>
                                </TableRow>
                            ))}
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
        </Box>
    );
}

export default Page;
