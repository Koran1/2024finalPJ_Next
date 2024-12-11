"use client";
import './globals.css';
import { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main/main.css';
import { Collapse } from 'bootstrap';


// layout.js는 선택이다 (RootLayout 제외)
// layout이 필요없는 간단한 페이지에서는 생략 가능
// 페이지 전체의 공통구조를 랜더링 할 때 사용

// zustand store 호출
import useAuthStore from '../../store/authStore';
import { Avatar } from '@mui/material';
import Link from 'next/link';

// 부모 컴포넌트
export default function RootLayout({ children }) {
  // zustand 상태 가져오기
  const { isAuthenticated, user, logout } = useAuthStore();
  const handleLogout = () => {
    // zustand에 있는 함수 호출
    logout();
    alert("로그아웃 되었습니다")
  }

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const jaro = {
    fontFamily: "'Jaro', sans-serif",
    fontOpticalSizing: "auto",
    fontWeight: 400,
    fontStyle: "normal"
  };

  // Collapse 상태를 관리하기 위한 useRef 추가
  const navbarCollapseRef = useRef(null);
  const bsCollapseRef = useRef(null);

  useEffect(() => {
    const collapseElement = navbarCollapseRef.current;
    if (collapseElement) {
      bsCollapseRef.current = new Collapse(collapseElement, { toggle: false });
    }
    return () => {
      if (bsCollapseRef.current) {
        bsCollapseRef.current.dispose();
      }
    };
  }, []);

  // 메뉴 클릭 시 네비게이션 바를 닫는 함수
  const handleNavLinkClick = () => {
    if (bsCollapseRef.current) {
      bsCollapseRef.current.hide();
    }
  };

  return (
    <html lang="en">
      <body>
        <header data-bs-theme="light" style={{ height: '20px' }}>
          <nav className="navbar navbar-expand-md navbar-dark fixed-top" style={{ backgroundColor: 'white' }}>
            <div className="container-fluid">
              <a className="navbar-brand" href="/" style={{ color: 'black', fontSize: '240%', fontFamily: "'Jaro', sans-serif", marginRight: '50px' }}>CAMPERS</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" style={{backgroundColor: 'gray'}}>
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse" ref={navbarCollapseRef}>
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                  <li className="nav-item">
                    <Link className="nav-link active" href="/" style={{ color: 'black', fontSize: '150%' }} onClick={handleNavLinkClick}>캠핑장검색</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" href="/" style={{ color: 'black', fontSize: '150%' }} onClick={handleNavLinkClick}>캠핑로그</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" href="/deal" style={{ color: 'black', fontSize: '150%' }} onClick={handleNavLinkClick}>나의거래</Link>
                  </li>
                </ul>
                <div style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                  <Avatar src="/images/kitten-3.jpg" />
                  <div style={{ marginLeft: '10px' }}>냐옹이님 환영합니다</div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <hr />
        {children}
        <hr />
        <footer className="container">
          <p className="float-end"><a href="#">Back to top</a></p>
          <p>&copy; 2024-2025 ICT Company, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
        </footer>
      </body>
    </html>
  );
}
