"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAuthStore from '../../../../../../store/authStore'
import { useParams, useRouter } from 'next/navigation'

function Page({ onFavoriteChange }) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { dealIdx } = useParams();
  const userIdx = user?.userIdx;
  const router = useRouter();

  useEffect(() => {
    console.log("Current auth state:", { 
        isAuthenticated, 
        user, 
        userIdx 
    });
    if (!isAuthenticated || !dealIdx || !userIdx) return;

    axios.get(`${LOCAL_API_BASE_URL}/deal/like-status`, {
      params: { 
        userIdx: userIdx,
        dealIdx 
      }
    })
    .then(({ data }) => {
      setIsLiked(data.data);
    })
    .catch((error) => {
      console.error("Failed to fetch like status:", error);
    });
  }, [isAuthenticated, user, userIdx, dealIdx, LOCAL_API_BASE_URL]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push("/user/login");
      return;
    }

    console.log("Attempting like toggle with:", {
      userIdx,
      dealIdx,
      isLiked
    });

    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/like`, {
        params: {
          userIdx: userIdx,
          dealIdx: dealIdx,
          isLiked: String(isLiked)
        }
      });
      console.log("Like toggle response:", response.data);

      if (response.data.success) {
        setIsLiked(!isLiked);
        if (onFavoriteChange) {
          onFavoriteChange();
        }
      } else {
        alert('찜 상태 변경에 실패했습니다.');
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