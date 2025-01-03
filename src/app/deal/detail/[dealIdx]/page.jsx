'use client'
import './detail.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Rating } from '@mui/material';
import useAuthStore from '../../../../../store/authStore';
import { useParams, useRouter } from 'next/navigation';
import ChatIcon from '@mui/icons-material/Chat';
import ReportIcon from '@mui/icons-material/Report';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Favorite from './favorite/page';
import ReportModal from './report/page';
import SatisfactionModal from './satisfaction/page';
import Link from 'next/link';

function Page({ params }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [item, setItem] = useState([]);                 // 데이터 상태
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태
  const { isAuthenticated, token, user } = useAuthStore(); // 로그인 상태
  const router = useRouter();
  const { dealIdx } = useParams();  // Next.js의 경우 const router = useRouter(); const { dealIdx } = router.query;
  const [mainImage, setMainImage] = useState('');
  const [smallImages, setSmallImages] = useState([]); // 작은 이미지 상태
  const [dealStatus, setDealStatus] = useState(''); // 판매 상태
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);  // 조회수 상태 추가
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSatisfactionModalOpen, setIsSatisfactionModalOpen] = useState(false);
  const [hasSatisfactionRating, setHasSatisfactionRating] = useState(false); // 만족도 등록 여부 상태 추가
  const [sellerOtherDeals, setSellerOtherDeals] = useState([]);
  const [sellerOtherFiles, setSellerOtherFiles] = useState([]);
  const [sellerScore, setSellerScore] = useState(0);
  const [sellerSatisfactions, setSellerSatisfactions] = useState([]);
  
  // isSellerUser를 여기서 먼저 선언
  const isSellerUser = user?.userIdx === item?.dealSellerUserIdx;
  
  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 기존 데이터 조회
        const API_URL = `${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`;
        const response = await axios.get(API_URL);
        const data = response.data;

        if (data.success) {
          setItem(data.data.deal);
          setViewCount(data.data.viewCount);          // deal02 값으로 판매 상태 설정
          setDealStatus(data.data.deal.deal02 || '판매중');  // 기본값은 '판매중'으로 설정

          // 이미지 처리 코드 추가
          const files = data.data.files;
          if (files && files.length > 0) {
            // 메인 이미지 (fileOrder가 0인 이미지)
            const mainImgObj = files.find(file => parseInt(file.fileOrder) === 0);
            setMainImage(`${LOCAL_IMG_URL}/${mainImgObj.fileName}`);

            // 모든 이미지를 순서대로 정렬하여 작은 이미지 목록에 추가
            const smallImgs = files
              .sort((a, b) => parseInt(a.fileOrder) - parseInt(b.fileOrder))
              .map(file => `${LOCAL_IMG_URL}/${file.fileName}`);
            setSmallImages(smallImgs);
          }
        } else {
          setError(data.message || '상품 정보를 불러올 수 없습니다.');
        }

        // 좋아요 개수 조회
        await getFavoriteCount();

        // 만족도 등록 여부 확인
        if (dealStatus === '판매완료' && !isSellerUser && user?.userIdx) {
          await checkSatisfactionRating();
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // dealIdx가 있을 때만 데이터 가져오기
    if (dealIdx) {
      fetchData();
    }
  }, [dealIdx, dealStatus, user?.userIdx, LOCAL_API_BASE_URL, LOCAL_IMG_URL, isSellerUser]);

  // 좋아요 개수 조회 함수
  const getFavoriteCount = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/favorite-count/${dealIdx}`);
      if (response.data.success) {
        setFavoriteCount(response.data.data);
      }
    } catch (error) {
      console.error('찜하기 개수 조회 실패:', error);
    }
  };

  // 좋아요 상태 변경 시 개수 업데이트를 위한 콜백
  const handleFavoriteChange = () => {
    getFavoriteCount();
  };

  // 초기 좋아요 개수 조회
  useEffect(() => {
    getFavoriteCount();
  }, [dealIdx]);

  // 만족도 등록 여부 확인 함수
  const checkSatisfactionRating = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/check-satisfaction/${dealIdx}`, {
        params: {
          userIdx: user?.userIdx
        }
      });
      setHasSatisfactionRating(response.data.exists);
    } catch (error) {
      console.error('만족도 확인 실패:', error);
    }
  };

  // 판매자의 다른 상품 조회 함수
  const fetchSellerOtherDeals = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/seller-other-deals/${dealIdx}`);
      if (response.data.success) {
        setSellerOtherDeals(response.data.data.deals);
        setSellerOtherFiles(response.data.data.files);
      }
    } catch (error) {
      console.error('판매자의 다른 상품 조회 실패:', error);
    }
  };

  // useEffect에 추가
  useEffect(() => {
    if (dealIdx) {
      fetchSellerOtherDeals();
    }
  }, [dealIdx]);

  // 판매자 평점 조회
  useEffect(() => {
    const fetchSellerScore = async () => {
      try {
        if (item?.dealSellerUserIdx) {
          const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/seller-score/${item.dealSellerUserIdx}`);
          
          if (response.data.success) {
            const score = parseFloat(response.data.data);
            const finalScore = isNaN(score) ? 5.0 : score;
            setSellerScore(finalScore);
          }
        } 
      } catch (error) {
        console.error('판매자 평점 조회 실패:', error);
        setSellerScore(5.0);
      }
    };

    fetchSellerScore();
  }, [item?.dealSellerUserIdx]);

  // 판매자 만족도 목록 조회
  useEffect(() => {
    const fetchSellerSatisfactions = async () => {
      try {
        if (item?.dealSellerUserIdx) {
          const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/seller-satisfaction/${item.dealSellerUserIdx}`);
          if (response.data.success) {
            setSellerSatisfactions(response.data.data);
          }
        }
      } catch (error) {
        console.error('판매자 만족도 조회 실패:', error);
      }
    };

    fetchSellerSatisfactions();
  }, [item?.dealSellerUserIdx]);

  // item이 null일 경우 처리 추가
  if (!item) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h2>상품 정보를 불러올 수 없습니다.</h2>
      </div>
    );
  }

  // 수정 버튼 클릭 시
  const handleUpdate = async () => {
    // 수정페이지로 이동
    router.push(`/deal/update/${item.dealIdx}`)
  }

  // 판매 상태 변경 함수
  const updateDealStatus = async (newStatus) => {
    try {
      const response = await axios.put(`${LOCAL_API_BASE_URL}/deal/status/${dealIdx}`, null, {
        params: {
          status: newStatus
        }
      });

      if (response.data.success) {
        setDealStatus(newStatus);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 만족도 모달 닫힐 때 만족도 상태 다시 확인
  const handleSatisfactionModalClose = () => {
    setIsSatisfactionModalOpen(false);
    checkSatisfactionRating(); // 모달이 닫힐 때 만족도 등록 여부 다시 확인
  };

  // 로딩 중
  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  }

  // 에러 발생 시
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h2>Error:</h2>
        <p>{error}</p>
      </div>
    );
  }
  // // 글 작성자와 현재 로그인한 사용자 비교 
  // const isOwner = isAuthenticated && String(user.m_id) === String(item.dealSellerUserIdx);
  // // 로딩 완료 후

  return (
    <>
      <div className="detail-container">
        <div className="product-main">
          {/* 이미지 컨테이너 */}
          <div className="images-container">
            {/* 작은 이미지 컨테이너 */}
            <div className="small-images">
              {smallImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`작은 이미지 ${index + 1}`}
                  className="small-image"
                  onClick={() => setMainImage(src)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            {/* 메인 이미지 컨테이너 */}
            <div className="main-image-container">
              <img
                src={mainImage}
                alt="상품 이미지"
                className="product-image"
              />
              {/* {item.dealview === 0 && (
                <div className="inactive-notice">
                  신고로 인해 본 게시물에 대한 게시가 중단되었습니다. 
                  소명이 필요한 경우 아래 고객센터(이메일)로 소명 내용을 보내주시기 바랍니다.
                </div>
              )} */}
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              <div className="title-favorite-container">
                <h2 style={{
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  {item.dealTitle}
                </h2>
                <div className="favorite-wrapper">
                  <Favorite />
                </div>
              </div>
            </div>
            <hr />

            <div className="price">{item.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</div>

            <div className="seller-info">
              <span>판매자</span>
              <span> {item.dealSellerNick}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style={{ fontWeight: 'bold', color: '#525050' }}>평점</span>
              <Rating 
                value={sellerScore} 
                precision={0.5} 
                readOnly 
                size="large"
                sx={{ 
                  '& .MuiRating-iconFilled': {
                    color: '#FFD700 !important'
                  },
                  '& .MuiRating-iconEmpty': {
                    color: '#C0C0C0 !important'
                  },
                  '& .MuiSvgIcon-root': {
                    display: 'block',
                    '& path': {
                      fill: 'currentColor'
                    }
                  },
                  marginLeft: '5px', 
                  marginRight: '5px',
                  verticalAlign: 'middle' 
                }}
              />
              <span style={{ verticalAlign: 'middle' }}>
                {sellerScore ? sellerScore.toFixed(1) : '5.0'}
              </span>

              &nbsp;&nbsp;&nbsp;
              <div className="action-buttons">
                <div 
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert('로그인이 필요한 서비스입니다.');
                      router.push('/user/login');
                      return;
                    }
                    router.push('/deal/message');
                  }}
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <ChatIcon
                    variant="contained"
                    className="message-btn"
                    style={{ fontSize: '2.3rem' }}
                    title="채팅"
                  />
                  <span>채팅</span>
                </div>
              </div>
            </div>

            <hr />

            <ul className="product-details">
              <li>
                <span>상품상태</span>
                &nbsp;
                <span> {item.dealStatus}</span>
              </li>
              <li>
                <span>배송비</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span> {item.dealPackage}</span>
              </li>
              <li>
                <span>직거래</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span> {item.dealDirect === "직거래 불가" ? "직거래 불가" : item.dealDirectContent}</span>
              </li>
              <li>
                <span>판매수량</span>
                &nbsp;
                <span> {item.dealCount} 개(건)</span>
              </li>
            </ul>

            <div className="product-stats">
              <div className="stat-item" style={{ pointerEvents: 'none' }}>
                <Favorite style={{ fontSize: '1rem' }} />
                <span>{favoriteCount}</span>
              </div>

              <div className="stat-item">
                <VisibilityIcon style={{ fontSize: '1.5rem' }} />
                <span>{viewCount}</span>
              </div>

              <div className="stat-item">
                <AccessTimeFilledIcon style={{ fontSize: '1.5rem' }} />
                <span>
                  {(() => {
                    const today = new Date();
                    const regDate = new Date(item.dealRegDate);
                    const diffTime = Math.floor((today - regDate) / (1000 * 60 * 60 * 24));
                    return diffTime === 0 ? "금일" : `${diffTime}일 전`;
                  })()}
                </span>
              </div>

              <div className="stat-item report">
                <div 
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert('로그인이 필요한 서비스입니다.');
                      router.push('/user/login');
                      return;
                    }
                    setIsReportModalOpen(true);
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px',
                    cursor: 'pointer' 
                  }}
                >
                  <ReportIcon />
                  <span>신고</span>
                </div>
              </div>
            </div>

            <div className="status-buttons" style={{ textAlign: 'center', margin: '40px' }}>
              <Button
                variant="contained"
                color={dealStatus === '판매중' ? 'primary' : 'default'}
                className={`status-button ${dealStatus === '판매중' ? 'selling' : 'completed'}`}
                style={{ 
                  cursor: isSellerUser ? 'pointer' : 'default'
                }}
                onClick={() => {
                  if (!isSellerUser) return;
                  
                  const isSelling = dealStatus === '판매중';
                  if (isSelling) {
                    if (window.confirm("판매 완료 상태로 변경 됩니다.")) {
                      updateDealStatus('판매완료');
                    }
                  } else {
                    if (window.confirm("판매 중 상태로 변경됩니다.")) {
                      updateDealStatus('판매중');
                    }
                  }
                }}
                disabled={!isSellerUser}
              >
                {dealStatus === '판매중' ? '판매중' : '판매완료'}
              </Button>

              {/* 판매 완료이고 판매자가 아닐 때만 만족도 버튼 표시 */}
              {dealStatus === '판매완료' && !isSellerUser && isAuthenticated ? (
                <Button
                  variant="contained"
                  color="success"
                  className="satisfaction-button"
                  onClick={() => setIsSatisfactionModalOpen(true)}
                  disabled={hasSatisfactionRating} // 만족도 등록 여부에 따라 버튼 비활성화
                >
                  {hasSatisfactionRating ? '만족도 등록 완료' : '만족도'}
                </Button>
              ) : dealStatus === '판매완료' && !isSellerUser && !isAuthenticated && (
                <Button
                  variant="contained"
                  color="success"
                  className="satisfaction-button"
                  onClick={() => {
                    alert('로그인이 필요한 서비스입니다.');
                    router.push('/user/login');
                  }}
                >
                  만족도
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="product-description">
          <h5>상품 설명</h5>
          <div className="deal-description">
            {item.dealDescription}
          </div>
        </div>

        {/* 수정하기 버튼은 판매자이고 판매중일 때만 표시 */}
        {isSellerUser && dealStatus === '판매중' && (
          <div className="edit-button-container">
            <Button
              variant="contained"
              color="darkgray"
              onClick={handleUpdate}
            >
              수정하기
            </Button>
          </div>
        )}

        {/* 관리자 수정 버튼 - admin만 볼 수 있음, admin 페이지 생성 시 삭제 */}
        {user?.userIdx === "25" && (
          <div className="edit-button-container">
            <Button
              variant="contained"
              color="warning"  // 관리자용 버튼임을 구분하기 위해 다른 색상 사용
              onClick={handleUpdate}
              style={{ marginLeft: '10px' }}
            >
              관리자 수정
            </Button>
          </div>
        )}

        <div className="seller-products">
          <h5>판매자의 다른 상품</h5>
          <hr />
          <div className="product-grid">
            {sellerOtherDeals.map((deal, index) => {
              const file = sellerOtherFiles[index];
              return (
                <div key={deal.dealIdx} className="product-item">
                  <Link href={`/deal/detail/${deal.dealIdx}`}>
                    <img
                      src={file?.fileName ? `${LOCAL_IMG_URL}/${file.fileName}` : '/default-product-image.jpg'}
                      alt={deal.dealTitle}
                      className="dealMain-image"
                      onError={(e) => {
                        e.target.src = '/default-product-image.jpg';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="product-content">
                      <div className="nick">{deal.dealSellerNick}</div>
                      <div className="title">{deal.dealTitle}</div>
                      <div className="price">
                        {deal.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
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
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        dealTitle={item.dealTitle}
        sellerNick={item.dealSellerNick}
      />
      <SatisfactionModal
        isOpen={isSatisfactionModalOpen}
        onClose={handleSatisfactionModalClose}
        dealIdx={dealIdx}
      />
    </>
  );
}

export default Page;