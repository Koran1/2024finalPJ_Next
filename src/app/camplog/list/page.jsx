
"use client";
import './camploglist.css';
import { Search } from "@mui/icons-material";
import { InputLabel, FormControl, MenuItem, Select, TextField, IconButton, Link, Button, Pagination, InputAdornment, Avatar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useEffect, useState } from "react";
import axios from 'axios';
import useAuthStore from '../../../../store/authStore'; // authStore 가져오기
import { useRouter } from 'next/navigation';

function Page(props) {
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
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
    const router = useRouter();
    const { isAuthenticated, token, user } = useAuthStore();
    const [searchedWord, setSearchedWord] = useState("");
    // camplog 리스트 가져오기
    const getCamplogList = async () => {
        setLoading(true);
        const searchKeyword = keyword?.trim() || null;
        try {
            const response = await axios.get(`${baseUrl}/camplog/list`, {
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

    // camplogList.forEach((list) => {
    //     console.log("logIdx:", list.logIdx);
    //     console.log("reportStatus:", list.reportStatus, "타입:", typeof list.reportStatus);
    //     console.log("reporterUserIdx:", list.reporterUserIdx, "타입:", typeof list.reporterUserIdx);
    //     console.log("loggedInUserIdx:", user?.userIdx, "타입:", typeof user?.userIdx);
    // });

    // 정렬 함수
    const handleSort = (option) => {
        setSortOption(option);
        setPage(1);
        getCamplogList();
    }

    // 검색 함수
    const handelSearch = () => {
        setSearchedWord(keyword);
        setPage(1);
        getCamplogList();
        setKeyword("");
    };

    // 검색 엔터 함수
    const handleKeyUp = (e) => {
        setKeyword(e.target.value);
        if (e.key === "Enter") {
            setSearchedWord(e.target.value);
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
    const handleGoLogDetail = (logIdx) => { // 상세 이동함수
        router.push(`/camplog/detail/${logIdx}`)
    }
    const handleLogWrite = () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/user/login');
            return;
        } else {
            router.push("/camplog/write");
        }
    }
    return (
        <div className="camplog-main-container">
            {/* 검색 영역 */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                        onKeyUp={handleKeyUp}
                    />

                    {/* 돋보기 아이콘 */}
                    <IconButton
                        onClick={handelSearch}
                    >
                        <Search sx={{ fontSize: 20 }} />
                    </IconButton>
                </div>
                {/* 글쓰기 버튼 영역 */}
                <div className="camplog-write-container" style={{ height: "40px", marginTop: "20px" }}>
                    <Button variant="contained" onClick={handleLogWrite}>글쓰기</Button>
                </div>
            </div>


            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* 검색 결과 영역 */}
                {searchedWord && (
                    <div className="camplog-result-container">
                        <p>
                            <span><b className="search-result-blue">{searchedWord}</b>에 대한 검색결과가  총   <b className="search-result-blue">{totalCount}건</b> 있습니다.</span>
                        </p>
                    </div>
                )}

                {/* 정렬 옵션 영역 */}
                <div className="camplog-sort-container" style={{ marginLeft: "auto" }}>
                    <span
                        onClick={() => handleSort("latest")}
                        className={sortOption === "latest" ? "active" : ""}
                    >
                        최신순
                    </span>{" "}
                    {/* | */}
                    <span
                        onClick={() => handleSort("likes")}
                        className={sortOption === "likes" ? "active" : ""}
                    >
                        공감순
                    </span>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="camplog-list-container">

                {camplogList.length === 0 ? (
                    <p style={{ margin: "0 auto" }}>등록된 캠핑로그가 없습니다.</p>
                ) : (
                    camplogList.map((list) => {
                        const userStatus0 = list.reporterUserIds ? list.reporterUserIds.split(',') : [];
                        const currUserStatus0 = userStatus0.includes(String(user?.userIdx));
                        const status1 = list.reportStatus === "1";

                        // reportStatus = 1인 경우, 아예 리스트에서 안 보이게 하기!
                        if (status1) {
                            return null;
                        }

                        // reportStatus = 0인 경우, 신고자만 피신고자 신고 글입니다 처리
                        if (currUserStatus0) {
                            return (
                                <div key={list.logIdx} className="camplog-list-item reported">
                                    신고된 후기 글입니다.
                                </div>
                            );
                        }

                        // reportCount > 10 일 때, 모든 사람한테 신고 글입니다 처리
                        if (list.reportCount > 10) {
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
                                        {/* <AccountCircleIcon className="camplog-nickname-icon" /> */}
                                        <Avatar sx={{ width: "36px", height: "36px" }} src={list.userEtc01 ? `${imgUrl}/user/${list.userEtc01}` : '/default-product-image.jpg'} />
                                        <div className="camplog-nickname-text">
                                            <span className="name">{list.userNickname}</span>
                                            <span className="date">{list.logRegDate.substring(0, 10)}</span>
                                        </div>
                                    </div>
                                    <div style={{ cursor: "pointer" }} onClick={() => handleGoLogDetail(list.logIdx)}>
                                        <div className="camplog-title"><p>{list.logTitle}</p></div>
                                        <div className="camplog-content">
                                            <p>{list.logContent || "내용 없음"}</p>
                                        </div>
                                    </div>
                                    <div className="camplog-info">
                                        <p>
                                            <FavoriteBorderIcon /> 공감수 {list.totalLikes} | {" "}
                                            <ChatBubbleOutlineIcon style={{ transform: 'scaleX(-1)' }} /> 댓글수 {list.totalCount} {" "}
                                            {list.campIdx ? (
                                                <>
                                                    | <Link href={`/camp/detail/${list.campIdx}`} style={{ textDecoration: 'none', cursor: "pointer" }}>
                                                        #{list.facltNm}
                                                    </Link>
                                                </>
                                            ) : null}
                                        </p>
                                    </div>
                                </div>
                                <div className="camplog-thumbnail">
                                    <img
                                        src={list.fileName ? `${imgUrl}/${list.fileName}` : "/images/campImageholder3.png"}
                                        alt="캠핑 썸네일"
                                        style={{ cursor: "pointer" }} onClick={() => handleGoLogDetail(list.logIdx)}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
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