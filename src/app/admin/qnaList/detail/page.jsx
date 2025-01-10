"use client"
import React, { useEffect, useState } from 'react';
import AdminList from '../../AdminList';
import CurrentTime from '../../CurrentTime';
import { Box, Button } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

function Page(row) {
    const LOCAL_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const [formData, setFormData] = useState({
        qnaIdx: "",
        userNickname: "",
        qnaRegDate: "",
        qnaSubject: "",
        qnaFile: "",
        qnaContent: "",
        qnaReSubject: "",
        qnaReContent: "",
    });

    const qnaIdx = useSearchParams().get("qnaIdx");

    useEffect(() => {
        axios.get(`${LOCAL_URL}/admin/getQnaDetail?qnaIdx=${qnaIdx}`)
            .then((res) => {
                console.log(res.data)
                const datas = res.data.data;
                const excludedKeys = ["userIdx", "qnaReRegDate", "qnaStatus",
                    "qnaEtc01", "qnaEtc02",
                ];

                const filteredData = Object.fromEntries(
                    Object.entries(datas).filter(([key]) => !excludedKeys.includes(key))
                )
                setFormData(filteredData)
            })
            .catch((err) => console.log(err))
    }, [qnaIdx])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
        axios.put(`${LOCAL_URL}/admin/updateQna`, formData)
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    alert(res.data.message);
                    router.push('/admin/qnaList')
                } else {
                    alert(res.data.message);

                }
            })
            .catch((err) => console.log(err))
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
                </Box>


                <div style={{ padding: "20px", margin: "auto", border: "1px solid #ddd", borderRadius: "8px" }}>
                    <h3>QNA 정보</h3>
                    {formData &&
                        <form onSubmit={handleSubmit}>
                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                                닉네임
                            </label>
                            <input
                                type="text"
                                name='userNickname'
                                value={formData.userNickname}
                                disabled
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                            />

                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                                질문 제목
                            </label>
                            <input
                                type="text"
                                name='qnaSubject'
                                value={formData.qnaSubject}
                                disabled
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                            />

                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                                첨부파일
                            </label>
                            {formData.qnaFile ?
                                <img
                                    alt={formData.qnaFile}
                                    src={`${imgUrl}/qna/${formData.qnaFile}`}
                                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                />
                                :
                                <p>첨부 파일 없음</p>
                            }

                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                                질문 내용
                            </label>
                            <textarea
                                name='qnaContent'
                                value={formData.qnaContent}
                                disabled
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                rows="4"
                            />

                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                                답변 제목
                            </label>
                            <input
                                type="text"
                                name='qnaReSubject'
                                value={formData.qnaReSubject || ''}
                                onChange={handleChange}
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                            />

                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                                답변 내용
                            </label>
                            <textarea
                                name='qnaReContent'
                                value={formData.qnaReContent || ''}
                                onChange={handleChange}
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                rows="4"
                            />
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
                                답변 완료
                            </button>

                        </form>
                    }
                </div>
            </Box>
        </Box>
    );
}

export default Page;