"use client";
import './globals.css';
import { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// zustand store 호출
import useAuthStore from '../../store/authStore';
import { Avatar, Menu, MenuItem, Badge, Button } from '@mui/material';
import Link from 'next/link';
import { MailOutline } from '@mui/icons-material';

// 부모 컴포넌트
export default function RootLayout({ children }) {
  // zustand 상태 가져오기
  const { isAuthenticated, user, logout } = useAuthStore();
  const handleLogout = () => {
    // zustand에 있는 함수 호출
    logout();
    alert("로그아웃 되었습니다");
  }

  const handelLogin = () => {
    router
  }

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
    // 클라이언트 사이드에서만 Bootstrap JS를 동적으로 임포트
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then((module) => {
      const Collapse = module.Collapse;
      const collapseElement = navbarCollapseRef.current;
      if (collapseElement) {
        bsCollapseRef.current = new Collapse(collapseElement, { toggle: false });
      }
    }).catch(err => {
      console.error("Bootstrap JS 로드 실패:", err);
    });

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
  const [photo, setPhoto] = useState(null);
  const [isShow, setIsShow] = useState(false);

  const handlePhotoClick = (e) => {
    setIsShow(!isShow);
    isShow ? setPhoto(null) : setPhoto(e.currentTarget);
  }

  // 임의 예약정보 Idx
  const bookIdx = "34";

  return (
    <html lang="en">
      <body>
        <header data-bs-theme="dark" style={{ height: '38px' }}>
          <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark" >
            <div className="container-fluid">
              <a className="navbar-brand" href="/" style={{ fontSize: '250%', fontFamily: "'Jaro', sans-serif", marginRight: '50px' }}>CAMPERS</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse" ref={navbarCollapseRef}>
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                  <li className="nav-item">
                    <Link className="nav-link active" href="/camp" style={{ fontSize: '180%', fontFamily: "Do Hyeon, sans-serif", marginRight: '30px' }} onClick={handleNavLinkClick}>캠핑장소</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" href="/camplog/list" style={{ fontSize: '180%', fontFamily: "Do Hyeon, sans-serif", marginRight: '30px' }} onClick={handleNavLinkClick}>캠핑로그</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" href="/deal/dealMain" style={{ fontSize: '180%', fontFamily: "Do Hyeon, sans-serif" }} onClick={handleNavLinkClick}>캠핑마켓</Link>
                  </li>
                </ul>

                {isAuthenticated ? (
                  <>
                    <Badge badgeContent={4} color="primary" >
                      <Link href='/mypage'>
                        <MailOutline style={{ color: 'white', width: '40px', height: '40px' }} />
                      </Link>
                    </Badge>
                    <Avatar onClick={handlePhotoClick} src="/images/kitten-3.jpg" style={{ marginRight: '30px', width: '60px', height: '60px', }} />
                <Menu
                  anchorEl={photo}
                  anchorOrigin={{ vertical: "bottom", horizontal: 'center' }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                  open={Boolean(photo)}
                  onClose={() => setPhoto(null)}
                >
                  <MenuItem><Link href={"/mycamp/plan "}>나의캠핑</Link></MenuItem>
                  <MenuItem >마이페이지</MenuItem>
                  <MenuItem >로그아웃</MenuItem>
                </Menu> 
                  </>
                ) : (
                  <Button variant='contained' href='/user/login' style={{ marginRight: '30px' }}>로그인 </Button>
                )}
              </div>

            </div>
          </nav>
        </header>
        <Link href={`/book/detail?bookIdx=${bookIdx}`}>예약상세 임시</Link>
        {children}
        <hr />
        <footer className="container">
          <p className="float-end"><a href="#">Back to top</a></p>
          <p>&copy; 2024-2025 ICT Company, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
        </footer>
      </body>
    </html >
  );
}
