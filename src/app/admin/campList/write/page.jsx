"use client"
import React, { useEffect, useState } from 'react';
import AdminList from '../../AdminList';
import CurrentTime from '../../CurrentTime';
import { Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function Page() {
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const initState = {
        contentId: 0,
        facltNm: "",
        lineIntro: "",
        intro: "",
        insrncAt: "",
        trsagntNo: "",
        bizrno: "",
        facltDivNm: "",
        manageSttus: "",
        hvofBgnde: "",
        hvofEnddle: "",
        featureNm: "",
        induty: "",
        lctCl: "",
        doNm: "",
        regionCode: 0,
        sigunguNm: "",
        addr1: "",
        mapY: "",
        mapX: "",
        tel: "",
        homepage: "",
        resveUrl: "",
        resveCl: "",
        gnrlSiteCo: 0,
        autoSiteCo: 0,
        glampSiteCo: 0,
        caravSiteCo: 0,
        indvdlCaravSiteCo: 0,
        sitedStnc: 0,
        siteMg1Width: 0,
        siteMg2Width: 0,
        siteMg3Width: 0,
        siteMg1Vrticl: 0,
        siteMg2Vrticl: 0,
        siteMg3Vrticl: 0,
        siteMg1Co: 0,
        siteMg2Co: 0,
        siteMg3Co: 0,
        siteBottomCl1: 0,
        siteBottomCl2: 0,
        siteBottomCl3: 0,
        siteBottomCl4: 0,
        siteBottomCl5: 0,
        glampInnerFclty: "",
        caravInnerFclty: "",
        prmisnDe: "",
        operPdCl: "",
        operDeCl: "",
        trlerAcmpnyAt: "",
        caravAcmpnyAt: "",
        toiletCo: 0,
        swrmCo: 0,
        wtrplCo: 0,
        brazierCl: "",
        sbrsCl: "",
        sbrsEtc: "",
        posblFcltyCl: "",
        posblFcltyEtc: "",
        extshrCo: 0,
        frprvtWrppCo: 0,
        frprvtSandCo: 0,
        fireSensorCo: 0,
        themaEnvrnCl: "",
        eqpmnLendCl: "",
        animalCmgCl: "",
        tourEraCl: "",
        firstImageUrl: "",
        campImg2: "",
        campImg3: "",
        campImg4: "",
        campImg5: "",
        campImg6: "",
        createdtime: "",
        modifiedtime: "",
        campView: 0,
        campActive: "",
    };
    const labels = {
        contentId: "콘텐츠 ID",
        facltNm: "야영장명",
        lineIntro: "한줄 소개",
        intro: "소개",
        insrncAt: "영업배상책임보험가입",
        trsagntNo: "관광사업자번호",
        bizrno: "사업자번호",
        facltDivNm: "사업 주체. 구분",
        manageSttus: "운영상태.관리상태",
        hvofBgnde: "휴장기간.휴무기간 시작일",
        hvofEnddle: "휴장기간.휴무기간 종료일",
        featureNm: "특징",
        induty: "업종",
        lctCl: "입지구분",
        doNm: "도",
        regionCode: "지역코드",
        sigunguNm: "시군구",
        addr1: "주소",
        mapY: "위도",
        mapX: "경도",
        tel: "전화",
        homepage: "홈페이지",
        resveUrl: "예약 페이지",
        resveCl: "예약 구분",
        gnrlSiteCo: "주요시설 일반야영장",
        autoSiteCo: "주요시설 자동차야영장",
        glampSiteCo: "주요시설 글램핑",
        caravSiteCo: "주요시설 카라반",
        indvdlCaravSiteCo: "주요시설 개인 카라반",
        sitedStnc: "사이트간 거리",
        siteMg1Width: "사이트 크기1 가로",
        siteMg2Width: "사이트 크기2 가로",
        siteMg3Width: "사이트 크기3 가로",
        siteMg1Vrticl: "사이트 크기1 세로",
        siteMg2Vrticl: "사이트 크기2 세로",
        siteMg3Vrticl: "사이트 크기3 세로",
        siteMg1Co: "사이트 크기1 수량",
        siteMg2Co: "사이트 크기2 수량",
        siteMg3Co: "사이트 크기3 수량",
        siteBottomCl1: "잔디",
        siteBottomCl2: "파쇄석",
        siteBottomCl3: "테크",
        siteBottomCl4: "자갈",
        siteBottomCl5: "맨흙",
        glampInnerFclty: "글램핑 - 내부시설",
        caravInnerFclty: "카라반 - 내부시설",
        prmisnDe: "인허가일자",
        operPdCl: "운영기간",
        operDeCl: "운영일",
        trlerAcmpnyAt: "개인 트레일러 동반 여부(Y:사용, N:미사용)",
        caravAcmpnyAt: "개인 카라반 동반 여부(Y:사용, N:미사용)",
        toiletCo: "화장실 개수",
        swrmCo: "샤워실 개수",
        wtrplCo: "개수대 개수",
        brazierCl: "화로대",
        sbrsCl: "부대시설",
        sbrsEtc: "부대시설 기타",
        posblFcltyCl: "주변이용가능시설",
        posblFcltyEtc: "주변이용가능시설 기타",
        extshrCo: "소화기 개수",
        frprvtWrppCo: "방화수 개수",
        frprvtSandCo: "방화사 개수",
        fireSensorCo: "화재감지기 개수",
        themaEnvrnCl: "테마환경",
        eqpmnLendCl: "캠핑장비대여",
        animalCmgCl: "애완동물출입",
        tourEraCl: "여행시기",
        firstImageUrl: "대표이미지",
        campImg2: "이미지1",
        campImg3: "이미지2",
        campImg4: "이미지3",
        campImg5: "이미지4",
        campImg6: "이미지5",
        createdtime: "등록일",
        modifiedtime: "수정일",
        campView: "캠핑장 조회수",
        campActive: "활성화 여부 (1 : 활성 / 0 : 비활성)"
    };
    const [campData, setCampData] = useState(initState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCampData({
            ...campData,
            [name]: value,
        });
    };

    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(campData)
        axios.post(`${baseUrl}/admin/insertCamp`, campData)
            .then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    router.push('/admin/campList')
                } else {
                    alert(res.data.message)
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
                    <h3>캠핑장 정보</h3>
                    <form onSubmit={handleSubmit}>
                        {Object.entries(campData).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: "10px" }}>
                                <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                                    {labels[key] || key}
                                </label>
                                {key === "intro" ? (
                                    <textarea
                                        name={key}
                                        value={value ?? ""}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                        rows="4"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={key}
                                        value={value ?? ""}
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
                            신규 등록
                        </button>

                    </form>
                </div>
            </Box>
        </Box>
    );
}

export default Page;