'use client'
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import MyPageList from '../MyPageList';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../../store/authStore';

function Page() {
    // 로그인 확인 절차
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
                <h1>Here is Change User Infos</h1>
            </Box>
        </Box>
    );
}

export default Page;