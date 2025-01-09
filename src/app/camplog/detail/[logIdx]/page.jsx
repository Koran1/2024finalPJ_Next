"use client"
import { Avatar, Box, Button, CircularProgress, FormControlLabel, Grid2, IconButton, Modal, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CSSTransition } from 'react-transition-group';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import './page.css';
import { Close, Delete, Report } from '@mui/icons-material';
import useAuthStore from '../../../../../store/authStore';

function Page({ params }) {
    // 로그 내용 변수
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;

    const { user } = useAuthStore();

    const router = useRouter();
    const [isIconHover, setIsIconHover] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isWriter, setIsWriter] = useState(false);
    const [toggleIcon, setToggleIcon] = useState(false);
    const [tagData, setTagData] = useState([{ tagId: "" }]);
    const [doRecommend, setDoRecommend] = useState(false);
    const [RecommendCount, setRecommendCount] = useState(0);
    // const [isModalOpen, setModalOpen] = useState(false);            // 모달 창 열기
    // const [reportValue, setReportValue] = useState(1);              // 신고 사유 선택 값

    // 댓글 변수
    // const logIdx = useSearchParams().get('logIdx');
    // const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL; // baesUrl 이랑 동일
    const [logCommentList, setLogCommentList] = useState([]);       // 댓글 리스트
    const [logReplyList, setLogReplyList] = useState([]);       // 답글 리스트
    const [userNickname, setUserNickname] = useState([]);           // 유저 닉네임
    const [commentReportInfo, setReportInfo] = useState([]);       // 댓글 신고 정보(승인여부, 횟수)
    const [logCommentContent, setLogCommentContent] = useState(""); // 댓글 내용
    const [logReplyContent, setLogReplyContent] = useState("");     // 답글 내용
    const [commentIdx, setCommentIdx] = useState("");              // 답글의 부모 댓글 인덱스
    const [isShow, setIsShow] = useState(false);                    // 답글 작성 필드 보이기 여부
    const [loading, setLoading] = useState(false);                  // 로딩
    // const [loading, setLoading] = useState(0);                   // 로딩
    const [error, setError] = useState(null);                       // 에러
    const replyTextFieldRef = useRef(null);                         // 답글 작성 필드 포커스하기 위한 ref
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);// 삭제 모달 창 열기
    const [isReportModalOpen, setReportModalOpen] = useState(false);// 신고 모달 창 열기
    const [selectedComment, setSelectedComment] = useState("");     // 선택된 댓글 정보
    const [reportCategory, setReportCategory] = useState("스팸홍보 / 도배글 입니다."); // 신고 사유 선택 값
    const [reportContent, setReportContent] = useState("");         // 신고 내용
    // const [disableCommentCount, setDisableCommentCount] = useState(0); // 공백인 댓글(운영자가 신고 승인한 댓글) 개수
    const [logWriterNickname, setLogWriterNickname] = useState("");

    // 로그 내용 함수들
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { logIdx } = await Promise.resolve(params);

                let apiUrl = `${baseUrl}/camplog/detail?logIdx=${logIdx}`;
                if (user) {
                    apiUrl += `&userIdx=${user.userIdx}`;
                }
                const response = await axios.get(apiUrl);
                const data = response.data;
                console.log("response : ", response);
                // 신고됐거나 삭제된 로그 글은 들어오면 경고창과 함께 리스트로 이동
                if (data.data.rvo[0].reportCount >= 3) {
                    alert("3명이상의 유저에게 신고된 로그글 입니다.");
                    window.location.href = "../list";
                } else if (data.data.logVO.logIsActive == 0) {
                    alert("삭제된 로그 글 입니다.");
                    window.location.href = "../list";
                }
                if (data.success) {
                    setData(data.data);
                    // console.log("Writer NickName : ", data.data.userVO);
                    setLogWriterNickname(data.data.userVO[0].userNickname);
                    setTagData(data.data.pData.map(item => {
                        if (!item.tagData || item.tagData.length === 0) {
                            return [];
                        } else {
                            
                            return item.tagData.map(tag => {
                                return {
                                    ...tag,
                                    isShow: false,
                                    isLinkShow: false,
                                    nodeRef: React.createRef()
                                }
                            })
                        }
                    }));
                    setIsWriter(response.data.data.userVO[0].userIdx === user.userIdx ? true : false);
                } else {
                    alert(response.data.message);
                    router.push("/camplog/list");
                }
            } catch (error) {
                console.error(error);
                router.push("/camplog/list");
            } finally {
                setIsLoading(false);
                // setLoading(loading + 1);
            }
        }
        fetchData();
    }, [params, baseUrl]);

    useEffect(() => {
        setDoRecommend(data.doRecommend);
        setRecommendCount(data.RecommendCount);
    }, [data])

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
    const handleToogleReCommend = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/user/login');
            return;
        } else {
            try {
                const apiUrl = `${baseUrl}/camplog/toggleRecommend?logIdx=${data.logVO.logIdx}&userIdx=${user.userIdx}&doRecommend=${doRecommend ? 1 : 0}`;
                const response = await axios.get(apiUrl);
                if (response.data.success) {
                    response.data.data === "1" ? setDoRecommend(true) : setDoRecommend(false)
                    setRecommendCount(RecommendCount => doRecommend ? RecommendCount - 1 : RecommendCount + 1);
                }
            } catch (error) {
                alert("서버 오류 발생");
            }
        }
    }
    // 기존 로그 글 삭제 함수
    // const handleLogDelete = async () => {
    //     if (confirm("정말 삭제하시겠습니까? ")) {
    //         const apiUrl = `${baseUrl}/camplog/logDelete?logIdx=${data.logVO.logIdx}`;
    //         const response = await axios.post(apiUrl);
    //         if (response.data.success) {
    //             router.push(`/camplog/list`);
    //         }else {
    //             alert(response.data.message)
    //         }
    //     }
    // }

    // 모달로 바꾼 로그 글 삭제 함수(모달로 바꾸면서 confirm필요없어짐 confirm 차이)
    const handleLogDelete = async () => {
        const apiUrl = `${baseUrl}/camplog/logDelete?logIdx=${data.logVO.logIdx}`;
        const response = await axios.post(apiUrl);
        if (response.data.success) {
            router.push(`/camplog/list`);
        } else {
            alert(response.data.message)
        }
    }
    const handleLogEdit = () => {
        router.push(`/camplog/edit/${data.logVO.logIdx}`);
    }

    const logReport = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/user/login');
            return;
        } else {
            const API_URL = `${baseUrl}/camplog/logReport`;
            const sendData = new FormData();
            try {
                console.log("logReport, data.logVO.logIdx", data.logVO.logIdx);
                console.log("logReport, reportCategory", reportCategory);
                console.log("logReport, reportContent", reportContent);
                sendData.append("userIdx", user.userIdx);
                sendData.append("reportTableIdx", data.logVO.logIdx);
                sendData.append("reportCategory", reportCategory);
                sendData.append("reportContent", reportContent);

                // 서버에 저장
                await axios.post(API_URL, sendData);

                // 페이지 새로 고침
                window.location.reload();
            } catch (error) {
                alert("로그(후기)글 신고 오류 : " + error);
            }
        }
    };

    // 댓글 함수들
    // 댓/답글 불러오기
    const getCommentList = async () => {
        try {
            setLoading(true);
            const { logIdx } = await Promise.resolve(params);
            console.log("getComm logIdx : ", logIdx);
            const API_URL = `${baseUrl}/camplog/commentList?logIdx=${logIdx}`;
            await axios.get(API_URL)
                .then((res) => {
                    console.log("res : ", res);
                    console.log("rvo : ", res.data.data.rvo);
                    const commentsList = res.data.data.lcvo.filter(comment => !comment.commentIdx);
                    const replysList = res.data.data.lcvo.filter(comment => comment.commentIdx);
                    console.log("commentsList : ", commentsList);
                    console.log("replyList : ", replysList);
                    setLogCommentList(commentsList);
                    setLogReplyList(replysList);
                    setUserNickname(res.data.data.userNicknameMap);
                    setReportInfo(res.data.data.rvo);
                    // 공백인 댓글(운영자가 신고 승인한 댓글) 개수
                    // setDisableCommentCount (res.data.data.lcvo.filter(comment => comment.logCommentIsActive == 0).length);
                })
                .catch((err) => console.log(err));
        } catch (error) {
            alert("댓글 리스트 불러오기 오류 : " + error);
        } finally {
            setLoading(false);
            // setLoading(loading + 1);
        }
    }

    useEffect(() => {
        getCommentList();
    }, []);

    useEffect(() => {
        if (isShow && replyTextFieldRef.current) {
            replyTextFieldRef.current.focus(); // 필드가 표시되면 포커스 설정
        }
    }, [isShow, commentIdx]);

    const commentSubmit = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/user/login');
            return;
        } else {
            if (logCommentContent.trim() == "") {
                return alert("댓글을 입력해주세요.");
            } else {
                const { logIdx } = await Promise.resolve(params);
                const API_URL = `${baseUrl}/camplog/commentWrite`;
                const data = new FormData();
                try {
                    data.append("userIdx", user.userIdx);
                    data.append("logIdx", logIdx);
                    data.append("logCommentContent", logCommentContent);

                    console.log("userIdx : ", user.userIdx);
                    console.log(data.get("logIdx"));
                    console.log(data.get("logCommentContent"));
                    // 서버에 저장
                    await axios.post(API_URL, data);

                    // 페이지 새로 고침
                    window.location.reload(); // 페이지 새로 고침
                } catch (error) {
                    alert("댓글 등록 오류 : " + error);
                }
            }
        }
    };

    // 답글 작성 버튼
    const replyWrite = (commIdx) => {
        // 로딩 후 처음 클릭 시 실행
        if (commentIdx == "") { setIsShow(!isShow) };
        // 클릭한 댓글의 답글 작성필드가 열려 있을 경우
        if (commentIdx == commIdx) { setIsShow(!isShow) };
        // 클릭한 댓글의 답글 작성필드가 닫혀 있을 경우
        if (commentIdx != commIdx) { setCommentIdx(commIdx) };
    }

    const replySubmit = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/user/login');
            return;
        } else {
            if (logReplyContent.trim() == "") {
                return alert("답글을 입력해주세요.");
            } else {
                const { logIdx } = await Promise.resolve(params);
                const API_URL = `${baseUrl}/camplog/commentWrite`;
                const data = new FormData();
                try {
                    data.append("logIdx", logIdx);
                    data.append("userIdx", user.userIdx);
                    data.append("logCommentContent", logReplyContent);
                    data.append("commentIdx", commentIdx);

                    // 서버에 저장
                    await axios.post(API_URL, data);

                    // 페이지 새로 고침
                    window.location.reload();
                } catch (error) {
                    setError("Error reply data:", error);
                    // alert("답글 등록 오류 : " + error);
                }
            }
        }
    };

    const commentDelete = async (comm) => {
        const API_URL = `${baseUrl}/camplog/commentDelete`;
        const data = new FormData();
        try {
            data.append("logCommentIdx", comm.logCommentIdx);

            // 서버에 저장
            await axios.post(API_URL, data);

            // 페이지 새로 고침
            window.location.reload(); // 페이지 새로 고침
        } catch (error) {
            setError("Error commentDelete data:", error);
            alert("댓/답글 삭제 오류 : " + error);
        }
    };

    const handleModalClick = (comment, modalType) => {
        if (!user) {
            alert("로그인 후 사용 가능합니다.");
            // window.location.reload();
            return;
        }
        // 로그 글 삭제 또는 신고 버튼 클릭 시 해당 모달 활성화
        if (comment == "camplog") {
            setSelectedComment("");
            if (modalType == "delete") {
                setDeleteModalOpen(true);
            } else if (modalType == "report") {
                setReportCategory("스팸홍보 / 도배글 입니다.");
                setReportContent("");
                setReportModalOpen(true);
            }
        } else {
            // 댓글 삭제 또는 신고 버튼 클릭 시, 해당 댓글 정보를 해당 모달에 전달 및 활성화
            setSelectedComment(comment);
            if (modalType == "delete") {
                setDeleteModalOpen(true);
            } else if (modalType == "report") {
                setReportCategory("스팸홍보 / 도배글 입니다.");
                setReportContent("");
                setReportModalOpen(true);
            }
        }
    };

    const reportRadioChange = (e) => {
        setReportCategory(e.target.value);
    }

    const reportContentChange = (e) => {
        setReportContent(e.target.value);
    }

    const commentReport = async (comm) => {
        if (!user) return;
        const API_URL = `${baseUrl}/camplog/commentReport`;
        const data = new FormData();
        try {
            data.append("userIdx", user.userIdx);
            data.append("reportTableIdx", comm.logCommentIdx);
            data.append("reportCategory", reportCategory);
            data.append("reportContent", reportContent);

            // 서버에 저장
            await axios.post(API_URL, data);

            // 페이지 새로 고침
            window.location.reload();
        } catch (error) {
            alert("댓/답글 신고 오류 : " + error);
        }
    };

    // 데이터 가져올 때 로딩
    if (loading) {
        return <CircularProgress style={{ margin: "300px" }} />;
    }
    // if (loading < 2) {
    //     return <div>Loading...</div>;
    // }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>
    }

    return (
        <>
            {/* 로그 내용 */}
            <Grid2 container spacing={0} >
                <Grid2 size={3} />
                <Grid2 textAlign={'center'} size={6}>
                    {isLoading > 0 ?
                        (<CircularProgress style={{ margin: "300px" }} />)
                        :
                        (<>
                            <div style={{ width: '100%', height: "300px", margin: "80px auto", border: "1px solid gray", display: "flex", flexDirection: "column" }}>
                                <div style={{ height: "70%" }}>
                                    <p style={{ fontSize: "50px", margin: "40px auto" }}>{data.logVO.logTitle}</p>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 0 20px", width: "100%" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="48" fill="#ccc" stroke="#999" strokeWidth="2" />
                                            <circle cx="50" cy="40" r="20" fill="#fff" />
                                            <circle cx="42" cy="38" r="2" fill="#000" />
                                            <circle cx="58" cy="38" r="2" fill="#000" />
                                            <path d="M40 50 Q50 60 60 50" stroke="#000" strokeWidth="2" fill="none" />
                                        </svg>
                                        <span style={{ fontWeight: "bold" }}>{data.userVO[0].userNickname}</span>
                                        <span style={{ color: "gray" }}>{data.logVO.logRegDate}</span>
                                    </div>

                                    <div style={{ position: "relative", width: "auto" }}>
                                        <MoreVertIcon
                                            fontSize="large"
                                            style={{ color: isIconHover ? "#333333" : "#A9A9A9", marginRight: "30px",  cursor: "pointer" }}
                                            onMouseOver={() => setIsIconHover(true)}
                                            onMouseOut={() => setIsIconHover(false)}
                                            onClick={() => setToggleIcon(!toggleIcon)}
                                        />
                                        {isWriter ?
                                            (
                                                <>
                                                    {toggleIcon &&
                                                        <>
                                                            <div style={{ position: "absolute", 
                                                            transform: "translate(-50%, -50%)", 
                                                            left: "110px", 
                                                            top: "70px", 
                                                            width: "190px", 
                                                            height: "60px", 
                                                            display: "flex", 
                                                            justifyContent: "start", 
                                                            border: "1px solid gray", 
                                                            backgroundColor: "white", 
                                                            cursor: "pointer"
                                                         }}
                                                                onClick={handleLogEdit}
                                                            >
                                                                <span style={{ color: "gray", margin: "17px 67px 0px 10px", fontWeight: "bold", }}>수정하기</span>
                                                                <ModeIcon style={{ fontSize: "30px", marginTop: "13px" }} />
                                                            </div>
                                                            <div
                                                                style={{ position: "absolute", 
                                                                    transform: "translate(-50%, -50%)", 
                                                                    left: "110px", 
                                                                    top: "130px", 
                                                                    width: "190px", 
                                                                    height: "60px",
                                                                    display: "flex", 
                                                                    justifyContent: "start", 
                                                                    border: "1px solid gray", 
                                                                    borderTop: "none", 
                                                                    backgroundColor: "white", 
                                                                    cursor: "pointer"
                                                                }}
                                                                // onClick={handleLogDelete}
                                                                onClick={() => handleModalClick("", "delete")}
                                                            >
                                                                <span style={{ color: "gray", margin: "17px 67px 0px 10px", fontWeight: "bold" }}>삭제하기</span>
                                                                <DeleteIcon style={{ fontSize: "30px", marginTop: "13px" }} />
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    {toggleIcon &&
                                                        <>
                                                            <div
                                                                style={{ position: "absolute", 
                                                                    transform: "translate(-50%, -50%)", 
                                                                    left: "110px",
                                                                    top: "70px", 
                                                                    width: "190px", 
                                                                    height: "60px", 
                                                                    display: "flex", 
                                                                    ustifyContent: "start", 
                                                                    border: "1px solid gray", 
                                                                    backgroundColor: "white", 
                                                                    cursor: "pointer"    
                                                                }}
                                                                onClick={() => handleModalClick("", "report")}

                                                            >
                                                                <span style={{ color: "gray", margin: "17px 67px 0px 10px", fontWeight: "bold" }}>신고하기</span>
                                                                <img src='/images/siren-siren-svgrepo-com.svg' alt="" width="28px" ></img>
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            )}
                                    </div>
                                </div>
                            </div>
                            {data.pData.map(field => {
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
                                                                                        marginRight: "7px"
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
                                                                                                <img src={`${imgUrl}/${data.fNameByDealIdx[tag.dealIdx]}`}
                                                                                                    alt=''
                                                                                                    style={{ width: '45%', height: '110px', display: "inline-block", margin: "10px 0 10px 10px", cursor: "pointer" }}
                                                                                                    onClick={() => handleGoDeal(tag.dealIdx)}>
                                                                                                </img>
                                                                                                <div style={{ width: '55%', height: '110px', display: "block", margin: "10px" }}>
                                                                                                    <p
                                                                                                        style={{ wordWrap: "break-word", wordBreak: "break-all", fontWeight: 'bold', fontSize: "20px", marginBottom: "20px", cursor: "pointer" }}
                                                                                                        onClick={() => handleGoDeal(tag.dealIdx)}
                                                                                                    >
                                                                                                        {data.dealVO.filter(list => list.dealIdx === tag.dealIdx).map(list => list.dealTitle)}
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
                            <div
                                style={{ width: "50px", height: "50px", margin: "50px auto", border: "1px solid #1976D2", display: "inline-block", cursor: "pointer" }}
                                onClick={handleToogleReCommend}
                            >
                                {doRecommend ?
                                    (
                                        <ThumbUpAltIcon color='primary' style={{ fontSize: "40px", marginTop: "5px" }} />
                                    )
                                    :
                                    (
                                        <ThumbUpOffAltIcon color='primary' style={{ fontSize: "40px", marginTop: "5px" }} />
                                    )}
                            </div>
                            <span style={{ display: "inline-block", fontSize: "25px", fontWeight: "bold", marginLeft: "30px", verticalAlign: "middle" }}>{RecommendCount}</span>
                        </>)}
                </Grid2>
                <Grid2 size={3} />
            </Grid2>


            {/* 댓글 */}
            <div>
                <hr />
                <div style={{ maxWidth: "2000px", width: "50%", margin: "0 auto" }}>
                    {/* useState 사용해서 운영자가 신고 승인한 댓글 출력(공백)할 때마다 갯수 줄이기 */}
                    {/* <p>댓글 {logCommentList.length + logReplyList.length - disableCommentCount}개</p> */}
                    <p>댓글 <b style={{color: "#1976D2"}}>{logCommentList.length + logReplyList.length}</b> 개</p>
                    {/* 댓글 리스트 div 시작 */}
                    <div>
                        {logCommentList.length == 0 && logReplyList.length == 0 ? (
                            <div>
                                <p>등록된 댓글이 없습니다.</p>
                                <hr />
                            </div>
                        ) : (
                            logCommentList.map((comment) => {
                                const now = new Date();
                                // 24시간을 밀리초로 변환한 값
                                const twentyFourHours = 24 * 60 * 60 * 1000;
                                const commentTime = new Date(comment.logCommentRegDate);
                                const commentTimeDiff = now - commentTime;
                                let commentDisplayTime;
                                if (commentTimeDiff < twentyFourHours) {
                                    const hoursAgo = Math.floor(commentTimeDiff / (60 * 60 * 1000));
                                    commentDisplayTime = `${hoursAgo} 시간 전`;
                                } else {
                                    const year = commentTime.getFullYear();
                                    const month = String(commentTime.getMonth() + 1).padStart(2, '0');
                                    const day = String(commentTime.getDate()).padStart(2, '0');
                                    commentDisplayTime = `${year}.${month}.${day}`;
                                }

                                let resultComment = "";
                                // 신고 처리 조건
                                const limitCount = 3;

                                const reportComment = commentReportInfo.find(report => report.reportTableIdx == comment.logCommentIdx);
                                // 운영자가 신고 승인한 댓글(비워두기) 운영자가 승인하면 logCommentIsActive = 0으로 변경됨
                                if (reportComment && comment.logCommentIsActive == 0) {
                                    resultComment = (
                                        <div key={comment.logCommentIdx}>
                                            {/* 댓글 공백 또는 텍스트 처리 */}
                                            <p>신고 승인 처리된 댓글 입니다.</p>
                                        </div>
                                    );
                                }

                                // 현재 로그인한 유저의 idx == 댓글 신고한 유저 idx 일 때
                                if (reportComment && reportComment.userIdx == user.userIdx) {
                                    return (
                                        <div key={comment.logCommentIdx}>
                                            <p>신고하신 댓글 입니다.</p>
                                            <hr />
                                        </div>
                                    );
                                }

                                // 신고 횟수 3회 이상이면 모든 유저에게 신고된 댓글로 표시
                                if (reportComment && comment.logCommentIsActive != 0 && reportComment.reportCount >= limitCount) {
                                    resultComment = (
                                        <div key={comment.logCommentIdx}>
                                            <p>신고된 댓글 입니다.</p>
                                            <hr />
                                        </div>
                                    );
                                }

                                // 한번도 신고되지 않았거나 신고 당한 횟수가 limitCount 미만인 댓글 출력
                                if (reportComment == null || reportComment.reportCount < limitCount) {
                                    resultComment = (
                                        <div key={comment.logCommentIdx}>
                                            {/* 댓글만 출력 */}
                                            {comment.logCommentIsActive == 1 && comment.logCommentIsDelete == 0 ? (
                                                <>
                                                    <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0", alignItems: "center" }}>
                                                        {/* 유저 아바타 */}
                                                        <Avatar />
                                                        {/* 유저 닉네임 */}
                                                        <span style={{ flexGrow: "1", marginLeft: "20px" }}>
                                                            <a>{userNickname[comment.userIdx]}</a>
                                                        </span>
                                                        <div>
                                                            <a style={{ marginRight: "30px" }}>
                                                                {/* 오늘로부터 시간 계산 24시간내에 범위면 ~시간 전, 24시간 넘으면 날짜 */}
                                                                {commentDisplayTime}
                                                            </a>
                                                            {/* 댓글 작성자면 삭제, 아니면 신고버튼 보이게하기 */}
                                                            {user && comment.userIdx == user.userIdx ?
                                                                (<IconButton onClick={() => handleModalClick(comment, "delete")}><Delete /></IconButton>) :
                                                                (<IconButton onClick={() => handleModalClick(comment, "report")}><img src='/images/siren-siren-svgrepo-com.svg' style={{ width: "30px" }} /></IconButton>)
                                                            }
                                                        </div>
                                                    </div>
                                                    {/* 댓글 내용 가져오기 */}
                                                    <div>
                                                        <p style={{ margin: "0 50px" }}>
                                                            {comment.logCommentContent}
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: "right" }}>
                                                        <Button style={{ width: "80px", height: "30px", padding: "0" }} variant='contained' color='primary'
                                                            onClick={() => user == null ? alert("로그인 후 작성 가능합니다.") : replyWrite(comment.logCommentIdx)}
                                                        >답글 작성</Button>
                                                    </div>
                                                    <hr />
                                                </>
                                            ) : (
                                                <div>
                                                    <p>삭제된 댓글 입니다.</p>
                                                    <hr />
                                                </div>
                                            )
                                            }
                                        </div>
                                    );
                                }

                                return (
                                    <div key={comment.logCommentIdx}>
                                        {resultComment}
                                        {/* 댓글에 해당하는 답글들 */}
                                        {
                                            logReplyList
                                                .filter((reply) => reply.commentIdx === comment.logCommentIdx) // 해당 댓글에 대한 답글만 필터링
                                                .map((reply) => {
                                                    const replyTime = new Date(reply.logCommentRegDate);
                                                    const replyTimeDiff = now - replyTime;
                                                    let replyDisplayTime;
                                                    if (replyTimeDiff < twentyFourHours) {
                                                        const hoursAgo = Math.floor(replyTimeDiff / (60 * 60 * 1000));
                                                        replyDisplayTime = `${hoursAgo} 시간 전`;
                                                    } else {
                                                        const year = replyTime.getFullYear();
                                                        const month = String(replyTime.getMonth() + 1).padStart(2, '0');
                                                        const day = String(replyTime.getDate()).padStart(2, '0');
                                                        replyDisplayTime = `${year}.${month}.${day}`;
                                                    }

                                                    const reportReply = commentReportInfo.find(report => report.reportTableIdx == reply.logCommentIdx);

                                                    // 운영자가 신고 승인한 답글(비워두기)
                                                    if (reportReply && reply.logCommentIsActive == 0) {
                                                        return (
                                                            <div key={reply.logCommentIdx} style={{ marginLeft: '50px' }}>
                                                                {/* 답글 공백 */}
                                                                <p>신고 승인 처리된 답글 입니다.</p>
                                                                <hr />
                                                            </div>
                                                        );
                                                    }

                                                    // 현재 로그인한 유저의 idx == 해당 답글 신고한 유저 idx 일 때
                                                    if (reportReply && reportReply.userIdx == user.userIdx) {
                                                        return (
                                                            <div key={reply.logCommentIdx} style={{ marginLeft: '50px' }}>
                                                                <p>신고하신 답글 입니다.</p>
                                                                <hr />
                                                            </div>
                                                        );
                                                    }

                                                    // 신고 횟수 3회 이상이면 모든 유저에게 신고된 답글로 표시
                                                    // console.log(`reportIdx : ${reportReply.logCommentIdx} ,reportCount : ${reportReply.reportCount}`);
                                                    if (reportReply && reply.logCommentIsActive != 0 && reportReply.reportCount >= limitCount) {
                                                        return (
                                                            <div key={reply.logCommentIdx} style={{ marginLeft: '50px' }}>
                                                                <p>신고된 답글 입니다.</p>
                                                                <hr />
                                                            </div>
                                                        );
                                                    }

                                                    // 한번도 신고되지 않은 답글들 출력
                                                    if (reportReply == null || reportReply.reportCount < limitCount) {
                                                        return (
                                                            <div key={reply.logCommentIdx}>
                                                                {reply.logCommentIsActive == 1 && reply.logCommentIsDelete == 0 ? (
                                                                    // 답글 depth를 marginLeft으로 줌
                                                                    <div style={{ marginLeft: '50px' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "20px 0" }}>
                                                                            <a style={{ marginRight: "20px" }}>ㄴ</a>
                                                                            <Avatar />
                                                                            <span style={{ flexGrow: '1', marginLeft: '20px' }}>
                                                                                <a>{userNickname[reply.userIdx]}</a>
                                                                            </span>
                                                                            <div>
                                                                                <a style={{ marginRight: '30px' }}>
                                                                                    {replyDisplayTime}
                                                                                </a>
                                                                                {user && reply.userIdx == user.userIdx ?
                                                                                    (<IconButton onClick={() => handleModalClick(reply, "delete")}><Delete /></IconButton>) :
                                                                                    (<IconButton onClick={() => handleModalClick(reply, "report")}><img src="/images/siren-siren-svgrepo-com.svg" style={{ width: '30px' }} /></IconButton>)
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <p style={{ margin: '0 80px' }}>
                                                                                {reply.logCommentContent}
                                                                            </p>
                                                                        </div>
                                                                        <hr />
                                                                    </div>
                                                                ) : (
                                                                    <div style={{ marginLeft: '50px' }}>
                                                                        <p>삭제된 답글 입니다.</p>
                                                                        <hr />
                                                                    </div>
                                                                )
                                                                }
                                                            </div>
                                                        );
                                                    }

                                                })}
                                        {/* 답글 작성 필드 */}
                                        {
                                            isShow && (commentIdx == comment.logCommentIdx) && (
                                                <>
                                                    <div>
                                                        <TextField label="답글 작성"
                                                            name='logReplyContent'
                                                            value={logReplyContent}
                                                            // onChange={replyChange}
                                                            onChange={(e) => setLogReplyContent(e.target.value)}
                                                            fullWidth
                                                            multiline
                                                            maxRows={5}
                                                            margin="normal"
                                                            inputRef={replyTextFieldRef}  // TextField에 ref 연결
                                                        />
                                                    </div>
                                                    <div style={{ marginTop: "20px", textAlign: "right" }}>
                                                        <Button
                                                            variant='contained'
                                                            color='primary'
                                                            onClick={replySubmit}
                                                        // disabled={!isFormValid}
                                                        >등록</Button>
                                                    </div>
                                                    <hr />
                                                </>
                                            )
                                        }
                                    </div>
                                )
                            })
                        )}
                    </div>
                    {/* 댓글 리스트 div 끝 */}
                    {/* 댓글 작성 필드 */}
                    <div>
                        <h5>댓글 작성</h5>
                        <TextField label="댓글 작성"
                            name='logCommentContent'
                            value={logCommentContent}
                            // onChange={commentChange}
                            onChange={(e) => setLogCommentContent(e.target.value)}
                            fullWidth
                            multiline
                            maxRows={5}
                            margin="normal"
                        />
                    </div>
                    {/* 댓글 등록 버튼 */}
                    <div style={{ marginTop: "20px", textAlign: "right" }}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => user == null ? alert("로그인 후 등록 가능합니다.") : commentSubmit(selectedComment)}
                        // disabled={!isFormValid}
                        >등록</Button>
                    </div>
                </div>

                {/* 삭제 모달 */}
                <Modal
                    open={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    aria-labelledby="commentDeleteModal"
                    aria-describedby="commentDeleteModal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '300px',
                            height: '270px',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            borderRadius: "10px",
                            p: 4,
                            overflowY: 'auto', // 스크롤 기능 추가
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <Report sx={{ fontSize: "100px", color: "#FA5858" }} />
                            <h4 style={{ textAlign: "center", marginTop: "10px" }}>삭제 하시겠습니까?</h4>
                            <div style={{ marginTop: "30px", textAlign: "right", display: "flex", justifyContent: "space-between" }}>
                                <Button
                                    variant='contained'
                                    color='inherit'
                                    onClick={() => setDeleteModalOpen(false)}
                                    style={{ width: "100px", marginRight: "20px" }}
                                >닫기</Button>
                                <Button
                                    variant='contained'
                                    color='error'
                                    onClick={() => selectedComment === "" ? handleLogDelete() : commentDelete(selectedComment)}
                                    style={{ width: "100px" }}
                                >삭제</Button>
                            </div>
                        </div>
                    </Box>
                </Modal>
                {/* 신고 모달 */}
                <Modal
                    open={isReportModalOpen}
                    // onClose={() => setReportModalOpen(false)}
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
                            height: '80%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            overflowY: 'auto', // 스크롤 기능 추가
                        }}
                    >
                        {/* 신고 내용 */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h4 style={{ margin: "0" }}>신고하기</h4>
                                <IconButton onClick={() => setReportModalOpen(false)}><Close /></IconButton>
                            </div>
                            <hr />
                            {
                                selectedComment === "" ?
                                    (<>
                                        <p style={{ marginBottom: "10px" }}><b>후기 글 작성자</b> : {logWriterNickname}</p>
                                    </>)
                                    :
                                    (<>
                                        <p style={{ marginBottom: "10px" }}><b>댓글 작성자</b> : {userNickname[selectedComment.userIdx]}</p>
                                        <p><b>댓글 내용</b> : {selectedComment.logCommentContent}</p>
                                    </>)
                            }
                            <hr />
                            <h5>신고사유</h5>
                            <RadioGroup aria-label="complaint" name="commentReport" value={reportCategory} onChange={reportRadioChange}>
                                <FormControlLabel value="스팸홍보 / 도배글 입니다." control={<Radio size='small' />} label="스팸홍보 / 도배글 입니다." />
                                <FormControlLabel value="음란물 입니다." control={<Radio size='small' />} label="음란물 입니다." />
                                <FormControlLabel value="불법정보를 포함하고 있습니다." control={<Radio size='small' />} label="불법정보를 포함하고 있습니다." />
                                <FormControlLabel value="청소년에게 유해한 내용입니다." control={<Radio size='small' />} label="청소년에게 유해한 내용입니다." />
                                <FormControlLabel value="욕설/생명경시/혐오/차별적 표현입니다." control={<Radio size='small' />} label="욕설/생명경시/혐오/차별적 표현입니다." />
                                <FormControlLabel value="개인정보 노출 게시물 입니다." control={<Radio size='small' />} label="개인정보 노출 게시물 입니다." />
                                <FormControlLabel value={"불쾌한 표현이 있습니다."} control={<Radio size='small' />} label="불쾌한 표현이 있습니다." />
                            </RadioGroup>
                            <hr />
                            <h6>상세 내용</h6>
                            <TextField label="신고 내용"
                                name='reportContent'
                                value={reportContent}
                                onChange={reportContentChange}
                                fullWidth
                                multiline
                                maxRows={5}
                                margin="normal"
                            />
                            <div style={{ marginTop: "20px", textAlign: "right" }}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    // onClick={() => commentReport(selectedComment)}
                                    onClick={() => selectedComment === "" ? logReport() : commentReport(selectedComment)}
                                    fullWidth
                                >신고하기</Button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>

    );
}

export default Page;