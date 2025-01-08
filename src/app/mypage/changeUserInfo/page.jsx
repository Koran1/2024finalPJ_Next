'use client'
import { Box, Button, ButtonBase, FormControl, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import MyPageList from '../MyPageList';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
import '../mypage.css'
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { AddAPhoto, Image } from '@mui/icons-material';
import { VisuallyHiddenInput } from './VisuallyHiddenInput';


function Page() {

    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const { user, updateUser } = useAuthStore();
    const router = useRouter();

    const initUvo = {
        userIdx: "",
        userPw: "",
        userName: "",
        userNickname: "",
        userMail: "",
        userPhone: "",
        userAddr: "",
        userEtc01: null,
        userProfileImg: null,
    }


    const [uvo, setUvo] = useState(initUvo);
    const [originalUvo, setOriginalUvo] = useState(initUvo);

    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const API_URL = `${LOCAL_API_BASE_URL}/user/join`;

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
                setOriginalUvo(res.data.data);
            })
            .catch((err) => console.log(err));
    }

    const [mailError, setMailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const [mailNum, setMailNum] = useState("");
    const [chkMailNum, setChkMailNum] = useState("");
    const [mailPass, setMailPass] = useState(false);

    const [nickPass, setNickPass] = useState(false);
    const [phonePass, setPhonePass] = useState(false);
    const [mailDupl, setMailDupl] = useState(false);

    const [nickHelper, setNickHelper] = useState("");
    const [phoneHelper, setPhoneHelper] = useState("");
    const [mailHelper, setMailHelper] = useState("");

    const [imageUrl, setImageUrl] = useState(null);

    // 하나라도 변경 시 조건 충족해야=> 버튼이 활성화
    const isBtnChk =
        ((uvo.userName == originalUvo.userName && uvo.userNickname == originalUvo.userNickname && uvo.userMail == originalUvo.userMail && uvo.userPhone == originalUvo.userPhone)
            || (uvo.userName != originalUvo.userName && !uvo.userName)
            || (uvo.userNickname != originalUvo.userNickname && (!uvo.userNickname || !nickPass))
            || (uvo.userMail != originalUvo.userMail && (!uvo.userMail || mailError || !mailPass))
            || (uvo.userPhone != originalUvo.userPhone && (!uvo.userPhone || phoneError || !phonePass)))
        && !imageUrl;


    // 닉네임, 전화번호, 이메일 중복 확인
    const checkDuplicate = useCallback(
        debounce((field, value) => {
            axios.get(`${API_URL}/chkDupl`, {
                params: { field, value }
            }).then((res) => {
                console.log(res)
                if (field === "userNickname") {
                    setNickHelper(res.data.message)
                    setNickPass(res.data.success)
                }
                if (field === "userPhone") {
                    setPhoneHelper(res.data.message)
                    setPhonePass(res.data.success)
                }
                if (field === "userMail") {
                    setMailHelper(res.data.message)
                    setMailDupl(res.data.success)
                }
            }).catch(err => console.error(err));
        }, 500), []
    )

    // 입력 때 마다 값 갱신 및 함수 실행
    function changeUvo(e) {
        const { name, value } = e.target;

        if (name === "userMail") {
            setMailPass(false)
            setMailNum("")
            setChkMailNum("")
            const chkMail = validMail(value)
            setMailError(!chkMail)
            if (chkMail) {
                checkDuplicate(name, value);
            }

        }
        if (name === "userNickname") {
            setNickPass(false)
            setNickHelper("");
            checkDuplicate(name, value);
        }
        if (name === "userPhone") {
            setPhonePass(false)
            setPhoneHelper("")
            const chkPhone = validPhone(value)
            setPhoneError(!chkPhone)
            if (chkPhone) {
                checkDuplicate(name, value);
            }
        }

        setUvo(prev => ({
            ...prev, [name]: value
        }));
    }

    // Mail & Phone 패턴 정하기
    const validMail = (mail) => {
        if (!mail || mail.length === 0) {
            return false;
        }
        const mailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9._-]+$/;
        return mailPattern.test(mail)
    }
    const validPhone = (phone) => {
        if (!phone || phone.length === 0) {
            return false
        }
        const phonePattern = /^01(?:0|1|[6-9])-\d{3,4}-\d{4}$/;
        return phonePattern.test(phone)
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

    // 이메일 발송
    const handleSendMail = () => {
        axios.get(`${API_URL}/mailchk/${uvo.userMail}`)
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

    // 회원 정보 수정하기
    const handleChangeUserInfo = () => {
        if (!user) return;
        console.log('유저 정보 변경하기')
        uvo.userIdx = user.userIdx;

        console.log(uvo);
        axios.put(`${LOCAL_API_BASE_URL}/mypage/changeUserInfo`, uvo, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    updateUser({
                        userIdx: res.data.data.userIdx,
                        nickname: res.data.data.userNickname,
                        userEtc01: res.data.data.userEtc01,
                    })
                    alert("회원 정보가 변경되었습니다!");
                    router.push('/mypage');
                } else {
                    alert("회원 정보 변경에 실패했습니다!");
                }
            })
            .catch((err) => console.log(err));
    }

    // 프로필 사진 변경
    const handleFileInput = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUvo({
            ...uvo, userProfileImg: file
        })

        // 선택한 프로필 사진 미리 보여주기
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            if (reader.readyState === 2) {
                console.log(e.target.result)
                setImageUrl(e.target.result)
            }
        }
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
                            {/* 프로필 사진 수정 */}
                            <Box
                                sx={{
                                    width: 150,
                                    height: 150,
                                    position: 'relative',
                                    m: 10,
                                }}
                            >
                                <img
                                    alt="sample image"
                                    src={imageUrl ? imageUrl :
                                        `${LOCAL_IMG_URL}/user/${originalUvo.userEtc01}` ?? '/default-product-image.jpg'}
                                    width={150}
                                    height={150}
                                    style={{
                                        width: 150,
                                        height: 150,
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        borderRadius: 75,
                                        zIndex: 1,
                                    }}
                                />
                                <ButtonBase
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        width: 150,
                                        height: 150,
                                        borderRadius: 75,
                                        zIndex: 2,
                                        bgcolor: '#00000077',
                                    }}
                                >
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInput}
                                    />
                                    <Stack spacing={0.5} alignItems="center">
                                        <AddAPhoto sx={{ width: 50, height: 50, color: '#FFFFFF' }} />
                                        <Typography variant="body2" color="#FFFFFF">
                                            Add a photo
                                        </Typography>
                                    </Stack>
                                </ButtonBase>
                            </Box>

                            <TextField className='pp2' type='text' label='이 름' name='userName'
                                value={uvo.userName} onChange={changeUvo} />

                            <TextField className='pp2'
                                type='text' label='닉네임'
                                name='userNickname' value={uvo.userNickname}
                                disabled />

                            {/* <TextField className='pp2' error={uvo.userNickname && uvo.userNickname != originalUvo.userNickname && !nickPass}
                                type='text' label='닉네임'
                                name='userNickname' value={uvo.userNickname}
                                helperText={uvo.userNickname && uvo.userNickname != originalUvo.userNickname && (nickHelper ? nickHelper : "중복검사 중...")} onChange={changeUvo}
                                disabled /> */}


                            <Box>
                                <TextField error={uvo.userMail && uvo.userMail != originalUvo.userMail && (!mailDupl || mailError)}
                                    type='text' label='이메일'
                                    name='userMail' value={uvo.userMail}
                                    helperText={uvo.userMail && uvo.userMail != originalUvo.userMail && (mailError ? "올바르지 못한 이메일입니다"
                                        : mailHelper ? mailHelper : "중복 검사 중...")}
                                    onChange={changeUvo} />
                                <Button variant='contained' sx={{ ml: 2 }}
                                    disabled={!uvo.userMail || mailError || uvo.userMail == originalUvo.userMail} onClick={handleSendMail}>인증번호 발송</Button>
                            </Box>

                            <Box>
                                <TextField type='text' label='인증번호 확인'
                                    disabled={!mailNum} name="chkMailNum" value={chkMailNum}
                                    onChange={(e) => setChkMailNum(e.target.value)} />
                                <Button disabled={!mailNum} variant='contained'
                                    sx={{ ml: 2 }} onClick={handleMailChk}>인증번호 확인</Button>
                            </Box>

                            <TextField className='pp2' error={uvo.userPhone && uvo.userPhone != originalUvo.userPhone && !phonePass || phoneError} type='text' label='전화번호'
                                name='userPhone' value={uvo.userPhone}
                                helperText={
                                    !uvo.userPhone || uvo.userPhone == originalUvo.userPhone ? "" : phoneError ? "올바르지 못한 전화번호입니다"
                                        : phoneHelper ? phoneHelper : "중복검사 중..."} onChange={changeUvo} />

                            <Box>
                                <TextField type='text' label='주 소' name='userAddr'
                                    value={uvo.userAddr} onChange={changeUvo} />
                                <Button variant='contained' onClick={handleAddr} sx={{ ml: 2 }}>주소 찾기</Button>
                            </Box>

                            <Button variant='contained' disabled={isBtnChk} onClick={handleChangeUserInfo}>수정</Button>
                        </Stack>
                    </FormControl>
                }
            </Box >
        </Box>
    );
}

export default Page;