'use client'
import './detail.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import useAuthStore from '../../../../../store/authStore';
import { useParams, useRouter } from 'next/navigation';

function Page({ params }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [item, setItem] = useState(null);                 // 데이터 상태
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태
  const { isAuthenticated, token, user } = useAuthStore();       // 로그인 상태
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const { dealIdx } = useParams();  // Next.js의 경우 const router = useRouter(); const { dealIdx } = router.query;

// 상품 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // dealIdx 직접 사용
            const API_URL = `${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`;
            console.log('Fetching URL:', API_URL); // URL 확인용 로그
            
            const response = await axios.get(API_URL);
            const data = response.data;
            
            console.log('Response data:', data); // 응답 데이터 확인용 로그
            
            if (data.success) {
                setItem(data.data);
            } else {
                setError(data.message || '상품 정보를 불러올 수 없습니다.');
            }
        } catch (err) {
            console.error("Error details:", err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (dealIdx) {
        fetchData();
    }
}, [dealIdx, LOCAL_API_BASE_URL]);

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
  const isOwner = isAuthenticated && String(user.m_id) === String(item.gb_id);
  // 로딩 완료 후

// 좋아요 버튼 클릭 시 좋아요 상태 변경
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <>
    <div className="detail-container">
      <div className="product-main">
        <img 
          src="/images/dealDetailImage01.png"
          alt="상품 이미지" 
          className="product-image"
        />
        
        <div className="product-info">
          <div className="product-header">
            <h3>{item.dealTitle}</h3>
            <button 
              className="like-btn"
              onClick={handleLike}
              style={{ background: 'none', border: 'none', fontSize: '30px' }}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          </div>
          <hr />

          <div className="price">{item.dealPrice}원</div>

          <div className="seller-info">
            <span>판매자 {item.dealSellerNick}</span>
            <span className="rating">★★★★★</span>
            <span>4.8</span>
            <span>・</span>
            <span>{item.dealRegDate}</span>
          </div>

          <div className="action-buttons">
            <Button 
              variant="contained" 
              color="primary" 
              className="message-btn" 
              style={{marginRight: '10px', width: '150px', height: '50px'}}
              onClick={() => window.location.href = '/deal/note/1'}
            >
              쪽지하기
            </Button>
            
          </div>
    
          <hr />

          <ul className="product-details">
            <li>
              <span>상품상태</span>
              <span> {item.dealStatus}</span>
            </li>
            <li>
              <span>배송비</span>
              <span> {item.dealPackage}</span>
            </li>
            <li>
              <span>직거래</span>
              <span> {item.dealDirect === "직거래 불가" ? "직거래 불가" : item.dealDirectContent}</span>
            </li>
            <li>
              <span>판매수량</span>
              <span> {item.dealCount}</span>
            </li>
          </ul>

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
          onClick={(handleUpdate) => window.location.href = '/deal/update/1'}
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
          {/* 후 컴포넌트들이 들어갈 자리 */}
        </div>
      </div>
    </div>
    </>
  );
}

export default Page;