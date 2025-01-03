"use client"
import React from 'react';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';

import './dealMain.css';
import { Box, Button, TextField } from '@mui/material';
import MainProductCard from './MainProductCard';

export default function ProductSearchPage() {

  const [selectedCategories, setSelectedCategories] = useState('전체'); // 선택된 카테고리 상태

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [products, setProducts] = useState([]);                 // 데이터 상태 
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태

  // 검색어
  const [searchKeyword, setSearchKeyword] = useState('');

  // store - authStore 에 있는 정보를 사용한다.
  const { user, isAuthenticated } = useAuthStore();

  const [favProducts, setFavProducts] = useState([]);

  const router = useRouter();

  // dealMain 로딩
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


  // 찜 목록
  useEffect(() => {
    if (user == null) return
    const response = axios.get(`${LOCAL_API_BASE_URL}/deal/getFavoriteList?userIdx=${user.userIdx}`)
      .then((res) => {
        console.log(res.data)
        setFavProducts(res.data.data)
      })
  }, [user])



  // 로딩 & 에러 처리
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // 카테고리 선택 토글 함수
  const toggleCategory = (category) => {
    setSelectedCategories(category)
  }

  const filteredProducts = products.filter((prod) =>
    selectedCategories === '전체' || prod.dealCategory === selectedCategories
  );

  // 검색어 핸들러
  const handleKeyword = (e) => setSearchKeyword(e.target.value);

  // 검색 제출 핸들러
  const handleSearch = () => {
    // 여기에서 서버단으로
    const API_URL = `${LOCAL_API_BASE_URL}/deal/dealMainSearch`
    const response = axios.get(`${API_URL}?searchKeyword=${searchKeyword}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setProducts(res.data.data);
          console.log(res.data.message)
        } else {
          console.log(res.data.message)
        }
      })
      .catch((err) => console.log(err))
  }

  // 정렬 필터 
  // 1.최신순
  const sortByRegDate = () => {
    const sortedProducts = [...products]
      .sort((a, b) =>
        new Date(b.dealRegDate) - new Date(a.dealRegDate)
      )
    console.log(sortedProducts);
    setProducts(sortedProducts)
  }

  // 2. 조회순
  const sortByUserViewCount = () => {
    const sortedProducts = [...products]
      .sort((a, b) =>
        b.dealUserViewCount - a.dealUserViewCount
      )
    console.log(sortedProducts);
    setProducts(sortedProducts)
  }

  // 3. 가격순
  const sortByPrice = () => {
    const sortedProducts = [...products]
      .sort((a, b) =>
        b.dealPrice - a.dealPrice
      )
    console.log(sortedProducts);
    setProducts(sortedProducts)
  }


  return (
    <div className="pd-reg-container">
      {/* <h1>나의거래 Main</h1> */}
      <div className='deal-main-nav'>
        <Box>
          <TextField className='deal-search-bar'
            variant="outlined"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={handleKeyword}
            sx={{ mb: 2 }}
          />
          <Button style={{ borderRadius:'10px' , backgroundColor:'beige' , height:'56px', width:'50px'}} variant='outlined' onClick={handleSearch}>
            <div className='search-text'>검색</div>
            {/* <img style={{height:'50px', width:'50px'}} src="../images/search_icon.png" alt="Search" className="icon" /> */}
          </Button>


        {/* 상품 등록 버튼 */}
        <Link href="/deal/write" className="btn1">상품 등록</Link>


        {/* 나의 거래 버튼 */}
        {isAuthenticated && <Link href={`/deal/management`} className="btn1">나의 거래</Link>}
        </Box>
      </div>

      {/* 검색을 하지 않았을 때 전체 상품 갯수 보이기 */}
      {/* 검색 상품 개수 */}
      <div className="part">상품 {filteredProducts.length || 0}개</div>

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
            onClick={() => toggleCategory(category)}>
            {category}
          </button>
        ))}
      </div>

      <a onClick={sortByRegDate}> 최신순 </a>
      <a onClick={sortByUserViewCount}> 조회순 </a>
      <a onClick={sortByPrice}> 가격순 </a>

      {/* 상품 목록 */}
      <div className="product-grid-wrapper">
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <MainProductCard key={product.dealIdx} product={product} favProducts={favProducts} />

          ))}
        </div>
      </div>

      <br></br>
      <div className="part">캠핑 후기</div>

    </div >

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
