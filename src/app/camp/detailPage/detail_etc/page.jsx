'use client';

function Page({ item }) {
    // 주요시설 항목을 동적으로 생성
    const facilityContent = [];
    if (item.gnrlSiteCo > 0) {
        facilityContent.push(`일반야영장(${item.gnrlSiteCo}면)`);
    }
    if (item.autoSiteCo > 0) {
        facilityContent.push(`자동차야영장(${item.autoSiteCo}면)`);
    }
    if (item.glampSiteCo > 0) {
        facilityContent.push(`글램핑(${item.glampSiteCo}면)`);
    }
    if (item.caravSiteCo > 0) {
        facilityContent.push(`카라반(${item.caravSiteCo}면)`);
    }
    if (item.indvdlCaravSiteCo > 0) {
        facilityContent.push(`개인카라반(${item.indvdlCaravSiteCo}면)`);
    }

    // 바닥형태 항목을 동적으로 생성
    const siteBottomContent = [];
    if (item.siteBottomCl1 > 0) {
        siteBottomContent.push(`잔디(${item.siteBottomCl1})`);
    }
    if (item.siteBottomCl2 > 0) {
        siteBottomContent.push(`파쇄석(${item.siteBottomCl2})`);
    }
    if (item.siteBottomCl3 > 0) {
        siteBottomContent.push(`테크(${item.siteBottomCl3})`);
    }
    if (item.siteBottomCl4 > 0) {
        siteBottomContent.push(`자갈(${item.siteBottomCl4})`);
    }
    if (item.siteBottomCl5 > 0) {
        siteBottomContent.push(`맨흙(${item.siteBottomCl5})`);
    }

    // 안전시설현황 항목을 동적으로 생성
    const safetyContent = [];
    if (item.extshrCo > 0) {
        safetyContent.push(`소화기(${item.extshrCo})`);
    }
    if (item.frprvtWrppCo > 0) {
        safetyContent.push(`방화수(${item.frprvtWrppCo})`);
    }
    if (item.frprvtSandCo > 0) {
        safetyContent.push(`방화사(${item.frprvtSandCo})`);
    }
    if (item.fireSensorCo > 0) {
        safetyContent.push(`화염감지기(${item.fireSensorCo})`);
    }

    // rows 배열 생성
    const rows = [
        ...(facilityContent.length > 0
            ? [{ id: 1, title: '주요시설', content: facilityContent.join(', ') }]
            : []),
        ...(siteBottomContent.length > 0
            ? [{ id: 2, title: '바닥형태 (단위:면)', content: siteBottomContent.join(', ') }]
            : []),
        ...(safetyContent.length > 0
            ? [{ id: 3, title: '안전시설현황', content: safetyContent.join(', ') }]
            : []),
        ...(item.glampInnerFclty
            ? [{ id: 4, title: '글램핑-내부시설', content: item.glampInnerFclty }]
            : []),
        ...(item.caravInnerFclty
            ? [{ id: 5, title: '카라반-내부시설', content: item.caravInnerFclty }]
            : []),
        ...(item.sitedStnc
            ? [{ id: 6, title: '사이트 간격', content: `${item.sitedStnc}M` }]
            : []),
        ...(item.eqpmnLendCl
            ? [{ id: 7, title: '캠핑장비대여', content: item.eqpmnLendCl }]
            : []),
        ...(item.animalCmgCl
            ? [{ id: 8, title: '반려동물 출입', content: item.animalCmgCl }]
            : []),
        ...(item.brazierCl
            ? [{ id: 9, title: '화로대', content: item.brazierCl }]
            : []),
        ...(item.posblFcltyCl
            ? [{ id: 10, title: '주변이용가능 시설', content: item.posblFcltyCl }]
            : []),
        ...(item.resveCl
            ? [{ id: 11, title: '예약 방법', content: item.resveCl }]
            : []),
    ];

    return (
        <>
            <div className="map-heading">
                <span className="icon">▶</span>
                기타 주요시설
            </div>
            <div className="table-container">
                <table className="custom-table">
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <th>{row.title}</th>
                                <td>{row.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Page;
