
"use client";
import './camploglist.css';
import { Search } from "@mui/icons-material";
import { InputLabel, FormControl, MenuItem, Select, TextField, IconButton, Link, Button, Pagination, InputAdornment } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useEffect, useState } from "react";
import axios from 'axios';
import useAuthStore from '../../../../store/authStore'; // authStore 가져오기

function Page(props) {
    const { user } = useAuthStore(); // authStore에서 사용자 정보 가져오기
    console.log("로그인된 userIdx:", user?.userIdx);
    const [selectedSearch, setSelectedSearch] = useState("all"); // 검색어 옵션 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [totalCount, setTotalCount] = useState(0); // 검색 결과 개수
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련
    const [sortOption, setSortOption] = useState("latest"); // 리스트 정렬
    const [camplogList, setCamplogList] = useState([]); // camplog 리스트
    const [page, setPage] = useState(1); // 페이징-1페이지
    const [size, setSize] = useState(10); // 페이징-한 페이지 당 데이터 개수
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [showScrollTop, setShowScrollTop] = useState(false); // 페이지 상단으로 가기
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // camplog 리스트 가져오기
    const getCamplogList = async () => {
        setLoading(true);
        const searchKeyword = keyword?.trim() || null;
        try {
            const response = await axios.get(`http://localhost:8080/api/camplog/list`, {
                params: {
                    keyword: searchKeyword,
                    option: selectedSearch,
                    sortOption,
                    page,
                    size,
                    userIdx: user ? user.userIdx : null,
                },
            });
            if (response.data.success) {
                setCamplogList(response.data.data.data);
                setTotalPages(response.data.data.totalPages);
                setTotalCount(response.data.data.totalCount);
                console.log("캠프로그 리스트 데이터: ", response.data.data.data);
            }
        } catch (err) {
            setError("Error fetching data: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 데이터 로드
    useEffect(() => {
        getCamplogList();
    }, [selectedSearch, sortOption, page, size]);

    camplogList.forEach((list) => {
        console.log("logIdx:", list.logIdx);
        console.log("reportStatus:", list.reportStatus, "타입:", typeof list.reportStatus);
        console.log("reporterUserIdx:", list.reporterUserIdx, "타입:", typeof list.reporterUserIdx);
        console.log("loggedInUserIdx:", user?.userIdx, "타입:", typeof user?.userIdx);
    });

    // 정렬 함수
    const handleSort = (option) => {
        setSortOption(option);
        setPage(1);
        getCamplogList();
    }

    // 검색 함수
    const handelSearch = () => {
        setPage(1);
        getCamplogList();
        setKeyword("");
    };

    // 검색 엔터 함수
    const handleKeyUp = (e) => {
        if (!isComposing && e.key === "Enter") {
            setPage(1);
            getCamplogList();
            setKeyword("");
        }
    };

    // 스크롤 관련
    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollTop(true);
        } else {
            setShowScrollTop(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

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
        <div className="camplog-main-container">
            {/* 검색 영역 */}
            <div className="camplog-search-container">
                {/* 드롭다운 영역 */}
                <FormControl
                    variant="standard"
                    sx={{ minWidth: 120, marginRight: 2 }}
                >
                    <InputLabel id="camplog-select-label">전체</InputLabel>
                    <Select
                        labelId="camplog-select-label"
                        id="camplog-select"
                        value={selectedSearch}
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            setSelectedSearch(selectedValue);
                            setKeyword("");
                            setPage(1);
                            getCamplogList();

                            console.log("옵션 변경:", { option: selectedSearch, keyword });
                        }}
                    >
                        <MenuItem value="all">전체</MenuItem>
                        <MenuItem value="title">제목</MenuItem>
                        <MenuItem value="content">내용</MenuItem>
                    </Select>
                </FormControl>

                {/* 검색어 입력 영역 */}
                <TextField
                    id="keyword-search"
                    label="검색어 입력"
                    variant="standard"
                    sx={{ width: 250 }}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyUp={handleKeyUp}
                />

                {/* 돋보기 아이콘 */}
                <IconButton
                    onClick={handelSearch}
                >
                    <Search sx={{ fontSize: 20 }} />
                </IconButton>
            </div>

            {/* 검색 결과 영역 */}
            <div className="camplog-result-container">
                <p>
                    <span className="search-result-blue">검색어</span>에 대한 검색결과가
                    <span className="search-result-blue"> 총 {totalCount} 건</span> 있습니다.
                </p>
            </div>

            {/* 정렬 옵션 영역 */}
            <div className="camplog-sort-container">
                <span
                    onClick={() => handleSort("latest")}
                    className={sortOption === "latest" ? "active" : ""}
                >
                    최신순
                </span>{" "}
                |
                <span
                    onClick={() => handleSort("likes")}
                    className={sortOption === "likes" ? "active" : ""}
                >
                    공감순
                </span>
            </div>

            <div className="camplog-list-container">
                {camplogList.length === 0 ? (
                    <p>등록된 캠핑로그가 없습니다.</p>
                ) : (
                    camplogList.map((list) => {
                        const isReportedByLoggedInUser = list.reportStatus === "0" && list.reporterUserIdx === user?.userIdx;
                        const isReportedForEveryone = list.reportStatus === "1";

                        if (isReportedByLoggedInUser || isReportedForEveryone) {
                            return (
                                <div key={list.logIdx} className="camplog-list-item reported">
                                    신고된 후기 글입니다.
                                </div>
                            );
                        }

                        return (
                            <div key={list.logIdx} className="camplog-list-item">
                                <div className="camplog-content-wrapper">
                                    <div className="camplog-nickname">
                                        <AccountCircleIcon className="camplog-nickname-icon" />
                                        <div className="camplog-nickname-text">
                                            <span className="name">{list.userNickname}</span>
                                            <span className="date">{list.logRegDate.substring(0, 10)}</span>
                                        </div>
                                    </div>
                                    <div className="camplog-title"><p>{list.logTitle}</p></div>
                                    <div className="camplog-content">
                                        <p>{list.logContent || "내용 없음"}</p>
                                    </div>
                                    <div className="camplog-info">
                                        <p>
                                            <FavoriteBorderIcon /> 공감수 {list.totalLikes} | {" "}
                                            <ChatBubbleOutlineIcon style={{ transform: 'scaleX(-1)' }} /> 댓글수 {list.totalCount} {" "}
                                            {list.campIdx ? (
                                                <>
                                                    | <Link href={`/camp/detail/${list.campIdx}`} style={{ textDecoration: 'none' }}>
                                                        #{list.facltNm}
                                                    </Link>
                                                </>
                                            ) : null}
                                        </p>
                                    </div>
                                </div>
                                <div className="camplog-thumbnail">
                                    <img
                                        src={list.fileName ? `http://localhost:8080/upload/${list.fileName}` : "/images/campImageholder3.png"}
                                        alt="캠핑 썸네일"
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* 글쓰기 버튼 영역 */}
            <div className="camplog-write-container">
                <Link href="/camplog/write"><Button variant="contained">글쓰기</Button></Link>
            </div>

            {/* 페이징 영역 */}
            <div className="camplog-pagination">
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
            </div>

            {/* 페이지 상단으로 가기 */}
            {showScrollTop && (
                <button
                    className="scroll-to-top"
                    onClick={scrollToTop}
                >
                    &#9650;
                </button>
            )}
        </div>
    );
}

export default Page;