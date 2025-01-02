'use client'
import { Box, Button, FormControl, Stack, TextField } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import './findpw.css'


function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const router = useRouter();
    const [userIdx, setUserIdx] = useState("");
    const [mailNum, setMailNum] = useState("");
    const [chkMailNum, setChkMailNum] = useState("");
    const [mailPass, setMailPass] = useState(false);

    const initUvo = {
        userId: "",
        userName: "",
        userPhone: "",
        userMail: ""
    }
    const [uvo, setUvo] = useState(initUvo);

    const changeUvo = (e) => {
        const { name, value } = e.target;
        if (name === "userMail") {
            setMailNum("")
            setChkMailNum("")
            setMailPass(false)
        }

        setUvo(prev => ({
            ...prev, [name]: value
        }))
    }

    const isBtnChk = !uvo.userId || !uvo.userName || !uvo.userPhone || !uvo.userMail || !mailPass;

    // 이메일 발송
    const handleSendMail = () => {
        axios.get(`${LOCAL_API_BASE_URL}/user/join/mailchk/${uvo.userMail}`)
            .then((data) => {
                alert(data.data.message)
                setMailNum(data.data.data);
            })
            .catch(err => {
                console.error('Error : ' + err)
            })
    }

    // 이메일 인증번호 검증
    const handleMailChk = () => {
        if (chkMailNum === mailNum) {
            alert("인증 성공")
            setMailPass(true);
        } else {
            alert("올바르지 못한 번호입니다!")
        }
    }

    // 입력한 정보로 정보 조회
    const searchPw = () => {
        axios.post(`${LOCAL_API_BASE_URL}/user/login/findPw`, uvo)
            .then(res => {
                console.log(res)
                if (res.data.success) {
                    alert(res.data.message)
                    setUserIdx(res.data.data)
                } else {
                    alert(res.data.message)
                    setUvo(initUvo)
                    setMailNum("")
                    setChkMailNum("")
                }
            })
            .catch(err => console.error(err))
    }

    // 비밀번호 재설정
    const initPwd = {
        userPw: "",
        chkPw: ""
    }
    const [inputPwd, setInputPwd] = useState(initPwd);
    const [pwError, setPwError] = useState(false);
    const isPwdChk = (inputPwd.userPw === inputPwd.chkPw);

    const changePwd = (e) => {
        const { name, value } = e.target;
        if (name === "userPw") {
            setPwError(!validPw(value))
            setInputPwd(prev => ({
                ...prev, chkPw: ""
            }))
        }
        setInputPwd(prev => ({
            ...prev, [name]: value
        }))
    }

    const validPw = (pw) => {
        if (!pw || pw.length === 0) {
            return false;
        }
        const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])\S{6,15}$/;
        return pwPattern.test(pw)
    }

    const changeUserPw = () => {
        axios.post(`${LOCAL_API_BASE_URL}/user/login/changeUserPw`, null, {
            params: { userPw: inputPwd.userPw, userIdx: userIdx }
        })
            .then(res => {
                console.log(res)
                if (res.data.success) {
                    alert(res.data.message)
                    router.push('/user/login')
                } else {
                    alert(res.data.message)
                    setInputPwd(initPwd);
                }
            })
            .catch(err => console.error(err))
    }
    return (
        <div className='container-box-pw'> 
            {!userIdx ? (
                <>
                    <div className='p11'>비밀번호 찾기</div>

                    <FormControl  className='fcontrol' >
                        <Stack direction="column" spacing={1} alignItems='center'>
                            <TextField className='textf' type='text' label='이름' name='userName' value={uvo.userName} onChange={changeUvo} />
                            <TextField className='textf' type='text' label='아이디' name='userId' value={uvo.userId} onChange={changeUvo} />
                            <TextField className='textf' type='text' label='전화번호' name='userPhone' value={uvo.userPhone} onChange={changeUvo} />

                            <Box>
                                <TextField type='text' label='이메일' name='userMail'
                                    value={uvo.userMail} onChange={changeUvo} />
                                <Button variant='contained' sx={{ ml: 2 }}
                                    disabled={!uvo.userMail} onClick={handleSendMail}>인증번호 발송</Button>
                            </Box>

                            <Box>
                                <TextField type='text' label='인증번호 확인'
                                    disabled={!mailNum} name="chkMailNum" value={chkMailNum}
                                    onChange={(e) => setChkMailNum(e.target.value)} />
                                <Button  disabled={!mailNum} variant='contained'
                                    sx={{ ml: 2 }} onClick={handleMailChk}>인증번호 확인</Button>
                            </Box>

                            <Button className='btn_sub' variant='contained' disabled={isBtnChk} onClick={searchPw}>비밀번호 찾기</Button>
                        </Stack>
                    </FormControl>
                </>
            ) : (
                <>
                    <h2>비밀번호 재설정</h2>
                    <p>특수, 대소문자 1개씩 포함, 공백 불가, 6~15자</p>
                    <FormControl>
                        <Stack direction="column" spacing={2} alignItems='center'>
                            <TextField error={inputPwd.userPw && pwError} type='password' label='비밀번호' name='userPw'
                                value={inputPwd.userPw} onChange={changePwd}
                                helperText={pwError && "특수, 대소문자 1개씩 포함, 공백 불가, 6~15자"} />
                            <TextField error={inputPwd.chkPw && !isPwdChk} type='password' label='비밀번호 확인'
                                name='chkPw' value={inputPwd.chkPw} onChange={changePwd}
                                helperText={inputPwd.chkPw && !isPwdChk && "일치하지 않습니다"} />
                            <Button variant='contained' disabled={!inputPwd.userPw || !isPwdChk || pwError}
                                onClick={changeUserPw}>비밀번호 재설정</Button>
                        </Stack>
                    </FormControl>
                </>
            )}

        </div>
    );
}

export default Page;
