'use client'
import './detail.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import useAuthStore from '../../../../../store/authStore';
import { useParams, useRouter } from 'next/navigation';
import ForumIcon from '@mui/icons-material/Forum';
import ReportIcon from '@mui/icons-material/Report';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

function Page({ params }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [item, setItem] = useState([]);                 // 데이터 상태
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태
  const { isAuthenticated, token, user } = useAuthStore(); // 로그인 상태
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [mainImage, setMainImage] = useState(null); // 메인 이미지 상태
  const { dealIdx } = useParams();  // Next.js의 경우 const router = useRouter(); const { dealIdx } = router.query;
  const [smallImages, setSmallImages] = useState([]); // 작은 이미지 상태
  const [dealStatus, setDealStatus] = useState('판매 중'); // 판매 상태

  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            
            const API_URL = `${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`;
            console.log('Fetching URL:', API_URL);
            
            const response = await axios.get(API_URL);
            const data = response.data;
            
            console.log('Response data:', data);
            
            // API 응답이 성공적인 경우
            if (data.success) {
                // deal 객체가 존재하는지 확인
                if (!data.data.deal) {
                    setError('상품 정보가 없습니다.');
                    return;
                }
                
                setItem(data.data.deal);  
                
                // files 배열이 존재하고 비어있지 않은지 확인
                const files = data.data.files || [];
                if (files.length > 0) {
                    const mainImgObj = files.find(file => parseInt(file.fileOrder) === 0);
                    if (mainImgObj) {
                        setMainImage(`${LOCAL_IMG_URL}/${mainImgObj.fileName}`);
                    }

        const API_URL = `${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`;
        console.log('Fetching URL:', API_URL);

        const response = await axios.get(API_URL);
        const data = response.data;

        console.log('Response data:', data);

        // API 응답이 성공적인 경우
        if (data.success) {
          // 상품 정보를 상태에 저장
          setItem(data.data.deal);

          // 파일 목록 설정
          const files = data.data.files;

          // 파일이 존재하고 비어있지 않은 경우
          if (files && files.length > 0) {
            // fileOrder가 '0'인 메인 이미지 찾기
            const mainImgObj = files
              .find(file => parseInt(file.fileOrder) === 0);
            // 메인 이미지 URL 설정
            if (mainImgObj) {
              setMainImage(`${LOCAL_IMG_URL}/${mainImgObj.fileName}`);
            } else {
              setError('메인 이미지가 누락되었습니다.');
              return;
            }

            // files 배열이 존재하고 비어있지 않은지 확인
            if (files.length > 0) {
              const mainImgObj = files.find(file => parseInt(file.fileOrder) === 0);
              if (mainImgObj) {
                setMainImage(`${LOCAL_IMG_URL}/${mainImgObj.fileName}`);
              }

              const smallImgs = files
                .filter(file => parseInt(file.fileOrder) >= 1 &&
                  parseInt(file.fileOrder) <= 5 &&
                  file.fileName)
                .sort((a, b) => parseInt(a.fileOrder) - parseInt(b.fileOrder))
                .map(file => `${LOCAL_IMG_URL}/${file.fileName}`);
              setSmallImages(smallImgs);
            }
          }
        } else {
          setError(data.message || '상품 정보를 불러올 수 없습니다.');
        }
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
  }, [dealIdx, LOCAL_API_BASE_URL, LOCAL_IMG_URL]);

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

  // 좋아요 버튼 클릭 시 좋아요 상태 변경
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

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

              <button
                className="like-btn"
                onClick={handleLike}
                style={{ background: 'none', border: 'none' }}
              >
                <span>찜하기</span>
                {isLiked ? <BookmarkIcon style={{ color: 'red', fontSize: '2rem' }} /> : <BookmarkBorderIcon style={{ fontSize: '2rem' }} />}
              </button>
            </div>
            <hr />

            <div className="price">{item.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</div>

            <div className="seller-info">
              <span>판매자</span>
              <span> 냐옹이님 {item.dealSellerNick}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>평점</span>
              <span className="rating">★★★★★</span>
              <span>4.8</span>

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div className="action-buttons">
                <span>채팅</span>
                <ForumIcon
                  variant="contained"
                  className="message-btn"
                  onClick={() => router.push('/deal/message')}
                  // 여기에 상대방 userIdx 담아서...?

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
            <BookmarkIcon style={{ fontSize: '1.5rem', color: '#808080' }} />
            &nbsp;
            <span>12</span>
            &nbsp;&nbsp;&nbsp;
            <VisibilityIcon style={{ fontSize: '1.5rem', color: '#808080' }} />
            &nbsp;
            <span>35</span>
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
            <ReportIcon
              variant="contained"
              className="report-btn"
              style={{
                marginRight: '10px',
                fontSize: '2rem',
                color: '#808080',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                const currentColor = e.currentTarget.style.color;
                if (currentColor === 'rgb(128, 128, 128)') {
                  e.currentTarget.style.color = '#ff0000';
                } else {
                  e.currentTarget.style.color = '#808080';
                }
              }}
            />
            <span>신고</span>

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
                onClick={() => window.location.href = `${LOCAL_API_BASE_URL}/deal/satis/1`}
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
    </>
  );
}

export default Page;