"use client"
import React from 'react';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';

import './dealMain.css';
import { Box, Button, TextField } from '@mui/material';

export default function ProductSearchPage() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리 상태
  // const [products, setProducts] = useState([]); // 검색 결과로 표시될 상품 리스트

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [products, setProducts] = useState([]);                 // 데이터 상태 
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태

  // store - authStore 에 있는 정보를 사용한다.
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // 로딩 시작
        const API_URL = `${LOCAL_API_BASE_URL}/deal/dealMain`;

        // 데이터 가져오기
        const response = await axios.get(API_URL);

        if (response.data.success) {
          console.log("Response data:", response.data.data); // 데이터 확인용 로그

          const list = response.data.data.list;
          const file_list = response.data.data.file_list;

          // 각 상품에 대해 첫 번째 이미지만 매칭
          const resultProducts = list.map((product) => {
            // 해당 상품의 모든 이미지 찾기
            const productFiles = file_list.filter(file => file.fileTableIdx === product.dealIdx);
            // fileOrder가 0인 메인 이미지 찾기
            const mainImage = productFiles.find(file => file.fileOrder === 0);

            return {
              ...product,
              deal01: mainImage ? mainImage.fileName : null
            };
          });

          // console.log("Processed products:", resultProducts); // 처리된 데이터 확인
          setProducts(resultProducts);
        } else {
          setError("데이터를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("상품 데이터 조회 오류:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [LOCAL_API_BASE_URL]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


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

  // 상품등록 페릭 핸들러
  const handleWriteClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/user/login');
      return;
    }
    router.push('/deal/write');
  };

  // 나의거래 페릭 핸들러
  const handleMyDealsClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/user/login');
      return;
    }
    router.push(`/deal/management/${user.userIdx}`);
  };

  // 상품 목록 필터링
  const filteredDeals = products.filter(deal => {
    // 관리자나 판매자가 아닌 경우 dealview=0인 상품 제외
    if (deal.dealview === 0 &&
      user?.userIdx !== "25" &&
      user?.userIdx !== deal.dealSellerUserIdx) {
      return false;
    }
    return true;
  });

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


        <a href="/deal/write" className="btn1" onClick={handleWriteClick}>
          상품 등록
        </a>

        <a href="#" className="btn1" onClick={handleMyDealsClick}>
          나의 거래
        </a>
      </div>

      {/* 검색을 하지 않았을 때 전체 상품 갯수 보이기 */}
      {/* 검색 상품 개수 */}
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
      <div className="product-grid-wrapper">
        <div className="product-grid">
          {filteredDeals.map((product) => (
            <div className="product-item" key={product.dealIdx}>
              <Link href={`/deal/detail/${product.dealIdx}`}>
                <img
                  className="dealMain-image"
                  src={product.deal01
                    ? `${LOCAL_IMG_URL}/${product.deal01}`
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
                  <div className='price'>
                    {product.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <br></br>
      <div className="part">캠핑 후기</div>

    </div>

  );
}

const styles = {
  card: {
    position: 'relative',
    width: '150px',
    height: '200px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heartIcon: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    cursor: 'pointer',
    fontSize: '24px',
  },
  filledHeart: {
    color: 'red',
  },
  emptyHeart: {
    color: 'gray',
  },
};
