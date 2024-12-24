
"use client";
import './list.css';
import { Search } from "@mui/icons-material";
import { InputLabel, FormControl, MenuItem, Select, TextField, IconButton } from "@mui/material";
import { useState } from "react";

function Page(props) {
    const [selectedSearch, setSelectedSearch] = useState(""); // 검색어 옵션 박스
    const [keyword, setKeyword] = useState(""); // 키워드 검색
    const [sortOption, setSortOption] = useState("latest"); // 리스트 정렬

    // 정렬 함수
    const handleSort = (option) => {
        setSortOption(option);
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

            {/* 검색 결과 및 정렬 옵션 영역 */}
            <div className="camplog-result-sort-container">
                {/* 검색 결과 영역 */}
                <div className="camplog-search-result">
                    <p><span className="search-result-blue">검색어</span>에 대한 검색결과가 <span className="search-result-blue">총  몇 건</span> 있습니다.</p>
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
                        className={sortOption === "lieks" ? "active" : ""}
                    >
                        공감순
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Page;
