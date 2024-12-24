'use client'
import { Button, FormControl, Stack, TextField } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';

import React, { useState } from 'react';

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const [msg, setMsg] = useState("");

    const initUvo = {
        userId: "",
        userMail: ""
    }
    const [uvo, setUvo] = useState(initUvo);

    const changeUvo = (e) => {
        const { name, value } = e.target;
        setUvo(prev => ({
            ...prev, [name]: value
        }))
    }

    const isBtnChk = !uvo.userId || !uvo.userMail;

    const searchId = () => {
        axios.post(`${LOCAL_API_BASE_URL}/user/login/findId`, uvo)
            .then(res => {
                if (res.data.success) {
                    setMsg(res.data.message)
                } else {
                    alert(res.data.message)
                    setUvo(initUvo)
                }
            })
            .catch(err => console.error(err))
    }
    return (
        <div>
            {!msg ? (
                <>
                    <h2>아이디 찾기</h2>
                    <FormControl>
                        {/* 수직정렬 */}
                        <Stack direction="column" spacing={1} alignItems='center'>
                            <TextField type='text' label='아이디' name='userId' value={uvo.userId} onChange={changeUvo} />
                            <TextField type='text' label='이메일' name='userMail' value={uvo.userMail} onChange={changeUvo} />
                            <Button fullWidth variant='contained' disabled={isBtnChk} onClick={searchId}>아이디 찾기</Button>
                        </Stack>
                    </FormControl>
                </>
            ) : (
                <>
                    <h2>{msg}</h2>
                    <Stack direction="row" spacing={2} alignItems='center'>
                        <Link href='/user/login/findPw'>비밀번호 찾기</Link>
                        <Link href='/user/login'>로그인</Link>
                    </Stack>
                </>
            )}

        </div>
    );
}

export default Page;
