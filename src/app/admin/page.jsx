"use client";
import './admin.css'
import { Avatar, FormControl, TextField, Stack, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import './admin.css';

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const router = useRouter(); // useRouter 초기화

    const initState = {
        userId: "",
        userPw: ""
    }
    const [adminvo, setAdminvo] = useState(initState);

    const changeAdminvo = (e) => {
        const { name, value } = e.target;
        setAdminvo({ ...adminvo, [name]: value });
    }

    const isBtnChk = !adminvo.userId || !adminvo.userPw;

    // admin 정보 확인
    const checkAdmin = async () => {
        try {
            const response = await axios.post(`${LOCAL_API_BASE_URL}/admin/login`, adminvo);
            if (response.data === 'success') {
                alert('로그인 성공');
                router.push('/admin/main');
            } else {
                alert('로그인 실패');
                setAdminvo(initState);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 임시용
    const checkAdmin2 = async () => {
        if (adminvo.userId === '1234' && adminvo.userPw === '1234') {
            alert('로그인 성공');
            router.push('/admin/main');
        } else {
            alert('로그인 실패');
            setAdminvo(initState);
        }
    }

    return (
        <div className='container-box' >
            <FormControl className='fcontrol'>
                {/* 수직정렬 */}
                <Stack direction="column" spacing={1} alignItems='center'>
                    {/* <div className='logo-admin'>CAMPERS</div> */}
                    <Avatar src='./globe.svg' />
                    <hr />
                    <div className='p1'>Admin Login</div>
                    <hr />
                    <hr />
                    <TextField className='text-login' type='text' label='아이디' name='userId' value={adminvo.userId} onChange={changeAdminvo} />
                    <TextField className='text-login' type='password' label='패스워드' name='userPw' value={adminvo.userPw} onChange={changeAdminvo} />
                    <Button fullWidth variant='contained' disabled={isBtnChk} onClick={checkAdmin2}>Sign in</Button>
                </Stack>
            </FormControl>
        </div>
    );
}

export default Page;