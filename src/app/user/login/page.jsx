"use client";
import { Avatar, FormControl, TextField, Stack, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// zustand store 호출
import useAuthStore from '../../../../store/authStore';
import Link from 'next/link';

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const API_URL = `${LOCAL_API_BASE_URL}/user/login`;
    const router = useRouter(); // useRouter 초기화

    // zustand login 함수 가져오기
    const { login } = useAuthStore();

    // 텍스트필드 초기화
    const initUvo = {
        userId: "",
        userPw: ""
    }
    const [uvo, setUvo] = useState(initUvo);

    // 모든 입력 필드가 비어있지 않아야 true => 버튼이 활성화
    const isBtnChk = !uvo.userId || !uvo.userPw;


    // 서버에서 sendRedirect 넘어오는 것을 받아서 로그인 처리
    useEffect(() => {
        // 주소창에 있는 파라미터 가져와서 로그인 처리하자
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const userIdx = searchParams.get('userIdx');
        const nickname = searchParams.get('nickname');

        if (token && userIdx && nickname) {
            alert('로그인 성공');
            const user = {
                userIdx: userIdx,
                nickname: nickname
            }
            login(user, token);     // zustand login 상태관리

            router.push('/');
        }
    }, [login, router]);

    function changeUvo(e) {
        const { name, value } = e.target;
        setUvo(prev => ({
            ...prev, [name]: value
        }));
    }

    function goServer() {
        axios.post(API_URL, uvo)
            .then(response => {
                const data = response.data;
                if (data.success) {
                    console.log(data);
                    alert(data.message);
                    const user = {
                        userIdx: data.data.userIdx,
                        nickname: data.data.userNickname
                    }
                    login(user, data.jwtToken);
                    router.push('/');       // 로그인 성공하면 home으로~
                } else {
                    alert(data.message);
                    setUvo(initUvo);
                }
            })
            .catch((error) => {
                console.log('로그인 오류:', error);

                if (error?.response?.data?.message) {
                    alert(error.response.data.message);
                } else if (error.request) {
                    alert('서버와 통신할 수 없습니다. 네트워크를 확인해주세요.');
                } else {
                    alert('로그인 처리 중 오류가 발생했습니다.');
                }
                setUvo(initUvo);
            });
    }

    // 카카오 인증 엔드포인트 (redirect 주소)
    function handleKakaoLogin() {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    }

    // 네이버 인증 엔드포인트 (redirect 주소)
    function handleNaverLogin() {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    }

    return (
        <div>
            <FormControl>
                {/* 수직정렬 */}
                <Stack direction="column" spacing={1} alignItems='center'>
                    <Avatar />
                    <TextField type='text' label='아이디' name='userId' value={uvo.userId} onChange={changeUvo} />
                    <TextField type='password' label='패스워드' name='userPw' value={uvo.userPw} onChange={changeUvo} />
                    <Button fullWidth variant='contained' disabled={isBtnChk} onClick={goServer}>Sign in</Button>
                </Stack>
            </FormControl>
            <Stack direction="row" spacing={2} alignItems='center'>
                <Link href='/user/login/findId'>아이디 찾기</Link>
                <Link href='/user/login/findPw'>비밀번호 찾기</Link>
                <Link href='/user/join'>회원가입</Link>
            </Stack>
            <hr></hr>
            <h3>Social Login</h3>
            <Stack direction="row" spacing={2} alignItems='center'>
                <img src='/images/kakao_login_large.png' onClick={handleKakaoLogin} style={{ width: '90px', height: '45px' }} />
                <img src='/images/btnG_축약형.png' onClick={handleNaverLogin} style={{ width: '90px', height: '45px' }} />
            </Stack>
        </div>
    );
}

export default Page;