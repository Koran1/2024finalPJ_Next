"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, Grid2, IconButton, InputLabel, MenuItem, Modal, Pagination, Paper, Radio, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';
import { useRouter } from 'next/navigation';
import { Close, Search, ThumbUpAlt } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

function Page(props) {
    const [filterStatus, setFilterStatus] = useState("log"); // 필터 옵션 박스
    const [selectedRows, setSelectedRows] = useState([]); // 체크 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련
    const [page, setPage] = useState(1); // 현재 페이지
    const size = 10;                     // 1페이지당 행 개수
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userNickname, setUserNickname] = useState([]); // 유저 idx를 유저 닉네임으로 변환
    const [rowList, setRowList] = useState([]); // 필터에 따라 로그 or 로그 댓/답글 정보
    const [isLogModalOpen, setLogModalOpen] = useState(false);// 로그 글 모달 창 열기
    const [selectedLog, setSelectedLog] = useState({}); // 선택한 로그 글
    const inputRef = useRef(null);
    // const [logWriterImg, setlogWriterImg] = useState([]);           // 로그 작성자 프로필 사진
    const [data, setData] = useState([]); // 모달에 띄워줄 정보
    const [tagData, setTagData] = useState([{ tagId: "" }]); // 태그 정보
    const [RecommendCount, setRecommendCount] = useState(0);
    const [modalLoading, setModalLoading] = useState(false);

    // const [logCommentList, setRowList] = useState([]); // 로그 댓/답글 정보
    const [isLogCommentModalOpen, setIsLogCommentModalOpen] = useState(false);// 로그 댓글 모달 창 열기
    const [selectedLogComment, setSelectedLogComment] = useState({}); // 선택한 로그 댓글

    const imgUrl = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    const router = useRouter(); // useRouter 훅 사용

    useEffect(() => {
        // setSelectedLog("");
        fetchData(); // Call the async function
    }, [page, size, filterStatus]);

    // Fetch log list
    const fetchData = async () => {
        // 로그 글 불러오기
        const searchKeyword = keyword?.trim() || null;
        if (filterStatus == "log") {
            setLoading(true);
            const searchData = {
                keyword: searchKeyword,
                page: page,
                size: size,
                sortOption: filterStatus
            };
            try {
                const response = await axios.post(`${LOCAL_API_BASE_URL}/admin/getLogList`, searchData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = response.data;
                if (data.success) {
                    console.log("logList : ", data);
                    setRowList(data.data.logList.data);
                    setUserNickname(data.data.userNicknameMap);
                    // setlogWriterImg(data.data.userImgMap);
                    // setTotalCount(data.data.totalCount);
                    setTotalPages(data.data.logList.totalPages);

                    console.log('Fetched log list:', response);
                } else {
                }
            } catch (error) {
                console.error('Error fetching log list:', error);
            } finally {
                setLoading(false);
            }
        }

        // 댓글 불러오기
        if (filterStatus == "logComment") {
            setLoading(true);
            const searchData = {
                keyword: searchKeyword,
                page: page,
                size: size,
                sortOption: filterStatus
            };
            try {
                const response = await axios.post(`${LOCAL_API_BASE_URL}/admin/getLogCommentList`, searchData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = response.data;
                if (data.success) {
                    console.log("logCommentList : ", data.data.logCommentList.data);
                    setRowList(data.data.logCommentList.data);
                    console.log("userNicknameMap : ", data.data.userNicknameMap);
                    setUserNickname(data.data.userNicknameMap);
                    // setTotalCount(data.data.totalCount);
                    setTotalPages(data.data.logCommentList.totalPages);

                    console.log('Fetched logComment list:', response);
                } else {
                }
            } catch (error) {
                console.error('Error fetching logComment list:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // 검색어 필드 클릭 시 초기화
    const handleInputClick = () => {
        setKeyword("");
    };

    // 검색 함수
    const handleSearch = () => {
        setPage(1);
        fetchData();
    };

    // 검색 엔터 함수
    const handleKeyUp = (e) => {
        if (!isComposing && e.key === "Enter") {
            setPage(1);
            fetchData();
        }
    };

    // 비활성화 버튼 함수
    const handleToggleStatus = async (location) => {
        // 모달 상세 안에서 비활성화 버튼 클릭
        if (location == "modal") {
            if(filterStatus == "log"){
                console.log("selectedLog: ", selectedLog);
                if (selectedLog.length === 0) {
                    alert("선택된 글이 없습니다.");
                    return;
                }
            }

            if(filterStatus == "logComment"){
                console.log("selectedLogComment: ", selectedLogComment);
                if (selectedLog.length === 0) {
                    alert("선택된 댓/답글이 없습니다.");
                    return;
                }
            }

            try {
                const form = new FormData();

                // 비활성화 버튼 클릭 했을 때 선택된 필터가 "log"일 때
                if (filterStatus == "log") { form.append("logIdx", selectedLog.logIdx) }
                // 비활성화 버튼 클릭 했을 때 선택된 필터가 "logComment"일 때
                if (filterStatus == "logComment") { form.append("logCommentIdx", selectedLogComment.logCommentIdx) }

                const response = await axios.put(
                    `${LOCAL_API_BASE_URL}/admin/inActiveLog`, form
                );

                if (response.data.success) {
                    alert(response.data.message);
                    // logIsActive 값을 변경
                    if(filterStatus == "log"){
                        setSelectedLog(prevState => ({
                            ...prevState,
                            logIsActive: '0'
                        }));
                    }
                    // logCommentIsActive 값을 변경
                    setSelectedLogComment(prevState => ({
                        ...prevState,
                        logCommentIsActive: '0'
                    }));
                    fetchData(); // 상태 변경 후 목록 갱신
                } else {
                    alert(response.data.message);
                }
            } catch (err) {
                console.error("Error updating notice status:", err);
                alert("글 비활성화 오류");
            }
        }
        // 체크박스 위 비활성화 버튼 클릭
        if (location == "checkbox") {
            console.log("selectedRows: ", selectedRows);
            if (selectedRows.length === 0) {
                alert("선택된 글이 없습니다.");
                return;
            }

            try {
                const form = new FormData();

                // 비활성화 버튼 클릭 했을 때 선택된 필터가 "log"일 때
                if (filterStatus == "log") { form.append("logIdx", selectedRows) }
                // 비활성화 버튼 클릭 했을 때 선택된 필터가 "logComment"일 때
                if (filterStatus == "logComment") { form.append("logCommentIdx", selectedRows) }

                const response = await axios.put(
                    `${LOCAL_API_BASE_URL}/admin/inActiveLog`, form
                );

                if (response.data.success) {
                    alert(response.data.message);
                    setSelectedRows([]); // 선택 상태 초기화
                    fetchData(); // 상태 변경 후 목록 갱신
                } else {
                    alert(response.data.message);
                }
            } catch (err) {
                console.error("Error updating notice status:", err);
                alert("글 비활성화 오류");
            }
        }
    };

    // 페이지 변경 핸들러
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // TableRow 클릭 핸들러(모달 열기)
    const handleRowClick = (row, type) => {
        // 선택한 행의 정보들 저장
        if (type == "log") {
            setSelectedLog(row);
            logDetailData(row);
            setLogModalOpen(true);
        } else {
            setSelectedLogComment(row);
            setIsLogCommentModalOpen(true);
        }
    };

    // 선택한 로그의 정보들 가져오기(로그 내용, 사진, 태그정보)
    const logDetailData = async (row) => {
        setModalLoading(true);
        try {
            const apiUrl = `${LOCAL_API_BASE_URL}/admin/logModalData?logIdx=${row.logIdx}`;
            const response = await axios.get(apiUrl);
            const data = response.data;
            console.log("modalData : ", data);
            if (data.success) {
                setData(data.data);
                setRecommendCount(data.data.RecommendCount);
                setTagData(data.data.pData.map(item => {
                    if (!item.tagData || item.tagData.length === 0) {
                        return [];
                    } else {

                        return item.tagData.map(tag => {
                            return {
                                ...tag,
                                isShow: false,
                                isLinkShow: false,
                                nodeRef: React.createRef(),
                            }
                        })
                    }
                }));
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
        } finally{
            setModalLoading(false);
        }
    }

    const showTagContent = (tagId, order) => {
        setTagData(tagData.map((data, index) => {
            if (index === order) {
                return data.map(tag => ({
                    ...tag,
                    tagX: parseFloat(tag.tagX),
                    tagY: parseFloat(tag.tagY),
                    isShow: tag.tagId === tagId ? !tag.isShow : false,
                    isLinkShow: tag.tagId === tagId ? true : false
                }))
            }
            return data
        }));
    }
    const showLink = (tagId, order) => {
        setTagData(tagData.map((data, index) => {
            if (index === order) {
                return data.map(tag => ({
                    ...tag,
                    isLinkShow: tag.tagId === tagId ? !tag.isLinkShow : false,
                }))
            }
            return data
        }));
    }

    const handleCurrencyToWon = (price) => {
        return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(price);
    }
    const handleGoDeal = (dealIdx) => {
        router.push(`/deal/detail/${dealIdx}`);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
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
                        justifyContent="space-between"
                        mt={5}
                        mb={2}
                        sx={{
                            gap: '16px',
                            height: '48px',
                        }}
                    >
                        {/* 로그 글, 댓/답글 비활성화 버튼 */}
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
                            onClick={() => handleToggleStatus("checkbox")}
                        >
                            비활성화
                        </Button>
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
                                    setRowList([]);  // 행 초기화
                                    setSelectedRows([]);  // 선택 해제
                                    setKeyword("");
                                    setPage(1);
                                }}
                                sx={{
                                    height: '48px',
                                    alignItems: 'center',
                                }}
                            >
                                {/* <MenuItem value="all">전체</MenuItem> */}
                                <MenuItem value="log">로그 글</MenuItem>
                                <MenuItem value="logComment">로그 댓/답글</MenuItem>
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

                    {/* 테이블 */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead className="admin-loglist-table-head">
                                <TableRow>
                                    {/* 체크박스 헤더 */}
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                selectedRows.length > 0 &&
                                                selectedRows.length < rowList.length
                                            }
                                            checked={selectedRows.length === rowList.length}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setSelectedRows(
                                                    isChecked && rowList
                                                        ? rowList.map((item) => item.logCommentIdx ? item.logCommentIdx : item.logIdx) // 전체 선택
                                                        : [] // 선택 해제
                                                );
                                            }}
                                        />
                                    </TableCell>
                                    {filterStatus == "log" &&
                                        <>
                                            <TableCell align='center'>logIdx</TableCell>
                                            <TableCell align='center'>작성자</TableCell>
                                            <TableCell align='center'>제목</TableCell>
                                            <TableCell align='center'>등록일</TableCell>
                                            <TableCell align='center'>수정일</TableCell>
                                            {/* <TableCell align='center'>조회수</TableCell> */}
                                            <TableCell align='center'>공감수</TableCell>
                                            <TableCell align='center'>활성화 여부</TableCell>
                                        </>
                                    }
                                    {filterStatus == "logComment" &&
                                        <>
                                            <TableCell align='center'>logCommentIdx</TableCell>
                                            <TableCell align='center'>logIdx</TableCell>
                                            <TableCell align='center'>작성자</TableCell>
                                            <TableCell align='center'>내용</TableCell>
                                            <TableCell align='center'>등록일</TableCell>
                                            <TableCell align='center'>활성화 여부</TableCell>
                                            <TableCell align='center'>삭제 여부</TableCell>
                                        </>
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody className="admin-loglist-table-body">
                                {rowList && rowList.map((row) => (
                                    <TableRow
                                        key={filterStatus == 'log' ? row.logIdx : row.logCommentIdx}
                                        sx={{
                                            backgroundColor: filterStatus == 'log'
                                                ? row.logIsActive == '1'
                                                    ? 'inherit'
                                                    : 'lightgray'
                                                : row.logCommentIsActive == '1' && row.logCommentIsDelete == '0'
                                                    ? 'inherit'
                                                    : 'lightgray',
                                            // backgroundColor: row.logIsActive == '1' ? 'inherit' : 'lightgray', // 활성화 상태인 경우 배경색 설정
                                        }}
                                        onClick={() => filterStatus == 'log' ? handleRowClick(row, "log") : handleRowClick(row, "logComment")} // TableRow 클릭 시 핸들러 호출
                                        style={{ cursor: 'pointer' }} // 마우스 포인터를 손 모양으로 변경
                                        hover // 마우스를 올렸을 때 옅은 회색으로 변경
                                    >
                                        {/* 체크박스 열 */}
                                        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={filterStatus == 'log' ? selectedRows.includes(row.logIdx) : selectedRows.includes(row.logCommentIdx)}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setSelectedRows((prev) => {
                                                        if (isChecked) {
                                                            return row.logCommentIdx
                                                                ? [...prev, row.logCommentIdx]
                                                                : [...prev, row.logIdx];
                                                        } else {
                                                            return row.logCommentIdx
                                                                ? prev.filter((id) => id !== row.logCommentIdx)
                                                                : prev.filter((id) => id !== row.logIdx);
                                                        }
                                                    });
                                                }}
                                            />
                                        </TableCell>
                                        {filterStatus == "log" &&
                                            <>
                                                <TableCell align='center'>{row.logIdx}</TableCell>
                                                <TableCell align='center'>{userNickname[row.userIdx]}</TableCell>
                                                <TableCell align='center'>{row.logTitle}</TableCell>
                                                <TableCell align='center'>{row.logRegDate}</TableCell>
                                                <TableCell align='center'>{row.logUpdateDate}</TableCell>
                                                {/* <TableCell align='center'>{row.logView}</TableCell> */}
                                                <TableCell align='center'>{row.logRecommend}</TableCell>
                                                <TableCell align='center'>{row.logIsActive == 1 ? "활성화" : "비활성화"}</TableCell>
                                            </>
                                        }
                                        {filterStatus == "logComment" &&
                                            <>
                                                <TableCell align='center'>{row.logCommentIdx}</TableCell>
                                                <TableCell align='center'>{row.logIdx}</TableCell>
                                                <TableCell align='center'>{userNickname[row.userIdx]}</TableCell>
                                                <TableCell align='center'>{row.logCommentContent}</TableCell>
                                                <TableCell align='center'>{row.logCommentRegDate}</TableCell>
                                                <TableCell align='center'>{row.logCommentIsActive == 1 ? "활성화" : "비활성화"}</TableCell>
                                                <TableCell align='center'>{row.logCommentIsDelete == 1 ? "O" : "X"}</TableCell>
                                            </>
                                        }
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

                {/* 로그 글 모달 */}
                <Modal
                    open={isLogModalOpen}
                    onClose={() => setLogModalOpen(false)}
                    aria-labelledby="logModal"
                    aria-describedby="logModal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '70%',
                            height: '80%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            overflowY: 'auto', // 스크롤 기능 추가
                        }}
                    >
                        {modalLoading ? 
                            <div>Loading...</div> : 
                         <>
                            {/* 로그 글 내용 */}
                            <div>
                                {/* 로그 내용 */}
                                <Grid2 container spacing={0} >
                                    <Grid2 size={3} />
                                    <Grid2 textAlign={'center'} size={6}>
                                        <>
                                            <div style={{ width: '100%', height: "300px", margin: "80px auto", border: "1px solid gray", display: "flex", flexDirection: "column" }}>
                                                <div style={{ height: "70%" }}>
                                                    <p style={{ fontSize: "50px", margin: "40px auto" }}>{selectedLog.logTitle}</p>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0 0 20px" }}>
                                                        {/* 유저 아바타 */}
                                                        {/* <Avatar sx={{ width: "50px", height: "50px" }} src={logWriterImg[selectedLog.userIdx] ? `${imgUrl}/user/${logWriterImg[selectedLog.userIdx]}` : '/default-product-image.jpg'} /> */}
                                                        <Avatar sx={{ width: "50px", height: "50px" }} src={data.userVO && data.userVO[0].userEtc01 ? `${imgUrl}/user/${data.userVO[0].userEtc01}` : '/default-product-image.jpg'} />
                                                        <span style={{ fontWeight: "bold" }}>{userNickname[selectedLog.userIdx]}</span>
                                                        <span style={{ color: "gray" }}>{selectedLog.logRegDate}</span>
                                                    </div>
                                                    <Button
                                                        variant='contained'
                                                        color='error'
                                                        style={{ margin: "20px 20px 0 0" }}
                                                        disabled={selectedLog.logIsActive == '1' ? false : true}
                                                        onClick={() => handleToggleStatus("modal")}
                                                    >비활성화</Button>
                                                </div>
                                            </div>
                                            {/* 내용(댓글, 사진, 태그정보) */}
                                            {data && data.pData && data.pData.map(field => {
                                                return (
                                                    <div key={field.order} style={{ margin: "50px auto", textAlign: "center" }}>
                                                        <div style={{ display: "inline-block", maxWidth: "100%", margin: "50px auto", position: "relative" }}>
                                                            <img
                                                                alt=''
                                                                src={`${imgUrl}/${field.fileName}`}
                                                                style={{ width: "100%", maxWidth: "100%" }} // 크기 제한
                                                            />
                                                            {(tagData && field.order > 0) && (
                                                                <>
                                                                    {Array.from(tagData)[field.order].map(tag => {
                                                                        return (
                                                                            <div key={tag.tagId}>
                                                                                <div onClick={() => showTagContent(tag.tagId, field.order)}>
                                                                                    <AddCircleIcon
                                                                                        style={{
                                                                                            top: `${tag.tagY}px`,
                                                                                            left: `${tag.tagX}px`,
                                                                                            position: "absolute",
                                                                                            transform: "translate(-50%, -50%)",
                                                                                            zIndex: "1"
                                                                                        }}
                                                                                        color="primary"
                                                                                        fontSize="large"
                                                                                    />
                                                                                    <div
                                                                                        style={{
                                                                                            top: `${tag.tagY}px`,
                                                                                            left: `${tag.tagX}px`,
                                                                                            position: "absolute",
                                                                                            transform: "translate(-50%, -50%)",
                                                                                            width: "14px",
                                                                                            height: "14px",
                                                                                            backgroundColor: "white"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                {tag.isShow && (
                                                                                    <CSSTransition in={tag.isShow} timeout={500} classNames="fade" nodeRef={tag.nodeRef} unmountOnExit>
                                                                                        <div ref={tag.nodeRef}>
                                                                                            <div
                                                                                                style={{
                                                                                                    top: `${tag.tagY - 57}px`,
                                                                                                    left: `${tag.tagX}px`,
                                                                                                    position: "absolute",
                                                                                                    transform: "translate(-50%, -50%)",
                                                                                                    width: "300px",
                                                                                                    height: "50px",
                                                                                                    backgroundColor: "white",
                                                                                                    zIndex: "2",
                                                                                                    display: "flex",
                                                                                                    justifyContent: "flex-start",
                                                                                                    alignItems: "center",
                                                                                                    border: "1px solid lightgray",
                                                                                                    justifyContent: "space-between",

                                                                                                }}
                                                                                            >
                                                                                                <p style={{ margin: "10px" }}>{tag.tagContent}</p>
                                                                                                <p
                                                                                                    style={{
                                                                                                        zIndex: "1",
                                                                                                        fontSize: "70px",
                                                                                                        cursor: "pointer",
                                                                                                        textAlign: 'right',
                                                                                                        marginRight: "7px",
                                                                                                        userSelect: "none"

                                                                                                    }}
                                                                                                    onClick={() => showLink(tag.tagId, field.order)}
                                                                                                >&rsaquo;</p>
                                                                                            </div>
                                                                                            <svg
                                                                                                style={{
                                                                                                    top: `${tag.tagY - 26}px`,
                                                                                                    left: `${tag.tagX}px`,
                                                                                                    position: "absolute",
                                                                                                    transform: "translate(-50%, -50%)",
                                                                                                    zIndex: "2",
                                                                                                    overflow: "visible"
                                                                                                }}
                                                                                                width="30"
                                                                                                height="30"
                                                                                                viewBox=" 0 0 100 100"
                                                                                            >
                                                                                                <polygon points="50,90 90,30 10,30" fill="white" />
                                                                                            </svg>
                                                                                            {tag.isLinkShow && (
                                                                                                <Paper
                                                                                                    style={{
                                                                                                        top: `${tag.tagY + 7}px`,
                                                                                                        left: `${tag.tagX + 300}px`,
                                                                                                        position: "absolute",
                                                                                                        transform: "translate(-50%, -50%)",
                                                                                                        zIndex: "2",
                                                                                                        width: "300px",
                                                                                                        height: "180px",
                                                                                                        backgroundColor: "white",

                                                                                                    }}
                                                                                                    elevation={3}
                                                                                                >
                                                                                                    <span style={{ display: "inline-block", float: "left", fontWeight: "bold", fontSize: "18px", margin: "5px" }}>링크된 상품</span>
                                                                                                    <br />
                                                                                                    <br />
                                                                                                    {tag.dealIdx ?
                                                                                                        (
                                                                                                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                                                                                <img src={`${imgUrl}/deal/${data.fNameByDealIdx.find(data => data.dealIdx == tag.dealIdx).fileName}`}
                                                                                                                    alt=''
                                                                                                                    style={{ width: '45%', height: '110px', display: "inline-block", margin: "10px 0 10px 10px", cursor: "pointer" }}
                                                                                                                    onClick={() => handleGoDeal(tag.dealIdx)}>
                                                                                                                </img>
                                                                                                                <div style={{ width: '55%', height: '110px', display: "block", margin: "10px" }}>
                                                                                                                    <p
                                                                                                                        style={{ wordWrap: "break-word", wordBreak: "break-all", fontWeight: 'bold', fontSize: "20px", marginBottom: "20px", cursor: "pointer" }}
                                                                                                                        onClick={() => handleGoDeal(tag.dealIdx)}
                                                                                                                    >
                                                                                                                        {data.dealVO.filter(list => list.dealIdx === tag.dealIdx).map(list => list.dealTitle)[0].substring(0, 20)}
                                                                                                                    </p>
                                                                                                                    <p style={{ wordWrap: "break-word", wordBreak: "break-all", fontWeight: 'bold', fontSize: "17px" }}>
                                                                                                                        {handleCurrencyToWon(data.dealVO.filter(list => list.dealIdx === tag.dealIdx).map(list => list.dealPrice))}원
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )
                                                                                                        :
                                                                                                        (
                                                                                                            <>
                                                                                                                <br />
                                                                                                                <br />
                                                                                                                <p>현재 연동된 상품이 없습니다.</p>
                                                                                                            </>
                                                                                                        )
                                                                                                    }
                                                                                                </Paper>
                                                                                            )}
                                                                                        </div>
                                                                                    </CSSTransition>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </>
                                                            )}
                                                        </div>
                                                        {field.logContent ?
                                                            field.logContent.split('\n').map((line, index) => (
                                                                <span key={index} style={{ display: "block", }}>{line}</span>
                                                            )) : null
                                                        }
                                                    </div>
                                                );
                                            })}
                                            {/* 추천 수 */}
                                            <div style={{ width: "50px", height: "50px", margin: "50px auto", border: "1px solid #1976D2", display: "inline-block" }}>
                                                <ThumbUpAlt color='primary' style={{ fontSize: "40px", marginTop: "5px" }} />
                                                {/* <ThumbUpOffAltIcon color='primary' style={{ fontSize: "40px", marginTop: "5px" }} /> */}
                                            </div>
                                            <span style={{ display: "inline-block", fontSize: "25px", fontWeight: "bold", marginLeft: "30px", verticalAlign: "middle" }}>{RecommendCount}</span>
                                        </>
                                    </Grid2>
                                    <Grid2 size={3} />
                                </Grid2>
                            </div>
                         </>
                        }
                    </Box>
                </Modal>

                {/* 로그 댓글 모달 */}
                <Modal
                    open={isLogCommentModalOpen}
                    onClose={() => setIsLogCommentModalOpen(false)}
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
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            overflowY: 'auto', // 스크롤 기능 추가
                        }}
                    >
                        {/* 댓글 내용 */}
                        <div>
                            <p style={{ marginBottom: "10px" }}><b>댓글 작성자</b> : {userNickname[selectedLogComment.userIdx]}</p>
                            <p style={{ marginBottom: "0" }}><b style={{ marginBottom: "0" }}>댓글 내용</b> : {selectedLogComment.logCommentContent}</p>
                        </div>
                        <div style={{textAlign: "right"}}>
                            <Button
                                variant='contained'
                                color='error'
                                style={{ marginTop: "20px" }}
                                disabled={selectedLogComment.logCommentIsActive == '1' ? false : true}
                                onClick={() => handleToggleStatus("modal")}
                            >비활성화</Button>
                        </div>
                    </Box>
                </Modal>
            </Box>
        </div>
    );
}

export default Page;
