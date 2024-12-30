"use client";
import Link from "next/link";
import "./myloglist.css";
import { Pagination } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../../../../store/authStore"; // authStore 가져오기

function Page() {
    const { user } = useAuthStore(); // authStore에서 사용자 정보 가져오기
    const userIdx = user?.userIdx; // userIdx 추출
    const [navMenu, setNavMenu] = useState("/mylog/list");
    const [mylogList, setMylogList] = useState([]); // mylog 리스트
    const [loading, setLoading] = useState(false); // 로딩상태
    const [error, setError] = useState(null); // 에러상태
    const [page, setPage] = useState(1); // 페이징-1페이지
    const [size, setSize] = useState(10); // 페이징-한 페이지 당 데이터 개수
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수

    // 상단 네비게이션 메뉴 활성화 여부
    const getActiveClass = (link) => {
        return navMenu === link ? 'active' : '';
    }

    // mylog 리스트 가져오기
    const getMyLogList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/mycamp/mylog/list`, {
                params: { userIdx, page, size },
            });
            if (response.data.success) {
                setMylogList(response.data.data.data);
                setTotalPages(response.data.data.totalPages);
                console.log("Auth Store에 있는 user:", user);
                console.log("데이터 가져오기:", response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Error fetching data: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 데이터 로드
    useEffect(() => {
        getMyLogList();
    }, [page, size, userIdx]);

    // useEffect(() => {
    //     getMyLogList();
    // }, []);

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
        <div className="mylog-list-main-container">
            <div className="mylog-navmenu-container">
                {/* 상단 네비게이션바 */}
                <Link href="/mycamp/plan"
                        className={`btn1 ${getActiveClass('/mycamp/plan')}`}
                        onClick={() => setNavMenu('/mycamp/plan')}
                    >
                        캠핑플래너
                    </Link>
                    <Link href="/mycamp/book"
                        className={`btn1 ${getActiveClass('/mylog/book')}`}
                        onClick={() => setNavMenu('/mylog/book')}
                    >
                        나의 예약
                    </Link>
                    <Link href="/mycamp/mylog/list"
                        className={`btn1 ${getActiveClass('/mylog/list')}`}
                        onClick={() => setNavMenu('/mylog/list')}
                    >
                        나의 캠핑로그
                    </Link>
                    <Link href="/camp/favCamp"
                        className={`btn1 ${getActiveClass('/mylog/favcamp')}`}
                        onClick={() => setNavMenu('/mylog/favcamp')}
                    >
                        위시리스트
                    </Link>
            </div>

            {/* 헤더 제목 영역 */}
            <div className="mylog-list-header-container">
                <p style={{ fontSize: "35px", fontWeight: "bold" }}>내 캠핑로그 관리</p>
            </div>

            {/* 마이 로그 리스트 영역 */}
            <div className="mylog-list-table-container">
                <table className="mylog-list-table">
                    <thead>
                        <tr>
                            <th>제목</th>
                            <th>작성일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mylogList.length === 0 ? (
                            <tr>
                                <td colSpan="2" style={{ textAlign: "center", padding: "100px", fontWeight: "bold", fontSize: "20px" }}>
                                    등록된 캠핑로그가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            mylogList.map((list) => (
                                <tr key={list.logIdx}>
                                    <td style={{ textAlign: "left"}}>
                                        <Link href={`/mycamp/mylog/detal/${list.logIdx}`}>
                                            {list.logTitle}&nbsp;
                                            {list.fileIdx ? <ImageIcon style={{ color: "#4D88FF" }} /> : null}&nbsp;
                                            {list.commentCount && list.commentCount > 0 ? (
                                                <span style={{ color: "#FE4949", fontWeight: "bold" }}>[{list.commentCount}]</span>) : null}
                                        </Link>
                                    </td>
                                    <td>{list.logRegDate.substring(0, 10)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 페이징 영역 */}
            <div className="mylog-list-pagination">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => {
                        if (value !== page) setPage(value);
                    }}
                />
            </div>
        </div>
    );
}

export default Page;
