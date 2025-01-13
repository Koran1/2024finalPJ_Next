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
        adminID: "",
        adminPW: ""
    }
    const [adminvo, setAdminvo] = useState(initState);

    const changeAdminvo = (e) => {
        const { name, value } = e.target;
        setAdminvo({ ...adminvo, [name]: value });
    }

    const isBtnChk = !adminvo.adminID || !adminvo.adminPW;

    // admin 정보 확인
    const checkAdmin = async () => {
        try {
            const response = await axios.post(`${LOCAL_API_BASE_URL}/admin/login`, adminvo);
            if (response.data.success) {
                alert('로그인 성공');
                router.push('/admin/userList');
            } else {
                alert('로그인 실패');
                setAdminvo(initState);
            }
        } catch (error) {
            console.error(error);
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
                    <TextField className='text-login' type='text' label='아이디' name='adminID' value={adminvo.adminID} onChange={changeAdminvo} />
                    <TextField className='text-login' type='password' label='패스워드' name='adminPW' value={adminvo.adminPW} onChange={changeAdminvo} />
                    <Button fullWidth variant='contained' disabled={isBtnChk} onClick={checkAdmin}>Sign in</Button>
                </Stack>
            </FormControl>
        </div>
    );
}

export default Page;