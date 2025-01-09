"use client";
import React, { useState, useEffect } from "react";
import "./camp.css"; // CSS 파일은 그대로 사용
import CampMap from "./camp_map/page.jsx"; // 지도 컴포넌트
import { FaLocationDot, FaPhoneFlip } from "react-icons/fa6";
import { Box, FormControl, InputLabel, MenuItem, NativeSelect, Pagination, Select, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import Button from '@mui/material/Button';
import useAuthStore from "../../../store/authStore";

function Page() {
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [campList, setCampList] = useState([]); // 캠핑장 리스트
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [sortOption, setSortOption] = useState("views"); // 리스트 정렬 선택
    const [region, setRegion] = useState("");
    const [sidoList, setSidoList] = useState([]); // 시도 리스트
    const [sigunguList, setSigunguList] = useState([]); // 시군구 리스트
    const [selectedRegion, setSelectedRegion] = useState(""); // 선택된 시도
    const [selectedSigungu, setSelectedSigungu] = useState(""); // 선택된 시군구
    const [keyword, setKeyword] = useState(""); // 키워드 검색 상태
    const [isComposing, setIsComposing] = useState(false); // 검색 시 Enter 관련
    const [totalCount, setTotalCount] = useState(0); // 검색 결과 개수
    const [showScrollTop, setShowScrollTop] = useState(false); // 페이지 상단으로 가기
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hoveredRegion, setHoveredRegion] = useState(''); // 추가

    const { user } = useAuthStore();
    const [favList, setFavList] = useState([]);

    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    // 시도(doNm) 데이터 가져오기
    useEffect(() => {
        const getSidoList = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${LOCAL_API_BASE_URL}/camp/sido`);
                if (response.data.success) {
                    setSidoList(response.data.data); // 시도 리스트 저장
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        getSidoList();
    }, []);

    useEffect(() => {
        console.log("region 변경:", region);
        setSelectedSigungu(""); // 시군구 초기화
        setSigunguList([]); // 시군구 리스트 초기화
    }, [region]);

    // 시군구 데이터 가져오기
    useEffect(() => {
        if (region) {
            const getSigunguList = async () => {
                try {
                    const response = await axios.get(`${baseUrl}/camp/sigungu?doNm2=${region}`);
                    setSigunguList(response.data.data);
                    setSelectedSigungu("");
                    getCampList();
                } catch (err) {
                    setError("Error fetching data: " + err.message);
                }
            };
            getSigunguList();
        } else {
            setSigunguList([]);
            getCampList();
        }
    }, [region]);

    const getCampList = async () => {
        try {
            setLoading(false);
            console.log("Fetching data with params:", { region, selectedSigungu, page, size, sortOption });
            const response = await axios.get(`${baseUrl}/camp/list`, {
                params: {
                    page,
                    size,
                    keyword: keyword?.trim() || null,
                    doNm2: region || null,
                    sigunguNm: selectedSigungu || null,
                    sortOption,
                },
            });
            if (response.data.success) {
                setCampList(response.data.data.data || []);
                setTotalPages(response.data.data.totalPages || 0);
                setTotalCount(response.data.data.totalCount || 0);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Error fetching data: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCampList();
    }, [region, selectedSigungu, page, size, sortOption]);

    useEffect(() => {
        setPage(1);
    }, [region, selectedSigungu, keyword]);

    useEffect(() => {
        setSelectedSigungu(""); // 시군구 초기화
    }, [region]);

    // 사용자 찜 리스트 가져오기
    const getFavList = () => {
        if (!user) return;
        axios.get(`${LOCAL_API_BASE_URL}/camp/getLikeList?userIdx=${user.userIdx}`)
            .then((res) => {
                console.log(res.data);
                setFavList(res.data.data);
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getFavList();
    }, [user])

    // 사용자 찜 처리
    const handleLike = (isLiked, campIdx) => {
        if (!user) return;
        axios.get(`${LOCAL_API_BASE_URL}/camp/like`, {
            params: {
                userIdx: user.userIdx,
                campIdx: campIdx,
                isLiked: isLiked,
            },
        })
            .then(() => getFavList())
            .catch((err) => console.log(err))
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    }

    const handleSearch = () => {
        setPage(1); // 새 검색 시작 시 페이지를 1로 리셋
        getCampList();
    };

    const handleKeyUp = (e) => {
        if (!isComposing && e.key === "Enter") {
            getCampList();
        }
    }

    // 정렬 함수
    const handleSort = (option) => {
        setSortOption(option); // 정렬 옵션 상태 업데이트
        setPage(1); // 페이지를 1로 리셋
        getCampList(); // 백엔드에서 정렬된 데이터 요청
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

    // 데이터 가져올 때 로딩
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>
    }

    return (
        <div>
            {/* 헤더 영역 */}
            <div className="camp-header">
                <img src="/images/camp1.png" alt="헤더 이미지" className="camp-header-image" />
            </div>

            {/* 메인 컨테이너 */}
            <div className="camp-main-container">
                {/* 지도 영역 */}
                <div className="camp-map-container">
                    <CampMap
                        region={region}
                        setRegion={setRegion}
                        setSelectedSigungu={setSelectedSigungu}
                        setSigunguList={setSigunguList}
                        setKeyword={setKeyword}
                        setHoveredRegion={setHoveredRegion}
                    />
                    <div className="camp-map-guide">
                        {hoveredRegion || region || '지도를 선택해 주세요'}
                    </div>
                </div>

                {/* 검색 및 정렬 영역 */}
                <div className="camp-right-container">
                    <div className="camp-search-container">
                        {/* 시도 및 시군구 드롭다운 */}
                        <div className="camp-doNm-select">
                            {/*
                            {/* 시도 드롭다운 영역 */}
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="region-select-label">전국</InputLabel>
                                <Select
                                    labelId="region-select-label"
                                    id="region-select"
                                    value={region}
                                    onChange={(e) => {
                                        const newRegion = e.target.value;
                                        if (region !== newRegion) {
                                            setRegion(newRegion);
                                            setKeyword("");
                                        }
                                        if (newRegion === "") {
                                            setSelectedSigungu("");
                                        }
                                    }}
                                    label="전국"
                                >
                                    <MenuItem value="">
                                        <em>전국</em>
                                    </MenuItem>
                                    {sidoList.map((sido, index) => (
                                        <MenuItem key={index} value={sido}>
                                            {sido}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* 시군구 드롭다운 영역 */}
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="sigungu-select-label">시군구</InputLabel>
                                <Select
                                    labelId="sigungu-select-label"
                                    id="sigungu-select"
                                    value={selectedSigungu}
                                    onChange={(e) => {
                                        const sigungu = e.target.value;
                                        setSelectedSigungu(sigungu);
                                        setKeyword("");
                                    }}
                                    disabled={!sigunguList?.length}
                                >
                                    <MenuItem value="">
                                        <em>시군구</em>
                                    </MenuItem>

                                    {sigunguList?.map((sigungu, index) => (
                                        <MenuItem key={index} value={sigungu}>
                                            {sigungu}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        {/* {`${totalCount}개`} */}
                        <div className="camp-total-count">
                            {`${totalCount.toLocaleString()}개`}
                        </div>
                    </div>

                    <div className="camp-search-keyword-container">
                        {/* 키워드 검색 영역 */}
                        <div className="camp-search-keyword">
                            <FormControl sx={{ width: '200px' }}>
                                <TextField
                                    id="keyword-search"
                                    label="검색어를 입력하세요."
                                    value={keyword}
                                    variant="standard"
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onFocus={() => {
                                        if (keyword) setKeyword("");
                                    }}
                                    onKeyUp={handleKeyUp}
                                />
                            </FormControl>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleSearch}
                            >
                                검색
                            </Button>
                        </div>
                    </div>

                    {/* 정렬 옵션 */}
                    <div className="camp-sort-container">
                        <span
                            onClick={() => handleSort("views")}
                            className={sortOption === "views" ? "active" : ""}
                        >
                            조회수
                        </span>{" "}
                        |
                        <span
                            onClick={() => handleSort("title")}
                            className={sortOption === "title" ? "active" : ""}
                        >
                            가나다순
                        </span>{" "}
                        |
                        <span
                            onClick={() => handleSort("likes")}
                            className={sortOption === "likes" ? "active" : ""}
                        >
                            찜순
                        </span>{" "}
                        |
                        <span
                            onClick={() => handleSort("latest")}
                            className={sortOption === "latest" ? "active" : ""}
                        >
                            최신순
                        </span>
                    </div>

                    {/* 캠핑장 리스트 */}
                    <div className="camp-faclNmList-container">
                        {campList.length > 0 ? campList.map((camp) => (
                            <div className="camp-item" key={camp.campIdx}>
                                {/* 캠핑장 사진 영역 */}
                                <div className="camp-img-container">
                                    <Link href={`/camp/detail/${camp.campIdx}`}>
                                        <img
                                            src={camp.firstImageUrl ? camp.firstImageUrl : camp.campImg2 ? camp.campImg2 : "/images/campImageholder.png"}
                                            alt="캠핑장 사진"
                                            onError={(e) => e.target.src = "/images/campImageholder.png"}
                                        />
                                    </Link>
                                    {/* 캠핑장 휴업일 경우, 사진 좌상에 휴업 아이콘 띄우기 */}
                                    {camp.manageSttus === '휴장' && (
                                        <div className="camp-overlay">
                                            <span className="camp-closed-icon">휴업</span>
                                        </div>
                                    )}
                                </div>
                                <div className="camp-text">
                                    <Box display="flex" justifyContent="space-between">
                                        <p
                                            className={`camp-stats ${sortOption === "title" || sortOption === "latest" ? "bold-stats" : ""
                                                }`}
                                        >
                                            <span className={`totalViews ${sortOption === "views" ? "active-stat" : ""}`}>
                                                조회수 <span className="totalNumber">{camp.totalViews}</span>
                                            </span> | &nbsp;
                                            <span className="totalLogs">
                                                캠핑로그 <span className="totalNumber">{camp.totalLogs}</span>
                                            </span> | &nbsp;
                                            <span className={`totalLikes ${sortOption === "likes" ? "active-stat" : ""}`}>
                                                찜수 <span className="totalNumber">{camp.totalLikes}</span>
                                            </span>
                                        </p>

                                        {/* 찜하기 버튼 */}
                                        <Box >
                                            <Button variant="text"
                                                className="like-btn"
                                                onClick={() => handleLike(favList.filter((fav) => fav.campIdx == camp.campIdx).length > 0, camp.campIdx)}
                                            >
                                                {favList.filter((fav) => fav.campIdx == camp.campIdx).length > 0 ? '❤️' : '🤍'}
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* 캠핑장명 */}
                                    <h3><Link href={`/camp/detail/${camp.campIdx}`}>[{camp.doNm2} {camp.sigunguNm}] {camp.facltNm}</Link></h3>

                                    {/* 캠핑장 한 줄 소개 */}
                                    <p className="camp-lineIntro">{camp.lineIntro}</p>

                                    {/* 캠핑장 소개 */}
                                    <p className="camp-intro">{camp.intro ? camp.intro : camp.featureNm}</p>

                                    {/* 캠핑장 주소 */}
                                    <p><FaLocationDot color="#5F8FF0" /> {camp.addr1} </p>

                                    {/* 캠핑장 전화번호 */}
                                    <p>{camp.tel && <><FaPhoneFlip color="#5F8FF0" /> {camp.tel}</>}</p>

                                    {/* 캠핑장 휴업 정보 */}
                                    {camp.manageSttus === '휴장' && (
                                        <p style={{ color: '#3D3BF3', fontWeight: 'bold' }}>
                                            휴업: {camp.hvofBgnde && camp.hvofEnddle ? `${camp.hvofBgnde} ~ ${camp.hvofEnddle}` : "휴업 중"}
                                        </p>
                                    )}

                                    {/* 최신순으로 눌렀을 때 캠핑장 수정날짜 표시 */}
                                    {sortOption === "latest" && camp.modifiedtime && (
                                        <p className="camp-modified-time">
                                            <b>업데이트 날짜:</b> {camp.modifiedtime.substring(0, 10)}
                                        </p>
                                    )}

                                </div>
                            </div>
                        ))
                            :
                            <div>
                                <h3>
                                    검색 결과가 없습니다!
                                </h3>
                            </div>}
                    </div>

                    <div className="camp-pagination">
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
        </div>
    );
}
export default Page;