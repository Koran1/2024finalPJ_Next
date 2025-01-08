// components/Navigation.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '../../store/authStore'; // useAuthStore 가져오기

const Navigation = (params) => {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const [item, setItem] = useState([]);                 // 데이터 상태 
  const [loading, setLoading] = useState(true);           // 로딩 상태
  const [error, setError] = useState(null);               // 에러 상태
  const { user } = useAuthStore(); // user 값을 Navigation 내에서 가져오기
  const router = useRouter();
  const [activeLink, setActiveLink] = useState(router.pathname); // 현재 경로로 초기값 설정

//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//             setLoading(true); // 로딩 시작

//             const { userIdx } = await Promise.resolve(params);
//             const API_URL = `${LOCAL_API_BASE_URL}/deal/management/${userIdx}`;

//             // 데이터 가져오기
//             const response = await axios.get(API_URL);
//             // const data = response.data;
//             // console.log(response.data);
//             if (response.data.success) {
//                 console.log("setItem: 이거 데이터.데이터", response.data.data);
//                 setItem(response.data.data);
//             } else {
//                 setError("Failed to fetch product data.");
//             }
//         } catch (err) {
//             console.error("Error fetching product data:", err);
//             setError("Failed to fetch product data.");
//         } finally {
//             setLoading(false); // 로딩 종료
//         }
//     };

//     fetchData();
// }, [params, LOCAL_API_BASE_URL]);

// if (loading) return <div>Loading...</div>;
// if (error) return <div>Error: {error}</div>;

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
