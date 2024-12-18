'use client'
import KakaoMap from './../map/page';


function Page(props) {
    return (
        <div className="map-container">
            {/* 상단 제목 */}
            <h2 className="map-title">지도</h2>

            {/* 안내 섹션 */}
            <div className="map-content">
                <div className="map-heading">
                    <span className="icon">▶</span>
                    찾아오시는 길
                </div>

                {/* 지도 이미지 */}
                <div className="map-image">
                    <KakaoMap />
                </div>
            </div>
        </div>
    );
}

export default Page;