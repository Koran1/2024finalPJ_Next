"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAuthStore from './../../../../../store/authStore'
import { useParams, useRouter } from 'next/navigation'

function Favorite() {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { dealIdx } = useParams();
  const userIdx = user?.userIdx;
  const router = useRouter();

  useEffect(() => {
      if (!isAuthenticated || !dealIdx) return;

      axios.get(`${LOCAL_API_BASE_URL}/deal/like-status`, {
          params: { userIdx, dealIdx }
      })
      .then(({ data }) => {
          setIsLiked(data.data);
      })
      .catch((error) => {
          console.error("Failed to fetch like status:", error);
      });
  }, [isAuthenticated, userIdx, dealIdx, LOCAL_API_BASE_URL]);

  const handleLike = async () => {
      if (!isAuthenticated) {
          router.push("/user/login");
          return;
      }

      try {
          await axios.get(`${LOCAL_API_BASE_URL}/deal/like`, {
              params: { userIdx, dealIdx, isLiked }
          });
          setIsLiked(!isLiked);
      } catch (error) {
          console.error("Failed to toggle like:", error);
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

export default Favorite;