import React from 'react';
import Link from 'next/link';

function Page(props) {
  return (
    <>
      <h1>캠핑마켓 Main</h1>
      <Link href="/deal/write">상품등록</Link>
      <br />
      <Link href="/deal/mydeal">나의거래</Link>
      <br /><br /><br /><br />
      <div className="product-grid">
        {/* 상품 목록 컴포넌트들이 들어갈 자리 */}
        <div className="product-item">
          <div className="product-image">
            <Link href="/deal/detail/1">
              <img src="../images/dealDetailImage01.png" alt="상품 이미지" style={{ width: '200px', height: '200px' }} />
              <div className="product-title">
                <h6>캠핑 접이식 불멍 화로대</h6>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
