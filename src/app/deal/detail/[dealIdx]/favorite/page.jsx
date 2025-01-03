"use client"
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import useAuthStore from '../../../../../../store/authStore'
import { useParams, useRouter } from 'next/navigation'

function Page({ onFavoriteChange }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated, user, isExpired } = useAuthStore();
  const { dealIdx } = useParams();
  const router = useRouter();

  // 좋아요 상태 체크 함수
  const checkLikeStatus = useCallback(async () => {
    if (!isAuthenticated || !user?.userIdx || !dealIdx) return;

    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/like-status`, {
        params: {
          userIdx: user.userIdx,
          dealIdx
        }
      });
      console.log("Like status response:", response.data.data);
      setIsLiked(response.data.data);
    } catch (error) {
      console.error("Failed to fetch like status:", error);
    }
  }, [isAuthenticated, user?.userIdx, dealIdx, LOCAL_API_BASE_URL]);

  useEffect(() => {
    checkLikeStatus();
  }, [checkLikeStatus]);

  const handleLike = async () => {
    if (!isAuthenticated || isExpired()) {
      alert('로그인이 필요한 서비스입니다.');
      router.push("/user/login");
      return;
    }

    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/like`, {
        params: {
          userIdx: user.userIdx,
          dealIdx: dealIdx,
          isLiked: String(isLiked)
        }
      });

      if (response.data.success) {
        setIsLiked(!isLiked);
        if (onFavoriteChange) {
          onFavoriteChange();
        }
      } else {
        const errorMessage = response.data.message || '찜 상태 변경에 실패했습니다.';
        console.error("Like toggle failed:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Like toggle error:", error);
      alert('찜 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <button
      className="like-btn"
      onClick={handleLike}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '2rem',
        cursor: 'pointer'
      }}
    >
      {isLiked ? '❤️' : '🤍'}
    </button>
  );
}

export default Page;