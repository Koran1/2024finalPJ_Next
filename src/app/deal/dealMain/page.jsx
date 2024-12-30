"use client"

import React from 'react';
import Link from "next/link";
import { useState, useEffect } from 'react';

import './dealMain.css';
import axios from 'axios';
import { Box, Button, TextField } from '@mui/material';
import useAuthStore from '../../../../store/authStore';

export default function ProductSearchPage() {
  const [selectedCategories, setSelectedCategories] = useState('전체'); // 선택된 카테고리 상태

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [products, setProducts] = useState([]);                 // 데이터 상태 
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태

  const [searchKeyword, setSearchKeyword] = useState('');
  const {user} = useAuthStore();

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
}, [ LOCAL_API_BASE_URL]);

if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

  

  // 카테고리 선택 토글 함수
  const toggleCategory = (category) => {
    // if (selectedCategories.includes(category)) {
    //   setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    // }
    setSelectedCategories(category)
    console.log(category)
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
        if(res.data.success){
          setProducts(res.data.data);
          console.log(res.data.message)
        }else{
          console.log(res.data.message)
        }
      })
      .catch((err) => console.log(err))
  }

  // 정렬 필터 
  // 1.최신순
  const sortByRegDate = () => {
    const sortedProducts = [...products]
        .sort((a,b) => 
          new Date(b.dealRegDate) - new Date(a.dealRegDate)
        )
    console.log(sortedProducts);
    setProducts(sortedProducts)
  }

  // 2. 조회순
  const sortByUserViewCount = () => {
    const sortedProducts = [...products]
        .sort((a,b) => 
          b.dealUserViewCount - a.dealUserViewCount
        )
    console.log(sortedProducts);
    setProducts(sortedProducts)
  }

  // 3. 가격순
  const sortByPrice = () => {
    const sortedProducts = [...products]
        .sort((a,b) => 
          b.dealPrice - a.dealPrice
        )
    console.log(sortedProducts);
    setProducts(sortedProducts)
  }


  return (
    <div className="pd-reg-container">
      {/* <h1>나의거래 Main</h1> */}
      <div>
        <Box>
            <TextField
                variant="outlined"
                placeholder="검색어를 입력하세요..."
                value={searchKeyword}
                onChange={handleKeyword}
                sx={{ mb: 2 }}
            />
            <Button variant='outlined' onClick={handleSearch}>
              <img src="../images/search_icon.png" alt="Search" className="icon" />
            </Button>
        </Box>


        {/* 상품 등록 버튼 */}
        {/* <div> */}
        <Link href="/deal/write" className="btn1">상품 등록</Link>
        {/* </div> */}

        {/* 나의 거래 버튼 */}
        <Link href={`/deal/management/${user.userIdx}`} className="btn1">나의 거래</Link>
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
            onClick={() => toggleCategory(category)}>
            {category}
          </button>
        ))}
      </div>

        
      <a onClick={sortByRegDate}> 최신순 </a>
      <a onClick={sortByUserViewCount}> 조회순 </a>
      <a onClick={sortByPrice}> 가격순 </a>

      {/* 상품 목록 */}
      <div className="product-grid">

        {/* 실제 상품 이미지 링크 시 삭제 */}
        { filteredProducts.length > 0 ?
          filteredProducts
          .map((product) => (
            <div className="product-card" key={product.dealIdx}>
              <div className="card-content">
                <Link href={`/deal/detail/${product.dealIdx}`}>
                  <img
                    src={`${LOCAL_IMG_URL}/deal/${product.deal01}` || "https://placehold.jp/180x200.png"}
                    alt={product.title}
                    style={{ width: "180px", height: "200px" }}/>
                    
                  <div className="product-info">
                    <div className="seller-name">{product.dealSellerNick}</div>
                    <div className="product-name"> {product.dealTitle}</div>
                    <div className='product-price'>{product.dealPrice} 원 </div>
                    {/* vo 이름 다름 */}
                    <div className='favor'> 찜 {product.dealFavorCount} </div>
                  </div>
                </Link>
                </div>
            </div>
          ))
            :
            <div>
              검색 결과가 없습니다
              </div>

        }
      </div>

      <br></br>
      <div className="part">캠핑 후기</div>

    </div>

  );
}
