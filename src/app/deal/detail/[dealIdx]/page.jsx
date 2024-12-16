'use client'
import { useState } from 'react';
import './detail.css';
import { Button } from '@mui/material';

function Page() {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="detail-container">
      <div className="product-main">
        <img 
          src="/images/dealDetailImage01.png"
          alt="상품 이미지" 
          className="product-image"
        />
        
        <div className="product-info">
          <div className="product-header">
            <h3>캠핑 접이식 불멍 화로대</h3>
            <button 
              className="like-btn"
              onClick={handleLike}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          </div>
          <hr />

          <div className="price">137,000원</div>

          <div className="seller-info">
            <span>판매자 파세코</span>
            <span className="rating">★★★★★</span>
            <span>4.8</span>
            <span>・</span>
            <span>2024.02.03</span>
          </div>

          <div className="action-buttons">
            <Button variant="contained" color="primary" className="message-btn" style={{marginRight: '10px', width: '150px', height: '50px'}}>쪽지하기</Button>
            <Button variant="contained" color="error" className="report-btn" style={{marginRight: '10px', width: '150px', height: '50px'}}>신고하기</Button>
          </div>
        </div>
        <hr />

        {/* <ul className="">
          <li>
            <span>상품상태</span>
            <span>새 상품</span>
          </li>
          <li>
            <span>배송비</span>
            <span>일반 4,000원</span>
          </li>
          <li>
            <span>직거래</span>
            <span>서울시 강남구 논현1동 1층 토영 자갈치 꼼장어 옆</span>
          </li>
        </ul> */}


      </div>

      
  

      <div className="product-description">
        <h5>상품 설명</h5>
        <span>파세코 캠프 
        2020년 가을 구매해서 2번째 캠핑에서 심지 태워먹어서 바로 정식 a/s 받아서 심지 교체하고 이후 2번 더 쓰고 이후는 그냥 쭉 보관했습니다.
        (마지막 사용은 2021년 3월. 이후 텐트가 커지면서 팬히터로 갈아탔네요). 
        오래 사용하지 않아서 오늘 테스트 한 사진이고 아무 이상 없습니다. 
        (테스트 겸 고구마 구워 먹느라 2시간 이상 태워봤습니다.) 
        사용감은 다소 있지만 크게 흠집이나 누른곳 없구요 다만 외부에 보관하다보니 가방은 색이 바랬습니다.
        직거래 희망(논현1동 1층 토영 자갈치 꼼장어 옆) 평일은 20시 이후 가능합니다.</span>
      </div>

      <div className="edit-button-container" style={{ textAlign: 'right', marginTop: '20px', marginBottom: '20px' }}>
        <Button
          variant="contained"
          color="darkgray"
          onClick={() => window.location.href = '/deal/write'}
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
  );
}

export default Page;