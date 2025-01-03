'use client'
import { Box, Button, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MyPageList from '../MyPageList';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';

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


    const initUvo = {
        userIdx: "",
        userPw: "",
        newUserPw: "",
        newUserPw2: "",
    }

    const [uvo, setUvo] = useState(initUvo);
    const [pwError, setPwError] = useState(false);

    const changeUvo = (e) => {
        const { name, value } = e.target;

        if (name === "newUserPw") {
            setPwError(!validPw(value))
        }

        setUvo({
            ...uvo,
            [name]: value
        })
    }

    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    // 비밀번호 확인
    const [isPwChecked, setIsPwChecked] = useState(false);

    const checkPw = () => {
        if (!user) return;
        console.log(uvo);
        uvo.userIdx = user.userIdx;
        axios.post(`${LOCAL_API_BASE_URL}/mypage/checkPw`, uvo)
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    alert("비밀번호가 확인되었습니다!");
                    setIsPwChecked(true);
                } else {
                    alert("비밀번호가 틀렸습니다!");
                    setUvo(initUvo);
                }
            })
            .catch((err) => console.log(err));

    }

    // 비밀번호 변경
    const isPwValid = uvo.newUserPw && uvo.newUserPw2 && uvo.newUserPw === uvo.newUserPw2;

    const validPw = (pw) => {
        if (!pw || pw.length === 0) {
            return false;
        }
        const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])\S{6,15}$/;
        return pwPattern.test(pw)
    }

    const changePw = () => {
        console.log(uvo);
        if (confirm("비밀번호를 변경하시겠습니까?")) {
            axios.post(`${LOCAL_API_BASE_URL}/mypage/changePw`, uvo)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.success) {
                        alert("비밀번호가 변경되었습니다!");
                        setUvo(initUvo);
                        setIsPwChecked(false);
                    } else {
                        alert("비밀번호 변경에 실패했습니다!");
                        setUvo(initUvo);
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1} sx={{ border: '1px solid black' }}>
                <h1>비밀번호 확인</h1>
                <Box>
                    <TextField type='password' name='userPw'
                        label='비밀번호'
                        value={uvo.userPw}
                        disabled={isPwChecked}
                        onChange={changeUvo} />
                    <Button variant='contained' color='primary'
                        disabled={isPwChecked}
                        onClick={checkPw}>비밀번호 확인</Button>
                </Box>

                {isPwChecked &&
                    <>
                        <h2>비밀번호 변경</h2>
                        <Stack spacing={2} direction={'column'}>

                            <TextField error={pwError && uvo.newUserPw} type='password' label='패스워드'
                                name='newUserPw' value={uvo.newUserPw} onChange={changeUvo}
                                placeholder='특수, 대소문자 1개씩 포함, 공백 불가, 6~15자'
                                helperText={!uvo.newUserPw ? "" : pwError ? "올바르지 못한 비밀번호입니다" :
                                    "사용 가능한 비밀번호 입니다!"
                                } />

                            <TextField error={uvo.newUserPw !== uvo.newUserPw2 && uvo.newUserPw2}
                                type='password' name='newUserPw2'
                                label='비밀번호 확인'
                                value={uvo.newUserPw2}
                                onChange={changeUvo} />

                            <Button variant='contained' color='primary'
                                disabled={!isPwValid}
                                onClick={changePw}>비밀번호 변경</Button>
                        </Stack>
                    </>
                }
            </Box>
        </Box>
    );
}

export default Page;