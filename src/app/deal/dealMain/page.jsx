"use client"

import React from 'react';
import Link from "next/link";
import { useState } from 'react';
import './dealMain.css';

export default function ProductSearchPage() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리 상태
  const [products, setProducts] = useState([]); // 검색 결과로 표시될 상품 리스트

  // 카테고리 선택 토글 함수
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    }


    // 검색 제출 핸들러
    const handleSearchSubmit = async (e) => {
      e.preventDefault(); // 폼 제출 기본 동작 방지

      // 검색 API 호출 (임시: 실제 API URL 및 로직 추가 필요)
      const response = await fetch(`/api/products?search=${searchTerm}&categories=${selectedCategories.join(",")}`);
      const data = await response.json();

      setProducts(data); // 검색 결과 업데이트
    };
  };

  return (
    <div className="pd-reg-container">
      {/* <h1>나의거래 Main</h1> */}
      <div>

        <form className="search-box" action="" method="get">
          <input className="search-txt" type='text' name='' placeholder='상품검색'></input>
          <button className="search-btn" type="submit">
            <img src="../images/search_icon.png" alt="Search" className="icon" />
          </button>
        </form>

        {/* 상품 등록 버튼 */}
        {/* <div> */}
        <Link href="/deal/write" className="btn1">상품 등록</Link>
        {/* </div> */}

        {/* 나의 거래 버튼 */}
        <Link href="/deal/management" className="btn1">나의 거래</Link>
      </div>

      {/* 상품 개수 */}
      <div className="part">상품 {products.length || 0}개</div>

      {/* 카테고리 필터 */}
      <div className="categories">
        {[
          "전체", "텐트/타프", "테이블", "의자", "가방/스토리지", "취미/게임", "침구류",
          "의류/신발", "휴대용품", "난방/화로", "반려동물용품", "취사도구", "디지털기기",
          "안전보안", "기타 물품"
        ].map((category) => (
          <button
            key={category}
            className={`category ${selectedCategories.includes(category) ? 'active' : ''}`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      <div className="product-grid">

        {/* 실제 상품 이미지 링크 시 삭제 */}
        <Link href={`/deal/detail/1`}><img src={`../images/dealDetailImage01.png`} alt="상품 이미지" style={{ width: "100px", height: "100px" }} /></Link>

        {products.map((product) => (
          <div className="product-item" key={product.dealIdx}>
            <div className="product-image">
              <Link href={`/deal/detail/${product.dealIdx}`}>
                <img
                  src={product.imageUrl || "../images/defaultImage.png"}
                  alt={product.title}
                  style={{ width: "200px", height: "200px" }}
                />
                <div className="product-title">
                  <h6>{product.title}</h6>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <br></br>
      <div className="part">캠핑 후기</div>

    </div>

  );
}
