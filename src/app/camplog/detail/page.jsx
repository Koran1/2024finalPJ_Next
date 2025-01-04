"use client";
import { Label } from '@mui/icons-material';
import { Avatar, Box, Button, FormControlLabel, IconButton, Modal, Pagination, Radio, RadioGroup, TextField } from '@mui/material';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import useAuthStore from '../../../../store/authStore';

function Page(props) {
    const { user } = useAuthStore(); // authStore에서 사용자 정보 가져오기
    const userIdx = user?.userIdx; // userIdx 추출
    const logIdx = useSearchParams().get('logIdx');
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [logCommentList, setLogCommentList] = useState([]);       // 댓글 리스트
    const [logReplyList, setLogReplyList] = useState([]);       // 답글 리스트
    const [userNickname, setUserNickname] = useState([]);           // 유저 닉네임
    const [commentReportInfo, setReportInfo] = useState([]);       // 댓글 신고 정보(승인여부, 횟수)
    const [logCommentContent, setLogCommentContent] = useState(""); // 댓글 내용
    const [logReplyContent, setLogReplyContent] = useState("");     // 답글 내용
    const [commentIdx, setCommentIdx] = useState("");              // 답글의 부모 댓글 인덱스
    const [isShow, setIsShow] = useState(false);                    // 답글 작성 필드 보이기 여부
    const isWriter = false;                                         // 작성자 여부
    const [loading, setLoading] = useState(false);                  // 로딩
    const [error, setError] = useState(null);                       // 에러
    const replyTextFieldRef = useRef(null);                         // 답글 작성 필드 포커스하기 위한 ref
    const [isModalOpen, setModalOpen] = useState(false);            // 모달 창 열기
    const [selectedComment, setSelectedComment] = useState("");     // 선택된 댓글 정보
    const [reportCategory, setReportCategory] = useState("스팸홍보 / 도배글 입니다."); // 신고 사유 선택 값
    const [reportContent, setReportContent] = useState("");         // 신고 내용
    const [disableCommentCount, setDisableCommentCount] = useState(0); // 공백인 댓글(운영자가 신고 승인한 댓글) 개수

    // 댓/답글 불러오기
    const getCommentList = async () => {
        try {
            setLoading(true);
            const API_URL = `${LOCAL_API_BASE_URL}/camplog/commentList?logIdx=${logIdx}`;
            await axios.get(API_URL)
            .then((res) => {
                console.log(res.data.data.rvo);
                const commentsList = res.data.data.lcvo.filter(comment => !comment.commentIdx);
                const replysList = res.data.data.lcvo.filter(comment => comment.commentIdx);
                console.log(commentsList);
                console.log(replysList);
                setLogCommentList(commentsList);
                setLogReplyList(replysList);
                setUserNickname(res.data.data.userNicknameMap);
                setReportInfo(res.data.data.rvo);

                // 공백인 댓글(운영자가 신고 승인한 댓글) 개수
                setDisableCommentCount (res.data.data.lcvo.filter(comment => comment.logCommentIsActive == 0).length);
            })
            .catch((err) => console.log(err));        
        } catch (error) {
            alert("댓글 리스트 불러오기 오류 : " + error);
        } finally {
            setLoading(false);
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
        const API_URL = `${LOCAL_API_BASE_URL}/camplog/commentWrite`;
        const data = new FormData();
        try {
            data.append("logIdx", logIdx);
            data.append("logCommentContent", logCommentContent);

            console.log(data.get("logIdx"));
            console.log(data.get("logCommentContent"));
            // 서버에 저장
            await axios.post(API_URL, data);

            // 페이지 새로 고침
            window.location.reload(); // 페이지 새로 고침
        } catch (error) {
            alert("댓글 등록 오류 : " + error);
        }
    };

    // 답글 작성 버튼
    const replyWrite = (commIdx) => {
        // 로딩 후 처음 클릭 시 실행
        if(commentIdx == "") {setIsShow(!isShow)};
        // 클릭한 댓글의 답글 작성필드가 열려 있을 경우
        if(commentIdx == commIdx) {setIsShow(!isShow)};
        // 클릭한 댓글의 답글 작성필드가 닫혀 있을 경우
        if(commentIdx != commIdx) {setCommentIdx(commIdx)};
    }
    
    const replySubmit = async () => {
        const API_URL = `${LOCAL_API_BASE_URL}/camplog/commentWrite`;
        const data = new FormData();
        try {
            data.append("logIdx", logIdx);
            data.append("userIdx", userIdx);
            data.append("logCommentContent", logReplyContent);
            data.append("commentIdx", commentIdx);

            // 서버에 저장
            await axios.post(API_URL, data);

            // 페이지 새로 고침
            window.location.reload(); // 페이지 새로 고침
        } catch (error) {
            setError("Error reply data:", error);
            // alert("답글 등록 오류 : " + error);
        }
    };

    const commentDelete = async (comm) => {
        const API_URL = `${LOCAL_API_BASE_URL}/camplog/commentDelete`;
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

    const handleReportClick = (comment) => {
        // 신고 버튼 클릭 시, 해당 댓글 정보를 모달에 전달
        setSelectedComment(comment);
        setModalOpen(true);
    };

    const reportRadioChange = (e) => {
        setReportCategory(e.target.value);
    }

    const reportContentChange = (e) => {
        setReportContent(e.target.value);
    }

    const commentReport = async (comm) => {
        const API_URL = `${LOCAL_API_BASE_URL}/camplog/commentReport`;
        const data = new FormData();
        try {
            data.append("userIdx", userIdx);
            data.append("reportTableIdx", comm.logCommentIdx);
            data.append("reportCategory", reportCategory);
            data.append("reportContent", reportContent);

            // 서버에 저장
            await axios.post(API_URL, data);

            // 페이지 새로 고침
            window.location.reload(); // 페이지 새로 고침
        } catch (error) {
            alert("댓/답글 신고 오류 : " + error);
        }
    };

    // 데이터 가져올 때 로딩
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{color:'red'}}>{error}</div>
    }

    return (
        <div>
            <h1>이곳은 캠핑로그 상세 페이지(댓글) 입니다.</h1>
            <h2>userIdx : {userIdx}</h2>

            <hr />
            <div style={{maxWidth: "2000px", width:"80%", margin: "0 auto"}}>
                {/* useState 사용해서 운영자가 신고 승인한 댓글 출력(공백)할 때마다 갯수 줄이기 */}
                <p>댓글 {logCommentList.length + logReplyList.length - disableCommentCount}개</p>
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
                            if (comment.logCommentIsActive == 0) {
                                resultComment = (
                                    <div key={comment.logCommentIdx}>
                                        {/* 댓글 공백 */}
                                    </div>
                                );
                            }

                            // 현재 로그인한 유저의 idx == 신고한 유저 idx 일 때
                            // if (reportComment && reportComment.userIdx == userIdx) {
                            //     return (
                            //         <div key={comment.logCommentIdx}>
                            //             <p>신고하신 댓글 입니다.</p>
                            //             <hr />
                            //         </div>
                            //     );
                            // }

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
                                        {comment.logCommentIsActive == 1 ? (
                                            <>
                                                <div style={{display: "flex", justifyContent: "space-between", margin: "20px 0", alignItems: "center"}}>
                                                    {/* 유저 아바타 */}
                                                    <Avatar />
                                                    {/* 유저 닉네임 */}
                                                    <span style={{flexGrow: "1", marginLeft: "20px"}}>
                                                        <a>{userNickname[comment.userIdx]}</a>
                                                    </span>
                                                    <div>
                                                        <a style={{marginRight: "30px"}}>
                                                            {/* 오늘로부터 시간 계산 24시간내에 범위면 ~시간 전, 24시간 넘으면 날짜 */}
                                                            {commentDisplayTime}
                                                        </a>
                                                        {/* 댓글 작성자면 삭제, 아니면 신고버튼 보이게하기 */}
                                                        {/* { reportComment.userIdx == userIdx ?  */}
                                                        { isWriter ? 
                                                            (<Button color='error' onClick={() => commentDelete(comment)}>삭제</Button>):
                                                            (<IconButton onClick={() => handleReportClick(comment)}><img src='/images/siren-siren-svgrepo-com.svg' style={{width: "30px"}} /></IconButton>)
                                                        }
                                                    </div>
                                                </div>
                                                {/* 댓글 내용 가져오기 */}
                                                <div>
                                                    <p style={{margin: "0 50px"}}>
                                                        {comment.logCommentContent}
                                                    </p>
                                                </div>
                                                <div style={{textAlign: "right"}}>
                                                    <Button style={{width: "80px", height: "30px", padding: "0"}} variant='contained' color='primary' onClick={() => replyWrite(comment.logCommentIdx)}
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
                                                    <div key={comment.logCommentIdx}>
                                                        {/* 답글 공백 */}
                                                    </div>
                                                );
                                            }

                                            // 현재 로그인한 유저의 idx == 신고한 유저 idx 일 때
                                            // if (reportReply && reportReply.userIdx == userIdx) {
                                            //     return (
                                            //         <div key={comment.logCommentIdx} style={{ marginLeft: '30px' }}>
                                            //             <p>신고하신 답글 입니다.</p>
                                            //             <hr />
                                            //         </div>
                                            //     );
                                            // }

                                            // 신고 횟수 3회 이상이면 모든 유저에게 신고된 답글로 표시
                                            // console.log(`reportIdx : ${reportReply.logCommentIdx} ,reportCount : ${reportReply.reportCount}`);
                                            if (reportReply && reply.logCommentIsActive != 0 && reportReply.reportCount >= limitCount) {
                                                return (
                                                    <div key={comment.logCommentIdx} style={{ marginLeft: '30px' }}>
                                                        <p>신고된 답글 입니다.</p>
                                                        <hr />
                                                    </div>
                                                );
                                            }

                                            // 한번도 신고되지 않은 답글들 출력
                                            if (reportReply == null || reportReply.reportCount < limitCount) {
                                                return (
                                                    <div key={reply.logCommentIdx}>
                                                        {reply.logCommentIsActive == 1 ? (
                                                            // 답글 depth를 marginLeft으로 줌
                                                            <div style={{ marginLeft: '30px' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "20px 0"}}>
                                                                    <a style={{marginRight: "20px"}}>ㄴ</a>
                                                                    <Avatar />
                                                                    <span style={{ flexGrow: '1', marginLeft: '20px' }}>
                                                                        <a>{userNickname[reply.userIdx]}</a>
                                                                    </span>
                                                                    <div>
                                                                        <a style={{ marginRight: '30px' }}>
                                                                            {replyDisplayTime}
                                                                        </a>
                                                                        {/* {reportReply.userIdx == userIdx ?  */}
                                                                        {isWriter ? 
                                                                            (<Button color="error" onClick={() => commentDelete(reply)}>삭제</Button>) : 
                                                                            (<IconButton onClick={() => handleReportClick(reply)}><img src="/images/siren-siren-svgrepo-com.svg" style={{ width: '30px' }} /></IconButton>)
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
                                                                <div style={{ marginLeft: '30px' }}>
                                                                    <p >삭제된 답글 입니다.</p>
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
                                                        name='logCommentContent'
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
                                                <div style={{marginTop:"20px", textAlign:"right"}}>
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

                {/* 모달 */}
                <Modal
                    open={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="commentReportModal"
                    aria-describedby="commentReportModal-description"
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
                            <h4>신고하기</h4>
                            <hr />
                            <p style={{marginBottom: "10px"}}><b>댓글 작성자</b> : {userNickname[selectedComment.userIdx]}</p>
                            <p><b>댓글 내용</b> : {selectedComment.logCommentContent}</p>
                            <hr />
                            <h5>신고사유</h5>
                            <RadioGroup aria-label="complaint" name="commentReport" value={reportCategory} onChange={reportRadioChange}>
                                <FormControlLabel value="스팸홍보 / 도배글 입니다." control={<Radio size='small' />} label="스팸홍보 / 도배글 입니다." />
                                <FormControlLabel value="음란물 입니다." control={<Radio size='small' />} label="음란물 입니다." />
                                <FormControlLabel value="불법정보를 포함하고 있습니다." control={<Radio size='small' />} label="불법정보를 포함하고 있습니다." />
                                <FormControlLabel value="청소년에게 유해한 내용입니다."  control={<Radio size='small' />} label="청소년에게 유해한 내용입니다." />
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
                            <div style={{marginTop:"20px", textAlign:"right"}}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={() => commentReport(selectedComment)}
                                    fullWidth
                                >신고하기</Button>
                            </div>
                        </div>
                    </Box>
                </Modal>

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
                <div style={{marginTop:"20px", textAlign:"right"}}>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={() => commentSubmit(selectedComment)}
                        // disabled={!isFormValid}
                    >등록</Button>
                </div>
            </div>
        </div>
    );
}

export default Page;