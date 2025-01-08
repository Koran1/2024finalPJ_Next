'use client';
import PoolIcon from '@mui/icons-material/Pool';

export default function UsageGuide({ item }) {
    const iconMap = {
        "전기": <img src="/images/plug_icon.png" alt="전기" style={{ width: 30 }} />,
        "무선인터넷": <img src="/images/WiFi_icon.png" alt="무선인터넷" style={{ width: 30 }} />,
        "장작판매": "🔥",
        "온수": "♨️",
        "트렘폴린": <img src="/images/trampoline.png" alt="트렘폴린" style={{ width: 30 }} />,
        "물놀이장": <PoolIcon sx={{ color: "#5F8FF0" }} />,
        "놀이터": "🛝",
        "산책로": "🚶",
        "운동장": "⚽",
        "운동시설": "🏋️",
        "마트.편의점": "🛒",
    };
    return (
        <div className="usage-guide-container">

            {/* 이미지 섹션 */}
            <div className="image-section">
                <img
                    src={item.campImg3
                        ? item.campImg3
                        : "/images/campImageholder2.png"}
                    alt="캠핑장 사진1"
                    onError={(e) => e.target.src = "/images/campImageholder2.png"}
                />
                <img
                    src={item.campImg4
                        ? item.campImg4
                        : "/images/campImageholder2.png"}
                    alt="캠핑장 사진2"
                    onError={(e) => e.target.src = "/images/campImageholder2.png"}
                />
                <img
                    src={item.campImg5
                        ? item.campImg5
                        : "/images/campImageholder2.png"}
                    alt="캠핑장 사진3"
                    onError={(e) => e.target.src = "/images/campImageholder2.png"}
                />

            </div>

            {/* 설명 섹션 */}
            <div className="description">

                {item.intro && (<p>{item.intro}</p>)}
                {!item.intro && item.featureNm && (<p>{item.featureNm}</p>)}

            </div>

            {/* 부대시설 안내 */}
            {item.sbrsCl && (
                <div className="map-heading">
                    <span className="icon">▶</span>
                    부대시설
                </div>
            )}
            <div className="facility-info">
                <div className="icon-section">
                    {item?.sbrsCl
                        ? item.sbrsCl.split(',').map((key) => {
                            const trimmedKey = key.trim();
                            return (
                                <div key={trimmedKey} className="icon-item">
                                    <span>{iconMap[trimmedKey] || "❓"}</span>
                                    <p>{trimmedKey}</p>
                                </div>
                            );
                        })
                        : <p></p>}
                </div>
            </div>

        </div>
    );
}
