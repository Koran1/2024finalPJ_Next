'use client'
import { useState, useEffect, useRef } from 'react';
import './satisfaction.css';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function SatisfactionModal({ isOpen, onClose, dealIdx }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

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

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${LOCAL_API_BASE_URL}/deal/satisfaction`, {
        dealIdx,
        dealSatisBuyerScore: rating,
        dealSatisBuyerContent: content
      });

      if (response.data.success) {
        alert('평가가 정상적으로 등록 되었습니다.');
        onClose();
      } else {
        alert('평가 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('만족도 평가 등록 실패:', error);
      alert('평가 등록 중 오류가 발생했습니다.');
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
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="star"
                onClick={() => setRating(star)}
              >
                {star <= rating ? (
                  <StarIcon 
                    sx={{ 
                      fontSize: '2.4em', 
                      color: '#FFD700',
                      cursor: 'pointer'
                    }} 
                  />
                ) : (
                  <StarBorderIcon 
                    sx={{ 
                      fontSize: '2.4em', 
                      color: '#ccc',
                      cursor: 'pointer'
                    }} 
                  />
                )}
              </span>
            ))}
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