"use client";
import './globals.css';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main/main.css';

// layout.js는 선택이다 (RootLayout 제외)
// layout이 필요없는 간단한 페이지에서는 생략 가능
// 페이지 전체의 공통구조를 랜더링 할 때 사용

// zustand store 호출
import useAuthStore from '../../store/authStore';

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

  return (
    <html lang="en">
      <body>
        {/* <header style={{marginTop:"50px"}}>공통 헤더</header> */}
        {/* 자식 컴포넌트가 랜더링 된다 */}
        {/* {children} */}
        {/* <footer style={{marginTop:"50px"}}>공통 풋터</footer> */}
        {/* <h1 style={{textAlign: "center"}}><Link href="/">WEB</Link></h1> */}
        {/* <nav>
          <Stack direction="row" spacing={2} justifyContent='center'>
            {/* <Link href="/read/1">HTML</Link>
            <Link href="/read/2">CSS</Link>
            <Link href="/read/3">JSV</Link>
            <Link href="/gallery">image</Link>
            <Link href="/itemList">ItemList(외부서버)</Link>
            <Link href="/guestBookList">GuestBook(Spring서버)</Link>
            {isAuthenticated ? (
              <>
                <Avatar />
                <span style={{fontSize:"16px"}}><b>{user.m_id}님 환영합니다</b></span>
                <Button variant="contained" onClick={handleLogout}>logout</Button>
              </>
            ) : (
              <>
                <Link href="/login">Sign In</Link>
                <Link href="/join">Sign Up</Link>
              </>
            )}
          </Stack>
        </nav>
        <p /> */}
        {children}
        {/* <p />
        <ul>
          {/* /create 이면 create 폴더를 찾는다!! 
          폴더 안에는 page.jsx(필수,자식), layout.jsx(선택,부모) 가 있다
          <li><Link href="/create">Create</Link></li>
          <li>Update</li>
          <li><input type="button" value="delete" /></li>
        </ul> */}
      </body>
    </html>
  );
}
