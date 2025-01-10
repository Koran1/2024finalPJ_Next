'use client'
import { useState, useEffect, useRef } from 'react';
import './satisfaction.css';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import useAuthStore from '../../../../../../store/authStore';
import { Rating } from '@mui/material';

function SatisfactionModal({ isOpen, onClose, dealIdx }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [sellerInfo, setSellerInfo] = useState(null);
  const { user, token } = useAuthStore();
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.satisfaction-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 판매자 정보 가져오기
  useEffect(() => {
    if (isOpen && dealIdx) {
      const fetchSellerInfo = async () => {
        try {
          const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`);
          if (response.data.success) {
            const dealData = response.data.data.deal;
            setSellerInfo({
              userIdx: dealData.dealSellerUserIdx,
              nickname: dealData.dealSellerNick
            });
          }
        } catch (error) {
          console.error('판매자 정보 조회 실패:', error);
        }
      };
      fetchSellerInfo();
    }
  }, [isOpen, dealIdx]);

  const handleSubmit = async () => {
    if (!sellerInfo) {
      alert('판매자 정보를 불러올 수 없습니다.');
      return;
    }

    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('구매 후기를 작성해주세요.');
      return;
    }

    try {
      const satisfactionData = {
        dealSatisSellerUserIdx: sellerInfo.userIdx,
        dealSatisSellerNick: sellerInfo.nickname,
        dealSatisBuyerUserIdx: user.userIdx,
        dealSatisBuyerNick: user.nickname,
        dealSatisBuyerContent: content,
        dealSatisSellerScore: rating,
        dealSatis01: dealIdx,
      };

      const response = await axios.post(`${LOCAL_API_BASE_URL}/deal/satisfaction`, satisfactionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('만족도 평가가 등록되었습니다.');
        window.location.reload();
        onClose();
      } else {
        alert(response.data.message || '만족도 평가 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('만족도 평가 등록 실패:', error);
      alert('만족도 평가 등록 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setRating(0);
      setContent('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div
        className="satisfaction-modal"
        ref={modalRef}
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
        }}
      >
        <div className="satisfaction-header" onMouseDown={handleMouseDown}>
          <div className="header-content">
            <h2>만족도</h2>
            <hr />
            <span>만족도를 평가 해주세요</span>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="satisfaction-form">
          <div className="stars-container">
            <Rating
              name="rating"
              value={rating}
              precision={1}
              size="large"
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              sx={{
                fontSize: '2.4rem',
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
                }
              }}
            />
          </div>
          <div className="form-group">
            <label>구매 후기</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="구매 후 만족도 평가 사유를 간략히 기재해주세요.(100자 이내)"
              maxLength={100}
            />
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </>
  );
}

export default SatisfactionModal; 