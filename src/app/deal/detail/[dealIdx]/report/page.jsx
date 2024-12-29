'use client'
import { useState, useEffect, useRef } from 'react';
import './report.css';

function ReportModal({ isOpen, onClose, dealTitle, sellerNick }) {
  const [selectedReason, setSelectedReason] = useState('스팸홍보/도배글입니다.');
  const [description, setDescription] = useState('');
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const reasons = [
    '스팸홍보/도배글입니다.',
    '음란물입니다.',
    '불법정보를 포함하고 있습니다.',
    '청소년에게 유해한 내용입니다.',
    '욕설/생명경시/혐오/차별적 표현입니다.',
    '개인정보 노출 게시물입니다.',
    '불쾌한 표현이 있습니다.'
  ];

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setSelectedReason(reasons[0]);
      setDescription('');
    }
  }, [isOpen]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.report-header')) {
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

  const handleSubmit = () => {
    if (window.confirm('신고를 완료하시겠습니까?')) {
      // 신고 처리 로직
      console.log({
        reason: selectedReason,
        description,
        dealTitle,
        sellerNick
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div
        className="report-modal"
        ref={modalRef}
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
        }}
      >
        <div className="report-header" onMouseDown={handleMouseDown}>
          <h2>신고하기</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
          <hr />
        <div className="report-form">
          <div className="form-group">
            <label>작성자</label>
            <span> 블랙고양이</span>
          </div>
          <div className="form-group">
            <label>신고 사유</label>
            <div className="radio-group">
              {reasons.map((reason) => (
                <div key={reason} className="radio-option">
                  <input
                    type="radio"
                    id={reason}
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />
                  <label htmlFor={reason}>{reason}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>상세 내용</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상세 내용을 입력해주세요."
            />
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            신고하기
          </button>
        </div>
      </div>
    </>
  );
}

export default ReportModal;
