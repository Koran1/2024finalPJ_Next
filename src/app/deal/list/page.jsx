import React from 'react';

function Page(props) {
  return (
    <div>
        <h1>상품 목록</h1>
        <div className="product-grid">
            {/* 상품 목록 컴포넌트들이 들어갈 자리 */}
            <div className="product-item">
              <div className="product-image">
                <img src="../images/dealDetailImage01.png" alt="상품 이미지" />
              </div>
              <div className="product-title">
                <h3>캠핑 접이식 불멍 화로대</h3>
              </div>
            </div>
            <Link href="/deal/detail">상품 상세</Link>
        </div>
    </div>
  );
}

export default Page;
