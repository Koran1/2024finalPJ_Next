"use client";
import Link from "next/link";
import "./myloglist.css";
import { Grid2, Pagination } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../../../../store/authStore"; // authStore 가져오기

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
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
            const response = await axios.get(`${LOCAL_API_BASE_URL}/mycamp/mylog/list`, {
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
                {/* <Link href="/mycamp/plan/list"
                    className={`btn1 ${getActiveClass('/mycamp/plan/list')}`}
                    onClick={() => setNavMenu('/mycamp/plan/list')}
                >
                    캠핑플래너
                </Link> */}
                <Link href="/book/list"
                    className={`btn1 ${getActiveClass('/book/list')}`}
                    onClick={() => setNavMenu('/book/list')}
                >
                    나의 예약
                </Link>
                <Link href="/mycamp/mylog/list"
                    className={`btn1 ${getActiveClass('/mycamp/mylog/list')}`}
                    onClick={() => setNavMenu('/mycamp/mylog/list')}
                >
                    나의 캠핑로그
                </Link>
                <Link href="/camp/favCamp"
                    className={`btn1 ${getActiveClass('/camp/favCamp')}`}
                    onClick={() => setNavMenu('/camp/favCamp')}
                >
                    위시리스트
                </Link>
            </div>

            <Grid2 container spacing={0}>
                <Grid2 size={2} />
                <Grid2 size={8}>
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
                                            <td style={{ textAlign: "left" }}>
                                                <Link href={`/camplog/detail/${list.logIdx}`}>
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
                </Grid2>
                <Grid2 size={2} />
            </Grid2>
        </div>
    );
}

export default Page;
