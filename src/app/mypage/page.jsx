'use client'
import React, { useEffect } from 'react';
import MyPageList from './MyPageList';
import { Box } from '@mui/material';
import useAuthStore from '../../../store/authStore';
import { useRouter } from 'next/navigation';

function Page() {
    // 로그인 확인
    const router = useRouter();
    const { isAuthenticated, isExpired, user } = useAuthStore();

    useEffect(() => {
        if (!user) return
        console.log('유저 로그인 확인')
        if (!isAuthenticated || isExpired()) {
            alert("로그인이 필요한 서비스입니다.");
            router.push("/user/login"); // Redirect to login page
            return
        }

    }, [user])

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1} sx={{ border: '1px solid black' }}>
                <h2>This is MyPage Main</h2>
            </Box>
        </Box>
    );
}

export default Page;