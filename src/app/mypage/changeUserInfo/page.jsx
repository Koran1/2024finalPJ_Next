'use client'
import { Box, Button, FormControl, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import MyPageList from '../MyPageList';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
import '../mypage.css'


function Page() {

    const { user } = useAuthStore();


    const initUvo = {
        userIdx: "",
        userId: "",
        userPw: "",
        userName: "",
        userNickname: "",
        userMail: "",
        userPhone: "",
        userAddr: ""
    }

    const [uvo, setUvo] = useState(initUvo);
    const changeUvo = (e) => {
        const { name, value } = e.target;
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
                    getUserInfo();
                } else {
                    alert("비밀번호가 틀렸습니다!");
                    setUvo(initUvo);
                }
            })
            .catch((err) => console.log(err));

    }

    // 기존 유저 정보 가져오기
    const getUserInfo = () => {
        if (!user) return;
        console.log('유저 정보 가져오기')
        axios.post(`${LOCAL_API_BASE_URL}/mypage/getUserInfo`, uvo)
            .then((res) => {
                console.log(res.data);
                setUvo(res.data.data);
            })
            .catch((err) => console.log(err));
    }


    // 주소 찾기
    const openAddr = useDaumPostcodePopup(postcodeScriptUrl);

    const handleAddr = () => {
        openAddr({ onComplete: handleComplete })
    }

    const handleComplete = (data) => {
        const fullAddr = data.address;
        setUvo({ ...uvo, userAddr: fullAddr })
    }

    return (
        <Box display='flex' >
            <MyPageList />
            <Box flexGrow={1} p={2} m={1} sx={{ border: '1px solid black' }}>
                <div className='page-text'>회원 정보 수정</div>
                {!isPwChecked ?
                    <Box>
                        <TextField className='pp1' type='password' name='userPw'
                            label='비밀번호'
                            value={uvo.userPw}
                            onChange={changeUvo} />
                        <Button variant='contained' color='primary'
                            disabled={isPwChecked}
                            onClick={checkPw}>비밀번호 확인</Button>
                    </Box>

                    :
                    <FormControl>
                        <Stack direction="column" spacing={2} alignItems='flex-start'>

                            <Box>
                                <TextField  className='pp2' type='text' name='userName'
                                    label='이름'
                                    value={uvo.userName}
                                    onChange={changeUvo} />
                            </Box>
                            <Box>
                                <TextField  className='pp2' type='text' name='userNickname'
                                    label='닉네임'
                                    value={uvo.userNickname}
                                    onChange={changeUvo} />
                            </Box>
                            <Box>
                                <TextField className='pp2' type='text' name='userMail'
                                    label='이메일'
                                    value={uvo.userMail}
                                    onChange={changeUvo} />
                            </Box>
                            <Box>
                                <TextField className='pp2' type='text' name='userPhone'
                                    label='전화번호'
                                    value={uvo.userPhone}
                                    onChange={changeUvo} />
                            </Box>
                            <Box>
                                <TextField type='text' label='주 소' name='userAddr'
                                    value={uvo.userAddr} onChange={changeUvo} />
                                <Button variant='contained' onClick={handleAddr} sx={{ ml: 2 }}>주소 찾기</Button>
                            </Box>
                            <Button variant='contained'>제출</Button>
                        </Stack>
                    </FormControl>
                }
            </Box >
        </Box>
    );
}

export default Page;