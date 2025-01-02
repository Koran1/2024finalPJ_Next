'use client'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, lime, purple } from '@mui/material/colors';
import { Button, FormControl, Stack, TextField } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import './findid.css'



function Page() {
    const theme = createTheme({
        palette: {
            primary: blue,
            secondary: purple,
        },
    });

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
                    <div className="container-box-id">
                        <div className='p11'>아이디 찾기</div>
                        <div className='ex'>가입한 아이디와 이메일을 입력하세요</div>
                        <FormControl className='fcontrol' >
                            {/* 수직정렬 */}
                            <Stack direction="column" spacing={1} alignItems='center'>
                                <TextField className='textf' type='text' label='아이디' name='userId' color="primary" value={uvo.userId} onChange={changeUvo} />
                                <TextField className='textf' type='text' label='이메일' name='userMail' color="primary" value={uvo.userMail} onChange={changeUvo} />
                                <Button fullWidth variant='contained' color="primary" disabled={isBtnChk} onClick={searchId}>아이디 찾기</Button>

                            </Stack>
                        </FormControl>
                        <Stack direction="row" spacing={2} alignItems='center'>

                        <Link className="btn1" href='/user/login/findPw'>비밀번호 찾기</Link>
                        <Link className="btn1" href='/user/join'>회원가입</Link>
                        </Stack>
                    </div>
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
