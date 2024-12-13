"use client";
import { Avatar, FormControl, TextField, Stack, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// zustand store 호출
import useAuthStore from '../../../store/authStore';

function Page(props) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const API_URL = `${LOCAL_API_BASE_URL}/members/login`;
    const router = useRouter(); // useRouter 초기화

    // zustand login 함수 가져오기
    const { login } = useAuthStore();

    // 텍스트필드 초기화
    const initUvo = {
        m_id: "",
        m_pw: ""
    }
    const [uvo, setUvo] = useState(initUvo);

    // 모든 입력 필드가 비어있지 않아야 true => 버튼이 활성화
    const isBtnChk = !uvo.m_id || !uvo.m_pw;


    // 서버에서 sendRedirect 넘어오는 것을 받아서 로그인 처리
    useEffect(() => {
        // 주소창에 있는 파라미터 가져와서 로그인 처리하자
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const m_id = searchParams.get('username');
        const email = searchParams.get('email');

        if (token && m_id && email) {
            login(token, m_id, email);
            alert('로그인 성공');
            const user = {
                m_id: m_id,
                m_pw: email
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
                    console.log(data.data);
                    alert(data.message);
                    login(data.data, data.token);
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
        <FormControl>
            {/* 수직정렬 */}
            <Stack direction="column" spacing={1} alignItems='center'>
                <Avatar />
                <TextField type='text' label='아이디' name='m_id' value={uvo.m_id} onChange={changeUvo} />
                <TextField type='password' label='패스워드' name='m_pw' value={uvo.m_pw} onChange={changeUvo} />
                <Button fullWidth variant='contained' disabled={isBtnChk} onClick={goServer}>Sign in</Button>
                <Button fullWidth variant='contained' onClick={handleKakaoLogin} style={{ backgroundColor: '#FFEB3B' }}>카카오 로그인</Button>
                <Button fullWidth variant='contained' onClick={handleNaverLogin} style={{ backgroundColor: '#03C75A' }}>네이버 로그인</Button>
            </Stack>
        </FormControl>
    );
}

export default Page;