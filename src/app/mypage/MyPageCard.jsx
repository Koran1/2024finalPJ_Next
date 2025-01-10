import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';

function MyPageCard({ product }) {
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;

    return (
        <div className="product-item" key={product.dealIdx}
            style={{
                border: "1px solid #868e96", padding: "10px",
                borderRadius: "20px", boxShadow: "3px 3px 2px lightgray"
            }}>
            {product.dealview === 0 && (
                <div className="inactive-notice">
                    Disabled
                </div>
            )}
            <Link href={`/deal/detail/${product.dealIdx}`}>
                <img
                    className="dealMain-image"
                    src={product.deal01
                        ? `${LOCAL_IMG_URL}/deal/${product.deal01}`
                        : "/images/defaultImage.png"}
                    alt={product.dealTitle}
                    style={{ width: "180px", height: "200px" }}
                    onError={(e) => {
                        console.log("Image load error:", e);
                        e.target.src = "/images/defaultImage.png";
                    }}
                />
                <div className="product-content">
                    <div className="nick">{product.dealSellerNick}</div>
                    <div className="title">{product.dealTitle}</div>
                    <div className="price">
                        {product.dealPrice == 0 ? '나눔' : `${product.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
                    </div>
                    {/* 조회수 */}
                    <div className="view-count">
                        <VisibilityIcon style={{ fontSize: '1.2rem' }} />
                        <span> {product.dealCount}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default MyPageCard;