"use client"

import Link from 'next/link';
import { useState } from 'react';
import './dealMain.css';

const Page = () => {
// 상태 관리
const [selectedCategories, setSelectedCategories] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [results, setResults] = useState('');

// 카테고리 버튼 클릭 시, 선택/해제 처리
const toggleCategory = (category) => {
  setSelectedCategories((prevCategories) => {
    if (prevCategories.includes(category)) {
      return prevCategories.filter((cat) => cat !== category);
    } else {
      return [...prevCategories, category];
    }
  });
};

// 검색 버튼 클릭 시 처리
const handleSearch = (e) => {
  e.preventDefault();
  if (selectedCategories.length === 0) {
    setResults('카테고리를 먼저 선택하세요.');
    return;
  }

  if (!searchQuery) {
    setResults('검색어를 입력해주세요.');
    return;
  }

  let resultText = '';
  selectedCategories.forEach((category) => {
    resultText += `${category} 카테고리에서 "${searchQuery}"을(를) 검색했습니다.<br>`;
  });
  setResults(resultText);
};

  return (
    <div className="pd-reg-container">
      {/* <h1>나의거래 Main</h1> */}
   
      <form class="search-box" action="" method="get">
        <input class="search-txt" type='text' name='' placeholder='상품검색'></input>
        <button class="search-btn" type="submit">

        </button>
      </form>
      <Link href="/deal/management" className="btn1">나의거래</Link>
      <Link href="/deal/pdReg" className="btn1">상품등록</Link>
      <br />
      상품 70,000
      <br />
      <div className="categories">
        {['전체', '테이블', '의자'].map((category) => (
          <button
            key={category}
            className={`category ${selectedCategories.includes(category) ? 'active' : ''}`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <Link href="/deal/detail">상품상세</Link>

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
    </div>
  );
};

export default Page;