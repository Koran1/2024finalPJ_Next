// components/Navigation.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '../../store/authStore'; // useAuthStore 가져오기

const Navigation = (params) => {
  const { user } = useAuthStore(); // user 값을 Navigation 내에서 가져오기
  const router = useRouter();
  const [activeLink, setActiveLink] = useState(router.pathname); // 현재 경로로 초기값 설정

  // Function to determine the active class
  const getActiveClass = (link) => {
    return activeLink === link ? 'active' : '';
  };

  const links = [
    { href: `/deal/management/${user.userIdx}`, label: '상품관리' },
    { href: `/deal/purchase/`, label: '구매 내역' },

    // user.userIdx 넣으면 안되는 이유..
    { href: `/deal/interest/${user.userIdx}`, label: '관심목록' },
    { href: `/deal/rating/`, label: '나의평점' },
    { href: `/deal/message/`, label: '채팅목록' }
  ];

  useEffect(() => {
    // 페이지가 바뀔 때마다 activeLink를 업데이트
    setActiveLink(router.pathname);
  }, [router.pathname]);

  return (
    <div>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`btn1 ${getActiveClass(href)}`} // getActiveClass로 활성화 클래스를 추가
          onClick={() => setActiveLink(href)} // 클릭 시 activeLink 업데이트
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
