"use client"
import React from 'react';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';


import './dealMain.css';
import { Box, Button, TextField, IconButton } from '@mui/material';
import MainProductCard from './MainProductCard';
import { blue } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ListAltIcon from '@mui/icons-material/ListAlt';

export default function ProductSearchPage() {
  const [selectedCategories, setSelectedCategories] = useState('전체');
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { user, isAuthenticated } = useAuthStore();
  const [favProducts, setFavProducts] = useState([]);
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSort, setActiveSort] = useState('latest');
  const [sellerCampLogs, setSellerCampLogs] = useState([]);

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

  // 캠핑 후기 useEffect
  useEffect(() => {
    const fetchCampLogs = async () => {
      try {
        // 실제 서버의 캠핑 후기 목록을 가져오는 엔드포인트로 수정
        const response = await axios.get(`${LOCAL_API_BASE_URL}/camplog/list`, {
          params: {
            page: 1,
            size: 6,
            sortOption: 'latest'
          }
        });

        if (response.data.success) {
          // 응답 데이터 구조에 맞게 수정
          const logsWithThumbnails = response.data.data.data.map(log => ({
            ...log,
            fileName: log.fileName // 썸네일 이미지 파일명
          }));
          setSellerCampLogs(logsWithThumbnails);
        }
      } catch (error) {
        console.error('캠핑 후기 조회 실패:', error);
      }
    };

    fetchCampLogs();
  }, [LOCAL_API_BASE_URL]);

  // 로딩 & 에러 처리
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // 카테고리 선택 토글 함수
  const toggleCategory = (category) => {
    setSelectedCategories(category)
  }

  const filteredProducts = products.filter((prod) => {
    // 기본 카테고리 필터링
    const categoryMatch = selectedCategories === '전체' || prod.dealCategory === selectedCategories;
    
    // dealview 조건 추가
    const viewCondition = 
      prod.dealview === 1 || // 활성화된 상품은 모두에게 보임
      (prod.dealview === 0 && user?.userIdx === prod.dealSellerUserIdx); // 비활성화된 상품은 판매자에게만 보임
      
    return categoryMatch && viewCondition;
  });

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

  // 정렬 필수들 수정
  const sortByRegDate = () => {
    const sortedProducts = [...products].sort((a, b) => new Date(b.dealRegDate) - new Date(a.dealRegDate));
    setProducts(sortedProducts);
    setActiveSort('latest');
  };

  const sortByUserViewCount = () => {
    const sortedProducts = [...products].sort((a, b) => b.dealCount - a.dealCount);
    setProducts(sortedProducts);
    setActiveSort('views');
  };

  const sortByPrice = () => {
    const sortedProducts = [...products].sort((a, b) => a.dealPrice - b.dealPrice);
    setProducts(sortedProducts);
    setActiveSort('price');
  };

  // 카테고리별 상품 수를 계산하는 함수 추가
  const getCategoryCount = (category) => {
    return products.filter(product => 
      category === "전체" ? true : product.dealCategory === category
    ).length;
  };

  return (
    <div className="deal-main-wrapper">
      <div className='deal-main-nav'>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 20px',
          gap: '20px'  // 요소들 사이의 간격 추가
        }}>
          {/* 왼쪽 여백을 위한 div */}
          <div style={{ flex: '1' }}></div>
          
          {/* 검색창 컨테이너 */}
          <div className='search-container' style={{ 
            flex: '2',  // 더 많은 공간 차지
            display: 'flex',
            justifyContent: 'center'  // 중앙 정렬
          }}>
            <TextField
              className='deal-search-bar'
              variant="outlined"
              placeholder={isSearchFocused ? "" : "상품 검색"}
              value={searchKeyword}
              onChange={handleKeyword}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}>
                    <SearchIcon style={{ color: '#2F3438' }} />
                  </IconButton>
                ),
              }}
              sx={{
                width: '100%',  // TextField가 테이너의 전체 너비 사용
                maxWidth: '500px'  // 최대 너비 제한
              }}
            />
          </div>
          
          {/* 오른쪽 버튼 그룹 */}
          <div className='btn-nav' style={{ 
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-5px' // 전체를 왼쪽으로 5px 이동
          }}>
            <Link 
              href={isAuthenticated ? "/deal/write" : '/user/login'} 
              className="nav-link"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  alert('로그인이 필요한 서비스입니다.');
                  router.push('/user/login');
                }
              }}
              style={{ marginRight: '10px' }}
            >
              <AppRegistrationIcon sx={{ marginRight: '4px', fontSize: '20px', verticalAlign: 'middle', color: '#4D88FF' }}/>
              상품등록
            </Link>
            <Link 
              href={isAuthenticated ? `/deal/management` : '/user/login'} 
              className="nav-link"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  alert('로그인이 필요한 서비스입니다.');
                  router.push('/user/login');
                }
              }}
            >
              <ListAltIcon sx={{ fontSize: '20px', verticalAlign: 'middle', color: '#4D88FF' }}/>
              나의거래
            </Link>
          </div>
        </Box>
      </div>

      <div className="content-container">
        {/* 상품 개수 */}
        <div className="part">
          상품 {filteredProducts.length || 0}개
        </div>

        {/* 카테고리 */}
        <div className="categories">
          {[
            "전체", "텐트/타프", "식품/음료", "휴대용품", "가방/스토리지", "취미/게임", "침구류",
            "의류/신발", "위생용품", "난방/화로", "반려동물용품", "취사도구", "디지털기기",
            "안전보안", "뷰티/미용", "테이블/의자", "기타 물품"
          ].filter(category => 
            category === "전체" || getCategoryCount(category) > 0
          ).map((category) => (
            <button
              key={category}
              className={`category ${selectedCategories.includes(category) ? 'active' : ''}`}
              onClick={() => toggleCategory(category)}>
              {category} {category !== "전체" && `(${getCategoryCount(category)})`}
            </button>
          ))}
        </div>

        {/* 정렬 필터 */}
        <div className='filter-space'>
          <a className={`f-btn ${activeSort === 'latest' ? 'active' : ''}`} onClick={sortByRegDate}>
            최신순
          </a>
          <span className="filter-divider">|</span>
          <a className={`f-btn ${activeSort === 'views' ? 'active' : ''}`} onClick={sortByUserViewCount}>
            조회순
          </a>
          <span className="filter-divider">|</span>
          <a className={`f-btn ${activeSort === 'price' ? 'active' : ''}`} onClick={sortByPrice}>
            가격순
          </a>
        </div>

        {/* 상품 그리드 */}
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <MainProductCard key={product.dealIdx} product={product} favProducts={favProducts} />
          ))}
        </div>

        {/* 캠핑 후기 섹션 추가 */}
        <div className="seller-reviews">
          <h5>캠핑장 후기 상품</h5>
          <hr />
          <div className="review-grid">
            {sellerCampLogs.slice(0, 6).map((log) => (
              <div key={log.logIdx} className="review-item" onClick={() => router.push(`/camplog/detail/${log.logIdx}`)}>
                <div className="review-thumbnail">
                  <img
                    src={log.fileName ? `http://localhost:8080/upload/${log.fileName}` : "/images/campImageholder3.png"}
                    alt="캠핑 후기 썸네일" 
                    className="review-thumbnail-img"
                  />
                </div>
                <div className="review-content">
                  <h6>{log.logTitle}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyles = {
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