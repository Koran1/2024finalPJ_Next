'use client';

export default function UsageGuide({ item }) {
    return (
        <div className="usage-guide-container">

            {/* 이미지 섹션 */}
            <div className="image-section">
                <img src="/images/camp1.png" alt="캠핑장 이미지1" />
                <img src="/images/camp2.png" alt="캠핑장 이미지2" />
                <img src="/images/camp3.png" alt="캠핑장 이미지3" />
            </div>

            {/* 부대시설 안내 */}
            <div className="facility-info">
                <p>
                    <strong>부대시설(sbrsCl)</strong> - 전기, 무선인터넷, 장작판매, 음수,
                    트램폴린, 물놀이장, 놀이터, 산책로, 운동장, 운동시설, 마트, 편의점
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
