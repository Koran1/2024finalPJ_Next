"use client"
import { useRef, useState } from 'react';
import "./campList.css";
import { Search } from "@mui/icons-material";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Button } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';

function Page() {
    const [filterStatus, setFilterStatus] = useState("전체"); // 검색어 옵션 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [searchQuery, setSearchQuery] = useState("");
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련

    const inputRef = useRef(null);

    const rows = [
        { idx: 1, contentId: 100002, name: '야영장1', status: '운영', dateAdded: '2021-12-12', dateModified: '2023-12-11' },
        { idx: 2, contentId: 100003, name: '야영장2', status: '휴장', dateAdded: '2021-12-11', dateModified: '2024-12-21' },
        { idx: 3, contentId: 100004, name: '야영장3', status: '운영', dateAdded: '2021-12-11', dateModified: '2024-12-21' },
        { idx: 4, contentId: 100005, name: '야영장4', status: '휴장', dateAdded: '2021-12-11', dateModified: '2024-12-21' },
        { idx: 5, contentId: 100006, name: '야영장5', status: '운영', dateAdded: '2021-12-11', dateModified: '2024-12-21' },
    ];

    // 필터링된 데이터
    const filteredRows = rows.filter((row) => {
        return (
            (filterStatus === '전체' || row.status === filterStatus) &&
            row.name.includes(searchQuery) 
        );
    });

    // 검색 핸들러
    const handleSearch = () => {
        setSearchQuery(keyword); 
        inputRef.current.blur(); 
    };

    // 검색 엔터 함수
    const handleKeyUp = (e) => {
        if (!isComposing && e.key === "Enter") {
            setSearchQuery("");
            handleSearch();
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
                                setSearchQuery(""); 
                                setKeyword(""); 
                            }}
                            sx={{
                                height: '48px',
                                alignItems: 'center',
                            }}
                        >
                            <MenuItem value="전체">전체</MenuItem>
                            <MenuItem value="운영">운영</MenuItem>
                            <MenuItem value="휴장">휴장</MenuItem>
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
                            onFocus={() => setKeyword("")} 
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
                            onClick={() => {
                                alert("신규 등록 페이지로 이동합니다.");
                            }}
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
                            {filteredRows.map((row) => (
                                <TableRow
                                    key={row.idx}
                                    sx={{
                                        backgroundColor: row.status === '휴장' ? '#D9EAFD' : 'inherit', // 휴장인 경우 배경색 설정
                                    }}
                                >
                                    <TableCell>{row.idx}</TableCell>
                                    <TableCell>{row.contentId}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.dateAdded}</TableCell>
                                    <TableCell>{row.dateModified}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Page;
