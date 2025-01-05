"use client";
import './camploglist.css';
import { Search } from "@mui/icons-material";
import { InputLabel, FormControl, MenuItem, Select, TextField, IconButton, Link, Button, Pagination } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TagIcon from '@mui/icons-material/Tag';
import { comment } from 'postcss';
import { useEffect, useState } from "react";

function Page(props) {
    const [selectedSearch, setSelectedSearch] = useState(""); // 검색어 옵션 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [sortOption, setSortOption] = useState("latest"); // 리스트 정렬
    const [showScrollTop, setShowScrollTop] = useState(false); // 페이지 상단으로 가기

    // 정렬 함수
    const handleSort = (option) => {
        setSortOption(option);
    }

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
                        onChange={(e) => setSelectedSearch(e.target.value)}
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
                    sx={{ width: 250, marginRight: 1 }}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                {/* 돋보기 아이콘 */}
                <IconButton>
                    <Search
                        sx={{
                            fontSize: 30, // 돋보기 아이콘 크기 조정
                        }}
                    />
                </IconButton>
            </div>

           {/* 검색 결과 영역 */}
            <div className="camplog-result-container">
                <p>
                    <span className="search-result-blue">검색어</span>에 대한 검색결과가 
                    <span className="search-result-blue"> 총 몇 건</span> 있습니다.
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

            {/* 리스트 영역 */}
            <div className="camplog-list-container">
                <div className="camplog-list-item">
                    <div className="camplog-content-wrapper">
                        <div className="camplog-nickname">
                            <AccountCircleIcon className="camplog-nickname-icon" />
                            <div className="camplog-nickname-text">
                                <span className="name">인포머</span>
                                <span className="date">2024-12-23</span>
                            </div>
                        </div>
                        <div className="camplog-title"><p>여기 정말 좋네요 추천</p></div>
                        <div className="camplog-content">
                            <p>
                            캠핑은 자연과 함께하는 최고의 힐링입니다. 이 캠핑장은 조용하고 경치가 아름다워 많은 캠핑족들에게 사랑받고 있습니다. 특히 여름철에는 시원한 계곡이 흘러 더욱 매력적입니다. 가족, 친구들과 함께 좋은 추억을 만들어 보세요!
                            캠핑은 자연과 함께하는 최고의 힐링입니다. 이 캠핑장은 조용하고 경치가 아름다워 많은 캠핑족들에게 사랑받고 있습니다. 특히 여름철에는 시원한 계곡이 흘러 더욱 매력적입니다. 가족, 친구들과 함께 좋은 추억을 만들어 보세요!
                            캠핑은 자연과 함께하는 최고의 힐링입니다. 이 캠핑장은 조용하고 경치가 아름다워 많은 캠핑족들에게 사랑받고 있습니다. 특히 여름철에는 시원한 계곡이 흘러 더욱 매력적입니다. 가족, 친구들과 함께 좋은 추억을 만들어 보세요!
                            캠핑은 자연과 함께하는 최고의 힐링입니다. 이 캠핑장은 조용하고 경치가 아름다워 많은 캠핑족들에게 사랑받고 있습니다. 특히 여름철에는 시원한 계곡이 흘러 더욱 매력적입니다. 가족, 친구들과 함께 좋은 추억을 만들어 보세요!
                            </p>
                        </div>
                        <div className="camplog-info"><p><FavoriteBorderIcon /> 공감수 20 | <ChatBubbleOutlineIcon style={{ transform: 'scaleX(-1)' }} /> 댓글수 30 | #아웃오브파크 </p></div>
                    </div>
                    <div className="camplog-thumbnail">
                        <img src="/images/campImageholder.png" alt="캠핑 썸네일" />
                    </div>
                </div>
                <div className="camplog-list-item">
                    <div className="camplog-content-wrapper">
                    <div className="camplog-nickname">
                        <AccountCircleIcon className="camplog-nickname-icon" />
                            <div className="camplog-nickname-text">
                                <span className="name">인포머</span>
                                <span className="date">2024-12-23</span>
                            </div>
                        </div>
                        <div className="camplog-title"><p>여기 정말 좋네요 추천</p></div>
                        <div className="camplog-content">
                            <p>캠핑은 자연과 함께하는 최고의 힐링입니다. 이 캠핑장은 조용하고 경치가 아름다워 많은 캠핑족들에게 사랑받고 있습니다. 특히 여름철에는 시원한 계곡이 흘러 더욱 매력적입니다. 가족, 친구들과 함께 좋은 추억을 만들어 보세요!</p>
                        </div>
                        <div className="camplog-info"><p><FavoriteBorderIcon /> 공감수 20 | <ChatBubbleOutlineIcon style={{ transform: 'scaleX(-1)' }} /> 댓글수 30 | #아웃오브파크 </p></div>
                    </div>
                    <div className="camplog-thumbnail">
                        <img src="/images/campImageholder.png" alt="캠핑 썸네일" />
                    </div>
                </div>
                <div className="camplog-list-item">
                    <div className="camplog-content-wrapper">
                    <div className="camplog-nickname">
                        <AccountCircleIcon className="camplog-nickname-icon" />
                            <div className="camplog-nickname-text">
                                <span className="name">인포머</span>
                                <span className="date">2024-12-23</span>
                            </div>
                        </div>
                        <div className="camplog-title"><p>여기 정말 좋네요 추천</p></div>
                        <div className="camplog-content">
                            <p>캠핑은 자연과 함께하는 최고의 힐링입니다. 이 캠핑장은 조용하고 경치가 아름다워 많은 캠핑족들에게 사랑받고 있습니다. 특히 여름철에는 시원한 계곡이 흘러 더욱 매력적입니다. 가족, 친구들과 함께 좋은 추억을 만들어 보세요!</p>
                        </div>
                        <div className="camplog-info"><p><FavoriteBorderIcon /> 공감수 20 | <ChatBubbleOutlineIcon style={{ transform: 'scaleX(-1)' }} /> 댓글수 30 | #아웃오브파크 </p></div>
                    </div>
                    <div className="camplog-thumbnail">
                        <img src="/images/campImageholder.png" alt="캠핑 썸네일" />
                    </div>
                </div>
            </div>
            
            {/* 글쓰기 버튼 영역 */}
            <div className="camplog-write-container">
                <Link href="/camplog/write"><Button variant="contained">글쓰기</Button></Link>
            </div>
            
            {/* 페이징 영역 */}
            <div className="camplog-pagination">
                <Pagination 
                    
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