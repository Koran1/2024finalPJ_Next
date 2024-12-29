'use client'
import './detail.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import useAuthStore from '../../../../../store/authStore';
import { useParams, useRouter } from 'next/navigation';
import ForumIcon from '@mui/icons-material/Forum';
import ReportIcon from '@mui/icons-material/Report';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Favorite from './favorite/page';
import ReportModal from './report/page';
import SatisfactionModal from './satisfaction/page';

function Page({ params }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [item, setItem] = useState([]);                 // 데이터 상태
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태
  const { isAuthenticated, token, user } = useAuthStore(); // 로그인 상태
  const router = useRouter();
  const { dealIdx } = useParams();  // Next.js의 경우 const router = useRouter(); const { dealIdx } = router.query;
  const [mainImage, setMainImage] = useState('');
  const [smallImages, setSmallImages] = useState([]); // 작은 이미지 상태
  const [dealStatus, setDealStatus] = useState('판매 중'); // 판매 상태
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);  // 조회수 상태 추가
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSatisfactionModalOpen, setIsSatisfactionModalOpen] = useState(false);

  // 좋아요 개수 조회 함수
  const getFavoriteCount = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/favorite-count/${dealIdx}`);
      if (response.data.success) {
        setFavoriteCount(response.data.data);
      }
    } catch (error) {
      console.error('좋아요 개수 조회 실패:', error);
    }
  };

  // 조회수 가져오는 함수
  const getViewCount = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`);
      if (response.data.success) {
        setViewCount(response.data.data.viewCount);
      }
    } catch (error) {
      console.error('조회수 조회 실패:', error);
    }
  };

  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 기존 데이터 조회
        const API_URL = `${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`;
        const response = await axios.get(API_URL);
        const data = response.data;

        if (data.success) {
          setItem(data.data.deal);
          setViewCount(data.data.viewCount);  // 조회수 설정

          // 이미지 처리 코드 추가
          const files = data.data.files;
          if (files && files.length > 0) {
            // 메인 이미지 (fileOrder가 0인 이미지)
            const mainImgObj = files.find(file => parseInt(file.fileOrder) === 0);
            if (mainImgObj) {
              setMainImage(`${LOCAL_IMG_URL}/${mainImgObj.fileName}`);
            } else {
              setMainImage('/images/defaultImage.png'); // 기본 이미지 설정
            }

            // 모든 이미지를 순서대로 정렬하여 작은 이미지 목록에 추가
            const smallImgs = files
              .sort((a, b) => parseInt(a.fileOrder) - parseInt(b.fileOrder))
              .map(file => `${LOCAL_IMG_URL}/${file.fileName}`);
            setSmallImages(smallImgs);
          } else {
            setMainImage('/images/defaultImage.png'); // 기본 이미지 설정
            setSmallImages([]);
          }
        } else {
          setError(data.message || '상품 정보를 불러올 수 없습니다.');
        }

        // 좋아요 개수 조회
        await getFavoriteCount();

      } catch (err) {
        console.error("Error details:", err);
        setError('상품 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (dealIdx) {
      fetchData();
    }
  }, [dealIdx]);

  // item이 null일 경우 처리 추가
  if (!item) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h2>상품 정보를 불러올 수 없습니다.</h2>
      </div>
    );
  }

  // 수정 버튼 클릭 시
  const handleUpdate = async () => {
    // 수정페이지로 이동
    router.push(`/deal/update/${item.dealIdx}`)
  }

  // 로딩 중
  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  }

  // 에러 발생 시
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h2>Error:</h2>
        <p>{error}</p>
      </div>
    );
  }
  // 글 작성자와 현재 로그인한 사용자 비교 
  const isOwner = isAuthenticated && String(user.m_id) === String(item.dealSellerUserIdx);
  // 로딩 완료 후

  return (
    <>
      <div className="detail-container">
        <div className="product-main">
          {/* 이미지 컨테이너 */}
          <div className="images-container">
            {/* 작은 이미지 컨테이너 */}
            <div className="small-images">
              {smallImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`작은 이미지 ${index + 1}`}
                  className="small-image"
                  onClick={() => setMainImage(src)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            {/* 메인 이미지 컨테이너 */}
            <div className="main-image-container">
              <img
                src={mainImage} // 상태에 따른 메인 이미지
                alt="상품 이미지"
                className="product-image"
              />
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              <h3 style={{ fontWeight: 'bold' }}>{item.dealTitle}</h3>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <div className="like-container">
                <Favorite onFavoriteChange={getFavoriteCount} />
              </div>
            </div>
            <hr />

            <div className="price">{item.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</div>

            <div className="seller-info">
              <span>판매자</span>
              <span> {item.dealSellerNick}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>평점</span>
              <span className="rating">★★★★★</span>
              <span>4.8</span>

              &nbsp;&nbsp;&nbsp;
              <div className="action-buttons">
                <span>채팅</span>
                <ForumIcon
                  variant="contained"
                  className="message-btn"
                  onClick={() => router.push('/deal/message')}
                  style={{ cursor: 'pointer', fontSize: '2rem' }}
                  title="채팅"
                >
                </ForumIcon>
              </div>
            </div>

            <hr />

            <ul className="product-details">
              <li>
                <span>상품상태</span>
                &nbsp;
                <span> {item.dealStatus}</span>
              </li>
              <li>
                <span>배송비</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span> {item.dealPackage}</span>
              </li>
              <li>
                <span>직거래</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span> {item.dealDirect === "직거래 불가" ? "직거래 불가" : item.dealDirectContent}</span>
              </li>
              <li>
                <span>판매수량</span>
                &nbsp;
                <span> {item.dealCount} 개(건)</span>
              </li>
            </ul>
            <Favorite style={{ fontSize: '1.5rem', color: '#808080' }} /> 
            &nbsp;
            <span>{favoriteCount}</span>
            &nbsp;&nbsp;&nbsp;
            <VisibilityIcon style={{ fontSize: '1.5rem', color: '#808080' }} />
            &nbsp;
            <span>{viewCount}</span>
            &nbsp;&nbsp;&nbsp;
            <AccessTimeFilledIcon style={{ fontSize: '1.5rem', color: '#808080' }} />
            &nbsp;
            <span>
              {(() => {
                const today = new Date();
                const regDate = new Date(item.dealRegDate);
                const diffTime = Math.floor((today - regDate) / (1000 * 60 * 60 * 24));
                return diffTime === 0 ? "금일" : `${diffTime}일 전`;
              })()}
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div className="report-icon-container">
              <ReportIcon
                onClick={() => setIsReportModalOpen(true)}
                style={{ 
                  cursor: 'pointer', 
                  fontSize: '2rem',
                  transition: 'color 0.3s ease'  // 색상 변경 시 부드러운 전환 효과
                }}
                className="report-icon"
                title="신고하기"
              />
              <span>신고</span>
            </div>

            <div className="status-buttons" style={{ textAlign: 'center', margin: '40px' }}>
              <Button
                variant="contained"
                color={dealStatus === '판매 중' ? 'primary' : 'default'}
                style={{ marginRight: '10px', width: '150px', height: '50px', backgroundColor: dealStatus === '판매 중' ? '#1976d2' : '#808080' }}
                onClick={() => {
                  const isSelling = dealStatus === '판매 중';

                  if (isSelling) {
                    if (window.confirm("판매 완료 상태로 변경 됩니다.")) {
                      setDealStatus('판매 완료');
                    }
                  } else {
                    if (window.confirm("판매 중 상태로 변경됩니다.")) {
                      setDealStatus('판매 중');
                    }
                  }
                }}
              >
                {dealStatus}
              </Button>
              <Button
                variant="contained"
                color="success"
                style={{ marginLeft: '50px', width: '150px', height: '50px' }}
                onClick={() => setIsSatisfactionModalOpen(true)}
                disabled={dealStatus === '판매 중'}
              >
                만족도
              </Button>
            </div>
          </div>
        </div>
        <div className="product-description">
          <h5>상품 설명</h5>
          <div className="deal-description">
            {item.dealDescription}
          </div>
        </div>

        <div className="edit-button-container" style={{ textAlign: 'right', marginTop: '20px', marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="darkgray"
            onClick={handleUpdate}
          >
            수정하기
          </Button>
        </div>

        <div className="seller-products">
          <h5>판매자의 다른 상품</h5>
          <hr />
          <div className="product-grid">
            {/* 상품 목록 컴포넌트들이 들어갈 자리 */}
          </div>
        </div>

        <div className="seller-reviews">
          <h5>판매자의 캠핑장 후기</h5>
          <hr />

          <div className="review-grid">
            {/* 후기 컴포넌트들이 들어갈 자리 */}
          </div>
        </div>
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        dealTitle={item.dealTitle}
        sellerNick={item.dealSellerNick}
      />
      <SatisfactionModal
        isOpen={isSatisfactionModalOpen}
        onClose={() => setIsSatisfactionModalOpen(false)}
        dealIdx={dealIdx}
      />
    </>
  );
}

export default Page;