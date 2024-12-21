'use client'
import './detail.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import useAuthStore from '../../../../../store/authStore';
import { useParams, useRouter } from 'next/navigation';
import ForumIcon from '@mui/icons-material/Forum';

function Page({ params }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [item, setItem] = useState(null);                 // 데이터 상태
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태
  const { isAuthenticated, token, user } = useAuthStore();       // 로그인 상태
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [mainImage, setMainImage] = useState('/images/dealDetailImage01.png'); // 메인 이미지 상태
  const { dealIdx } = useParams();  // Next.js의 경우 const router = useRouter(); const { dealIdx } = router.query;
  const [smallImages, setSmallImages] = useState([]);
  

// 상품 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // 수정된 API 엔드포인트 사용
            const API_URL = `${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`;
            console.log('Fetching URL:', API_URL);
            
            const response = await axios.get(API_URL);
            const data = response.data;
            
            console.log('Response data:', data);
            
            // API 응답이 성공적인 경우
            if (data.success) {
                // 상품 정보를 상태에 저장
                setItem(data.deal);
                // 파일 목록 설정
                const files = data.files;
                // 파일이 존재하고 비어있지 않은 경우
                if (files && files.length > 0) {
                  // fileOrder가 '0'인 메인 이미지 찾기
                  const mainImgObj = files.find(file => file.fileOrder === '0');
                  // 메인 이미지 URL 설정 (없으면 기본 이미지 사용)
                  setMainImage(mainImgObj ? `${LOCAL_IMG_URL}/${mainImgObj.fileName}` : '/images/dealDetailImage01.png');

                  // 작은 이미지들 설정 (fileOrder 1~4)
                  const smallImgs = files
                    // fileOrder 1~4 사이이고 fileName이 있는 파일만 필터링
                    .filter(file => parseInt(file.fileOrder) >= 0 && parseInt(file.fileOrder) < 5 && file.fileName)
                    // fileOrder 기준으로 정렬
                    .sort((a, b) => parseInt(a.fileOrder) - parseInt(b.fileOrder))
                    // 각 파일의 URL 생성
                    .map(file => `${LOCAL_IMG_URL}/${file.fileName}`);
                  // 작은 이미지 배열 상태 설정
                  setSmallImages(smallImgs);
                }
            } else {
                // API 응답이 실패한 경우 에러 메시지 설정
                setError(data.message || '상품 정보를 불러올 수 없습니다.');
            }
        } catch (err) {
            // 에러 발생 시 콘솔에 출력하고 에러 상태 설정
            console.error("Error details:", err);
            setError(err.response?.data?.message || err.message);
        } finally {
            // 로딩 상태 해제
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
    // 글 작성자와 현재 로그인한 사자 비교 
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
              <h3 style={{fontWeight: 'bold'}}>{item.dealTitle}</h3>
              <button 
                className="like-btn"
                onClick={handleLike}
                style={{ background: 'none', border: 'none', fontSize: '30px' }}
              >
                {isLiked ? '❤️' : '🤍'}
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
              <ForumIcon
                variant="contained"
                className="message-btn"
                onClick={() => router.push('/deal/note/1')}
                style={{ cursor: 'pointer' }}
                title="채팅내기"
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
            <span>찜수</span>
            &nbsp;&nbsp;&nbsp;
            <span>본수</span>
            &nbsp;&nbsp;&nbsp;
            <span>
              {(() => {
                const today = new Date();
                const regDate = new Date(item.dealRegDate);
                const diffTime = Math.floor((today - regDate) / (1000 * 60 * 60 * 24));
                return diffTime === 0 ? "금일" : `${diffTime}일 전`;
              })()}
            </span>
            &nbsp;&nbsp;&nbsp;
            <Button variant="contained" color="error" className="report-btn" style={{marginRight: '10px', width: '150px', height: '50px'}}>신고하기</Button>

            <div className="status-buttons" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
              <Button
                variant="contained"
                color="primary" 
                style={{marginRight: '10px', width: '150px', height: '50px'}}
                onClick={() => {
                  const button = document.querySelector('.status-buttons button');
                  const isSelling = button.textContent === '판매 중';
                  
                  if (isSelling) {
                    if (window.confirm("확인 시 판매완료 상태로 변경됩니다.")) {
                      button.textContent = '판매완료';
                      button.style.backgroundColor = '#808080';
                    }
                  } else {
                    if (window.confirm("확인 시 판매 중 상태로 변경됩니다.")) {
                      button.textContent = '판매 중';
                      button.style.backgroundColor = '#1976d2';
                    }
                  }
                }}
              >
                판매 중
              </Button>
              <Button
                variant="contained"
                color="success"
                style={{marginRight: '10px', width: '150px', height: '50px'}}
                onClick={() => window.location.href = '/deal/satis/1'}
              >
                만족도
              </Button>
            </div>
          </div>
        </div>
        <div className="product-description">
          <h5>상품 설명</h5>
          <span>{item.dealDescription}</span>
        </div>

        <div className="edit-button-container" style={{ textAlign: 'right', marginTop: '20px', marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="darkgray"
            onClick={handleUpdate}
          >
            상품 수정
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