import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';

function MyPageCard({ mylog }) {
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;

    return (
        <div className="product-item" key={mylog.logIdx}>
            <Link href={`/camplog/detail/${mylog.logIdx}`}>
                <img
                    className="dealMain-image"
                    src={mylog.fileName
                        ? `${LOCAL_IMG_URL}/${mylog.fileName}`
                        : "/images/defaultImage.png"}
                    alt={mylog.logTitle}
                    style={{ 
                        width: "180px", 
                        height: "200px",
                        borderRadius: "8px"
                    }}
                    onError={(e) => {
                        console.log("Image load error:", e);
                        e.target.src = "/images/defaultImage.png";
                    }}
                />
                <div className="product-content">
                    <div className="nick">{mylog.logRegDate.substring(0, 10)}</div>
                    <div className="title">{mylog.logTitle}</div>
                    {/* 조회수 */}
                    <div className="view-count">
                        <VisibilityIcon style={{ fontSize: '1.2rem' }} />
                        <span> {mylog.commentCount}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default MyPageCard;