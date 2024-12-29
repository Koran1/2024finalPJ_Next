"use client"
import React from 'react';
import Link from "next/link";
import { useState, useEffect } from 'react';

import './dealMain.css';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';
import { useRouter } from 'next/navigation';

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
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // 로딩 시작
        const API_URL = `${LOCAL_API_BASE_URL}/deal/dealMain`;

        // 데이터 가져오기
        const response = await axios.get(API_URL);

        if (response.data.success) {
          console.log("setProducts: ", response.data.data);

          const list = response.data.data.list;
          const file_list = response.data.data.file_list;

          // Map over the list to create a new array with the updated structure
          const resultProducts = list.map((k) => {
            // Find the matching file from file_list
            const matchingFile = file_list.find(file => file.fileTableIdx === k.dealIdx);

            // Return a new object with the additional field
            return {
              ...k,  // Spread the original `k` object
              deal01: matchingFile ? matchingFile.fileName : null // Add the `deal01` field
            };
          });

          console.log(resultProducts);
          setProducts(resultProducts);
        } else {
          setError("Failed to fetch product data.");
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to fetch product data.");
      } finally {
        setLoading(false); // 로딩 종료
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

  const handlemanage = () => {
    router.push(`/deal/management/${user.userIdx}`);
  }

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
        <p className="btn1" onClick={handlemanage}> 나의 거래</p>
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
      <div className="product-grid">

        {products.map((product) => (

          <div className="product-item" key={product.dealIdx}>
              <Link href={`/deal/detail/${product.dealIdx}`}>
                <img className="product-image"
                  src={product.deal01 || "../images/defaultImage.png"}
                  alt={product.title}
                  style={{ width: "180px", height: "200px" }}
                  />
                <div className="product-content">
                  <div className="nick">{product.dealSellerNick}</div>
                  <div className="title"> title : {product.dealTitle}</div>
                  <div className='price'>{product.dealPrice} 원 </div>
                  {/* vo 이름 다름 */}
                  <div className='favor'> 찜 {product.dealFavorCount} </div>
                </div>
              </Link>
          </div>

        ))}
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
