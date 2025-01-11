'use client'
import './detail.css';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
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
  const { isAuthenticated, isExpired, user, token } = useAuthStore(); // 로그인 상태
  const router = useRouter();
  const { dealIdx } = useParams();  // Next.js의 경우 const router = useRouter(); const { dealIdx } = router.query;
  const [mainImage, setMainImage] = useState('');
  const [smallImages, setSmallImages] = useState([]); // 작은 이미지 상태
  const [dealStatus, setDealStatus] = useState(''); // 판매 상태
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);  // 조회수 상태 추가
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [sellerOtherDeals, setSellerOtherDeals] = useState([]);
  const [sellerOtherFiles, setSellerOtherFiles] = useState([]);
  const [sellerScore, setSellerScore] = useState(0);
  const [sellerSatisfactions, setSellerSatisfactions] = useState([]);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sellerCampLogs, setSellerCampLogs] = useState([]);

  // isSellerUser를 여기서 먼저 선언
  const isSellerUser = user?.userIdx === item?.dealSellerUserIdx;

  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_URL = `${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`;
        const response = await axios.get(API_URL);
        const data = response.data;

        if (data.success) {
          const dealData = data.data.deal;

          // dealview가 0이고 판매자가 아닌 경우 상품 정보를 숨김
          if (dealData.dealview === 0 && user?.userIdx !== dealData.dealSellerUserIdx) {
            setError('상품 정보를 볼 수 없습니다.');
            setLoading(false);
            return;
          }

          setItem(dealData);
          setViewCount(data.data.viewCount);
          setDealStatus(dealData.deal02 || '판매중');

          // 이미지 처리
          const files = data.data.files;
          if (files && files.length > 0) {
            const mainImgObj = files.find(file => parseInt(file.fileOrder) === 0);
            setMainImage(`${LOCAL_IMG_URL}/deal/${mainImgObj.fileName}`);

            const smallImgs = files
              .sort((a, b) => parseInt(a.fileOrder) - parseInt(b.fileOrder))
              .map(file => `${LOCAL_IMG_URL}/deal/${file.fileName}`);
            setSmallImages(smallImgs);
          }
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (dealIdx) {
      fetchData();
    }
  }, [dealIdx, user?.userIdx, router, LOCAL_API_BASE_URL, LOCAL_IMG_URL]);

  // 찜 개수 조회 함수
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

  // 찜 상태 변경 시 개수 업데이트를 위한 콜백
  const handleFavoriteChange = () => {
    getFavoriteCount();
  };

  // 초기 찜 개수 조회
  useEffect(() => {
    getFavoriteCount();
  }, [dealIdx]);

  // 판매자의 다른 상품 조회 함수
  const fetchSellerOtherDeals = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/seller-other-deals/${dealIdx}`);
      if (response.data.success) {
        // dealview가 0인 상품은 판매자에게만 보이도록 필터링
        const filteredDeals = response.data.data.deals.filter(deal =>
          deal.dealview === 1 ||
          (deal.dealview === 0 && user?.userIdx === deal.dealSellerUserIdx)
        );
        setSellerOtherDeals(filteredDeals);
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

  // useEffect 추가
  useEffect(() => {
    if (user?.userIdx) {
      // 각 상품의 찜 상태 초기화
      const initFavorites = {};
      sellerOtherDeals.forEach(deal => {
        initFavorites[deal.dealIdx] = false;
      });
      setFavoriteStates(initFavorites);

      // 찜 상태 확인
      sellerOtherDeals.forEach(async (deal) => {
        try {
          const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/like-status`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
              userIdx: user.userIdx,
              dealIdx: deal.dealIdx
            }
          });
          setFavoriteStates(prev => ({
            ...prev,
            [deal.dealIdx]: response.data.data
          }));
        } catch (error) {
          console.error("Failed to fetch like status:", error);
        }
      });
    }
  }, [sellerOtherDeals, user?.userIdx]);

  // 찜하기 토글 함수 추가
  const toggleFavorite = async (dealIdx) => {
    if (!isAuthenticated || isExpired()) {
      alert('로그인이 필요한 서비스입니다.');
      router.push("/user/login");
      return;
    }

    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/like`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          userIdx: user.userIdx,
          dealIdx: dealIdx,
          isLiked: String(favoriteStates[dealIdx])
        }
      });

      if (response.data.success) {
        setFavoriteStates(prev => ({
          ...prev,
          [dealIdx]: !prev[dealIdx]
        }));
      }
    } catch (error) {
      console.error("Like toggle error:", error);
      alert('찜 처리 중 오류가 발생했습니다.');
    }
  };

  // useEffect 수정
  useEffect(() => {
    const fetchSellerCampLogs = async () => {
      try {
        if (!item?.dealSellerUserIdx) return;

        const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/seller-camplogs/${item.dealSellerUserIdx}`);
        setSellerCampLogs(response.data.success ? response.data.data : []);
      } catch (error) {
        console.error('판매자의 캠핑장 후기 조회 실패:', error);
        setSellerCampLogs([]);
      }
    };

    fetchSellerCampLogs();
  }, [item?.dealSellerUserIdx, LOCAL_API_BASE_URL]);

  // 이미지 배열 생성 (useMemo 사용)
  const images = useMemo(() => {
    if (!smallImages) return [];
    return smallImages.map(image => image);
  }, [smallImages]);

  // 이미지 클릭 핸들러 수정
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  // 이미지 네비게이션 핸들러 수정
  const handleModalPrevImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex - 1 + smallImages.length) % smallImages.length;
    setCurrentImageIndex(newIndex);
    setMainImage(smallImages[newIndex]);
  };

  const handleModalNextImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex + 1) % smallImages.length;
    setCurrentImageIndex(newIndex);
    setMainImage(smallImages[newIndex]);
  };

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
      const response = await axios.put(`${LOCAL_API_BASE_URL}/deal/status/${dealIdx}`, 
        { status: newStatus },  // 데이터를 body에 포함
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setDealStatus(newStatus);
        alert('거래 상태가 업데이트되었습니다.');
      } else {
        alert('거래 상태 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('거래 상태 업데이트 실패:', error);
      alert('거래 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  // 이미지 변경 시 currentImageIndex도 업데이트하는 함수 추가
  const handleImageChange = (src) => {
    setMainImage(src);
    setCurrentImageIndex(smallImages.indexOf(src));
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
                  src={src || '/default-product-image.jpg'}
                  alt={`작은 이미지 ${index + 1}`}
                  className="small-image"
                  onClick={() => handleImageChange(src)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            {/* 메인 이미지 컨테이너 */}
            <div className="main-image-container">
              <img
                src={mainImage}
                alt="상품 메인 이미지"
                className="product-image"
                onClick={() => handleImageClick(currentImageIndex)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          <div className="product-info" style={{
            width: '55%',  // 기존 50%에서 55%로 증가
            paddingLeft: '20px'  // 왼쪽 여백 추가
          }}>
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

            <div className="price">
              {Number(item.dealPrice) === 0 ? "나눔" : `${item.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
            </div>

            <div className="seller-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>판매자</span>
                &nbsp;&nbsp;
                <span>{item.dealSellerNick}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
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
              </div>

              <div className="action-buttons" style={{ marginLeft: 'auto' }}>
                <div
                  onClick={() => {
                    if (!isAuthenticated || isExpired()) {
                      alert('로그인이 필요한 서비스입니다.');
                      router.push('/user/login');
                      return;
                    }
                    if (user.userIdx != item.dealSellerUserIdx) {
                      router.push(`/deal/message?seller=${item.dealSellerUserIdx}&dealIdx=${item.dealIdx}`);
                    } else {
                      router.push(`/deal/message`)
                    }
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
                    return diffTime === 0 ? "금일" : `${diffTime}일전`;
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
            </div>
          </div>
        </div>

        {/* 신고된 상품 알림 - 상품 설명 제목 바로 위에 배치 */}
        {item.dealview === 0 && (
          <div className="inactive-notice2">
            <p>신고로 인해 본 게시물에 대한 게시가 중단되었습니다.</p>
            <p>소명이 필요한 경우 아래 고객센터로 소명 내용을 보내주시기 바랍니다.</p>
            <p className="email">이메일: <a href="mailto:ICT5@service.com">ICT5@service.com</a></p>
          </div>
        )}

        <div className="product-description">
          <h5>상품 설명</h5>
          <div className="deal-description">
            {item.dealDescription}
          </div>
        </div>

        {/* 수정하기 버튼은 판매자이고 판매중일 때만 표표시 */}
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

        {/* 관리자 수정 버튼 - admin만 볼 수 있음 */}
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
                  {deal.dealview === 0 && (
                    <div className="inactive-notice">
                      Disabled
                    </div>
                  )}
                  <div className="heart-icon" onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(deal.dealIdx);
                  }}>
                    {favoriteStates[deal.dealIdx] ? (
                      <span className="filled-heart">❤️</span>
                    ) : (
                      <span className="empty-heart">🤍</span>
                    )}
                  </div>
                  <Link href={`/deal/detail/${deal.dealIdx}`}>
                    <img
                      src={file?.fileName ? `${LOCAL_IMG_URL}/deal/${file.fileName}` : '/default-product-image.jpg'}
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
                        {Number(deal.dealPrice) === 0 ? "나눔" : `${deal.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="seller-reviews">
          <h5>판매자의 캠핑장 후기 상품</h5>
          <hr />
          <div className="review-grid">
            {sellerCampLogs.length > 0 ? (
              sellerCampLogs.map((log) => (
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
              ))
            ) : (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 0",
                color: "#666"
              }}>
                판매자가 작성한 캠핑장 후기가 존재하지 않습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 신고 모달 컴포넌트 */}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          dealTitle={item.dealTitle}
          sellerNick={item.dealSellerNick}
          dealIdx={dealIdx}
          sellerUserIdx={item.dealSellerUserIdx}
        />
      )}

      {/* 이미지 모달 */}
      {isImageModalOpen && (
        <div className="image-modal-overlay" onClick={() => setIsImageModalOpen(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={smallImages[currentImageIndex]}
              alt="확대된 상품 이미지"
              className="modal-image"
            />
            <button
              className="close-modal-btn"
              onClick={() => setIsImageModalOpen(false)}
            >
              ✕
            </button>
            {smallImages.length > 1 && (
              <>
                <button
                  className="nav-btn prev-btn"
                  onClick={handleModalPrevImage}
                >
                  ❮
                </button>
                <button
                  className="nav-btn next-btn"
                  onClick={handleModalNextImage}
                >
                  ❯
                </button>
                <div className="image-counter">
                  {currentImageIndex + 1} / {smallImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Page;