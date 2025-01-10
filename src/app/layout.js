"use client";
import './globals.css';
import { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// zustand store 호출
import useAuthStore from '../../store/authStore';
import { Avatar, Badge, Box, Button, Menu, MenuItem, Modal } from '@mui/material';

import Link from 'next/link';
import { MailOutline } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import Script from 'next/script';
import Terms from './user/join/terms/Terms';
import Privacy from './user/join/terms/Privacy';

// 부모 컴포넌트
export default function RootLayout({ children }) {

  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_KEY;
  // zustand 상태 가져오기
  const { isAuthenticated, user, logout, isExpired } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;
    const protectedRoutes = [
      // deal 관련 페이지
      "/deal/interest", "/deal/management", "/deal/purchase", "/deal/rating", "/deal/report", "/deal/update", "/deal/write",
      "/deal/message",
      // mycamp 관련 페이지
      "/mycamp",

      // mypage 관련 페이지
      "/mypage", "/mypage/changePw", "/mypage/changeUserInfo", "/mypage/mycomments", "/mypage/qna",
    ];
    const isProtectedRoute = protectedRoutes.includes(pathname);

    if (isProtectedRoute) {
      if (isExpired() || !isAuthenticated) {
        alert("로그인이 필요한 서비스입니다.");
        logout();
        router.push("/user/login");
      }
    }
  }, [user, pathname]);

  const handleLogout = () => {
    // zustand에 있는 함수 호출
    logout();
    router.push('/')
    alert("로그아웃 되었습니다");
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


  // 안 읽은 메시지 수 조회
  const [unReadMessages, setUnReadMessages] = useState(0);

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
  useEffect(() => {
    if (!user) return
    const response = axios.get(`${LOCAL_API_BASE_URL}/chat/getUnReadMessages?userIdx=${user.userIdx}`)
      .then((res) => {
        console.log('안 읽은 메시지 수 : ' + res.data.data);
        setUnReadMessages(res.data.data);
      })
      .catch((err) => console.log(err))
  });



  // 모달 페이지 
  const [openModal, setOpenModal] = useState(null);

  const handleOpenModal = (modal) => setOpenModal(modal);
  const handleCloseModal = () => setOpenModal(null);

  // 이용약관 관련 모달 페이지 스타일
  const modalStyleTermsPolicy = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    overflow: "auto",
    p: 4,
  };

  // admin 페이지
  if (pathname.startsWith("/admin")) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services,clusterer,drawing&autoload=false`}
          strategy="beforeInteractive"
        />
        <header data-bs-theme="dark">
          <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark" >
            <div className="container-fluid">
              <a className="navbar-brand" href="/" style={{ fontSize: '200%', fontFamily: "'Jaro', sans-serif", marginRight: '50px', marginLeft: '20px', marginBottom: '4px' }}>CAMPERS</a>
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
                    <Badge badgeContent={unReadMessages} color="primary" sx={{ marginRight: '22px' }} >
                      <Link href='/deal/message'>
                        <MailOutline style={{ color: 'white', width: '40px', height: '40px' }} />
                      </Link>
                    </Badge>
                    <Avatar className='avatar' onClick={handlePhotoClick} src={user.userEtc01 ? `${LOCAL_IMG_URL}/user/${user.userEtc01}` : "/default-product-image.jpg"} style={{ marginRight: '20px', width: '38px', height: '38px', }} />
                    <Menu
                      anchorEl={photo}
                      anchorOrigin={{ vertical: "bottom", horizontal: 'center' }}
                      transformOrigin={{ vertical: "top", horizontal: "center" }}
                      open={Boolean(photo)}
                      onClose={() => setPhoto(null)}
                    >
                      {/* 글로벌 css에 있음 */}
                      <MenuItem><Link className='nav-menu' href={"/book/list"}>나의캠핑</Link></MenuItem>
                      <MenuItem ><Link className='nav-menu' href={"/mypage"}>마이페이지</Link></MenuItem>
                      <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                    </Menu></>

                ) : (
                  <Button variant='contained' href='/user/login' style={{ marginRight: '30px' }}>로그인 </Button>
                )}
              </div>

            </div>
          </nav>
        </header>
        <div className='magin'>

          {children}
        </div>


        <hr />
        <footer className="container">
          <p className="float-end"><a href="#">Back to top</a></p>
          <p>&copy; 2024-2025 ICT Company, Inc. &middot; <a href="/add/notice">공지사항</a>
            &middot; <a href="#" onClick={() => handleOpenModal("joinTerms1")}>이용약관</a>
            &middot; <a href="#" onClick={() => handleOpenModal("joinTerms2")}>개인정보처리방침</a></p>

          <Modal open={openModal === "joinTerms1"} onClose={handleCloseModal}>
            <Box sx={modalStyleTermsPolicy}>
              <Box sx={{ display: "flex", marginBottom: "20px" }} justifyContent="space-between" >
                <h2 style={{ display: "inline-block" }}>Campers 이용약관</h2>
                <Button variant='outlined' sx={{ color: "black", border: "none", marginTop: "-10px" }} onClick={handleCloseModal}>X</Button>
              </Box>
              <Box>
                <Terms />
              </Box>
            </Box>
          </Modal>

          <Modal open={openModal === "joinTerms2"} onClose={handleCloseModal}>
            <Box sx={modalStyleTermsPolicy}>
              <Box sx={{ display: "flex", marginBottom: "20px" }} justifyContent="space-between" >
                <h2 style={{ display: "inline-block" }}>Campers 개인정보 수집 및 이용 동의</h2>
                <Button variant='outlined' sx={{ color: "black", border: "none", marginTop: "-10px" }} onClick={handleCloseModal}>X</Button>
              </Box>
              <Box>
                <Privacy />
              </Box>
            </Box>
          </Modal>
        </footer>
      </body>
    </html >
  );
}
