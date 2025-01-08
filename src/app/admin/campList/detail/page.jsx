"use client"
import React, { useEffect, useState } from 'react';
import AdminList from '../../AdminList';
import CurrentTime from '../../CurrentTime';
import { Box, Button } from '@mui/material';

function Page(row) {


    const [formData, setFormData] = useState({
        campIdx: "",
        contentId: "",
        facltNm: "",
        lineIntro: "",
        intro: "",
        insrncAt: "",
        trsagntNo: "",
        facltDivNm: "",
        manageSttus: "",
        featureNm: "",
        induty: "",
    });

    // useEffect(() => {
    //     if (row) {
    //         setFormData({
    //             campIdx: row.campIdx || "",
    //             contentId: row.contentId || "",
    //             facltNm: row.facltNm || "",
    //             lineIntro: row.lineIntro || "",
    //             intro: row.intro || "",
    //             insrncAt: row.insrncAt || "",
    //             trsagntNo: row.trsagntNo || "",
    //             facltDivNm: row.facltDivNm || "",
    //             manageSttus: row.manageSttus || "",
    //             featureNm: row.featureNm || "",
    //             induty: row.induty || "",
    //         });
    //     }
    // }, [row]);

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
                                    {key === "campIdx" ? "캠핑장 고유번호" :
                                        key === "contentId" ? "콘텐츠 ID" :
                                            key === "facltNm" ? "야영장명" :
                                                key === "lineIntro" ? "한줄 소개" :
                                                    key === "intro" ? "소개" :
                                                        key === "insrncAt" ? "영업배상책임보험가입" :
                                                            key === "trsagntNo" ? "관광사업자번호" :
                                                                key === "facltDivNm" ? "사업 주체. 구분" :
                                                                    key === "manageSttus" ? "운영상태.관리상태" :
                                                                        key === "featureNm" ? "특징" :
                                                                            key === "induty" ? "업종" :
                                                                                key}
                                </label>
                                {key === "intro" ? (
                                    <textarea
                                        name={key}
                                        value={value}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                        rows="4"
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