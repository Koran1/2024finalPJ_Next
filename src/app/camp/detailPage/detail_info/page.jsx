'use client';

export default function UsageGuide({ item }) {
    return (
        <div className="usage-guide-container">

            {/* 이미지 섹션 */}
            <div className="image-section">
                <img src={item.campImg2} alt="캠핑장 이미지1" />
                <img src={item.campImg3} alt="캠핑장 이미지2" />
                <img src={item.campImg4} alt="캠핑장 이미지3" />
            </div>

            {/* 부대시설 안내 */}
            <div className="facility-info">
                <p>
                    <strong>{item.sbrsCl}</strong>
                </p>
                <div className="icon-section">
                    <span>💡</span>
                    <span>🛒</span>
                    <span>🏞️</span>
                    <span>📶</span>
                    <span>🛝</span>
                    <span>🔥</span>
                    <span>🎧</span>
                </div>
            </div>

            {/* 설명 섹션 */}
            <div className="description">

                {item.intro && (<p>{item.intro}</p>)}
                {!item.intro && item.featureNm && (<p>{item.featureNm}</p>)}

            </div>
        </div>
    );
}
