"use client"
import React, { useEffect, useState } from 'react';
import AdminList from '../../AdminList';
import CurrentTime from '../../CurrentTime';
import { Box, Button } from '@mui/material';

function Page(row) {

    const imgUrl = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const [formData, setFormData] = useState({
        userNickname: "",
        qnaRegDate: "",
        qnaSubject: "",
        qnaFile: "",
        qnaContent: "",
        qnaReSubject: "",
        qnaReContent: "",
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
        // 서버로 데이터를 전송하거나 추가 로직을 작성합니다.
    };
    return (
        <Box position="relative" display="flex">
            {/* 좌측 네비게이션 메뉴 */}
            <AdminList />

            {/* 우측 컨텐츠 */}
            <Box flex={1} p={3}>
                {/* 상단 현재 시간 */}
                <CurrentTime />

                <Box
                    sx={{
                        marginLeft: 'auto',
                        marginBottom: '50px'
                    }}
                >
                    <Button

                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => { }}
                    >
                        정보 최신화
                    </Button>
                </Box>


                <div style={{ padding: "20px", margin: "auto", border: "1px solid #ddd", borderRadius: "8px" }}>
                    <h3>캠핑장 정보</h3>
                    <form onSubmit={handleSubmit}>
                        {Object.entries(formData).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: "10px" }}>
                                <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                                    {key === "userNickname" ? "닉네임" :
                                        key === "qnaRegDate" ? "질문 등록일" :
                                            key === "qnaSubject" ? "질문 제목" :
                                                key === "qnaFile" ? "첨부파일" :
                                                    key === "qnaContent" ? "질문 내용" :
                                                        key === "qnaReSubject" ? "답변 제목" :
                                                            key === "qnaReContent" ? "답변 내용" :
                                                                key}
                                </label>
                                {key === "qnaContent" || key === "qnaReContent" ? (
                                    <textarea
                                        name={key}
                                        value={value}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                        rows="4"
                                    />
                                ) : key === "qnaFile" ? (
                                    <img
                                        src={`${imgUrl}/${value}`}
                                        alt="Uploaded file"
                                        style={{ width: "100%", borderRadius: "4px", border: "1px solid #ccc", objectFit: "contain" }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={key}
                                        value={value}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                padding: "10px 15px",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            정보 수정
                        </button>

                    </form>
                </div>
            </Box>
        </Box>
    );
}

export default Page;