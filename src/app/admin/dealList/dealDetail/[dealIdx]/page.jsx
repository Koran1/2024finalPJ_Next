'use client'
import './dealDetail.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Rating } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Favorite from '../[dealIdx]/favorite/page';
import Link from 'next/link';
import useAuthStore from '../../../../../../store/authStore';
import AdminList from '../../../AdminList';

function Page({ params }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [item, setItem] = useState([]);                 // 데이터 상태
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태
  const { isAuthenticated, isExpired, user } = useAuthStore(); // 로그인 상태
  const router = useRouter();
  const { dealIdx } = useParams();  // Next.js의 경우 const router = useRouter(); const { dealIdx } = router.query;
  const [mainImage, setMainImage] = useState('');
  const [smallImages, setSmallImages] = useState([]); // 작은 이미지 상태
  const [dealStatus, setDealStatus] = useState(''); // 판매 상태
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);  // 조회수 상태 추가
  const [sellerOtherDeals, setSellerOtherDeals] = useState([]);
  const [sellerOtherFiles, setSellerOtherFiles] = useState([]);
  const [sellerScore, setSellerScore] = useState(0);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [sellerCampLogs, setSellerCampLogs] = useState([]); // 상태 추가


  // isSellerUser를 여기서 먼저 선언
  const isSellerUser = user?.userIdx === item?.dealSellerUserIdx;

  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_URL = `${LOCAL_API_BASE_URL}/admin/dealList/dealDetail/${dealIdx}`;
        const response = await axios.get(API_URL);
        const data = response.data;

        if (data.success) {
          const dealData = data.data;
          
          setItem(dealData);
          setViewCount(data.data.viewCount || 0);
          setDealStatus(dealData.deal02 || '판매중');

          // 이미지 처리
          if (dealData.fileList && dealData.fileList.length > 0) {
            // 메인 이미지 (첫 번째 이미지)
            const mainImgObj = dealData.fileList.find(file => parseInt(file.fileOrder) === 0);
            setMainImage(mainImgObj 
              ? `${LOCAL_IMG_URL}/deal/${mainImgObj.fileName}`
              : '/default-product-image.jpg'
            );

            // 작은 이미지들
            const smallImgs = dealData.fileList
              .sort((a, b) => parseInt(a.fileOrder) - parseInt(b.fileOrder))
              .map(file => `${LOCAL_IMG_URL}/deal/${file.fileName}`);
            setSmallImages(smallImgs);
          } else {
            setMainImage('/default-product-image.jpg');
            setSmallImages(['/default-product-image.jpg']);
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
  }, [dealIdx, LOCAL_API_BASE_URL, LOCAL_IMG_URL]);

  // 좋아요 개수 조회 함수
  const getFavoriteCount = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/admin/dealList/dealDetail/favorite-count/${dealIdx}`);
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


  // 판매자의 다른 상품 조회 함수
  const fetchSellerOtherDeals = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/admin/dealList/dealDetail/seller-other-deals/${dealIdx}`);
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
          const response = await axios.get(`${LOCAL_API_BASE_URL}/admin/dealList/dealDetail/seller-score/${item.dealSellerUserIdx}`);

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
          const response = await axios.get(`${LOCAL_API_BASE_URL}/admin/dealList/dealDetail/like-status`, {
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
      const response = await axios.get(`${LOCAL_API_BASE_URL}/admin/dealList/dealDetail/like`, {
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

  // useEffect 추가 (판매자의 캠핑장 후기 조회)
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
      const response = await axios.put(`${LOCAL_API_BASE_URL}/admin/dealList/dealDetail/status/${dealIdx}`, null, {
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

  const handleStatusChange = async (dealIdx, currentStatus) => {
    try {
      // currentStatus가 1이면 0으로, 0이면 1로 변경
      const newStatus = currentStatus === 1 ? 0 : 1;
      
      const response = await axios.put(`${LOCAL_API_BASE_URL}/admin/dealList/${dealIdx}`, {
        dealview: newStatus
      });
      
      if (response.data.success) {
        // 상태 업데이트
        setItem(prev => ({
          ...prev,
          dealview: newStatus
        }));
        
        // 성공 메시지 표시
        alert(newStatus === 0 ? '상품이 비활성화되었습니다.' : '상품이 활성화되었습니다.');
        
        // 페이지 새로고침
        router.refresh();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert('상태 변경에 실패했습니다.');
    }
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
    <div style={{ display: 'flex' }}>
      <AdminList />
      <div style={{ flex: 1, padding: '20px' }}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="product-detail-container">
            <div className="product-main">
              <div className="product-images">
                <div className="small-images">
                  {smallImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Small ${index + 1}`}
                      onClick={() => setMainImage(img)}
                      className={mainImage === img ? 'active' : ''}
                    />
                  ))}
                </div>
                <div className="main-image">
                  <img src={mainImage} alt="Main" />
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

                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="action-buttons">
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
                        return diffTime === 0 ? "금일" : `${diffTime}일 전`;
                      })()}
                    </span>
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



            {/* 신고된 상품 알림 */}
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

            <div className="admin-buttons-container">
              <Button
                className={`status-toggle-button ${item.dealview === 1 ? 'active' : 'inactive'}`}
                onClick={() => handleStatusChange(item.dealIdx, item.dealview)}
                variant="contained"
                color={item.dealview === 1 ? "primary" : "error"}
              >
                {item.dealview === 1 ? "Active" : "InActive"}
              </Button>

              <Button
                className="admin-edit-button"
                variant="contained"
                color="warning"
                onClick={handleUpdate}
              >
                관리자 수정
              </Button>
            </div>

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
                      <Link href={`/admin/dealList/dealDetail/${deal.dealIdx}`}>
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
        )}
      </div>
    </div>
  );
}

export default Page;