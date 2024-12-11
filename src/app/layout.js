"use client";
import './globals.css';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main/main.css';
import DealMain from './deal/page';


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


  return (
    <html lang="en">
      <body>
        <header data-bs-theme="light" style={{ height: '20px' }}>
          <nav className="navbar navbar-expand-md navbar-dark fixed-top" style={{ backgroundColor: 'white' }}>
            <div className="container-fluid">
              <a className="navbar-brand" href="/" style={{ color: 'black', fontSize: '32px', fontFamily: "'Jaro', sans-serif" }}>CAMPERS</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                  <li className="nav-item">
                    <Link className="nav-link active" href="/" style={{ color: 'black' }}>캠핑장검색</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" href="/" style={{ color: 'black' }}>캠핑로그</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" href="/deal" style={{ color: 'black' }}>나의거래</Link>
                  </li>
                </ul>
                <div style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                  <Avatar src="/images/kitten-3.jpg" />
                  <div style={{ marginLeft: '10px' }}>냐옹이님 환영합니다</div>
                </div>
                {/*<div class="dropdown text-end">
                   <a href="/go_my_page" class="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
			              <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
			            </a>
			        <ul class="dropdown-menu text-small">
	            <c:choose>
				 <c:when test="${empty userId}">
	            		<li><a class="dropdown-item" href="/mem_login">Sign in</a></li>
	             </c:when>
				 <c:otherwise>
			            <li><a class="dropdown-item" href="/go_my_page">My Page</a></li>
			            <li><hr class="dropdown-divider"></li>
					 	<li><a class="dropdown-item" href="/mem_logout">Sign out</a></li>
				 </c:otherwise>
				</c:choose>
	          </ul>
	        </div> */}
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
