"use client"
import { Avatar, Box, Button, FormControl, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const router = useRouter();

    useEffect(() => {
        // 소셜 로그인 정보 조회
        const searchParams = new URLSearchParams(window.location.search);
        const socialIdx = searchParams.get('socialIdx');
        axios.get(`${LOCAL_API_BASE_URL}/user/getSocials?socialIdx=${socialIdx}`)
            .then(res => {
                console.log(res);
                if (res.data.success) {

                    setSocialData(res.data.data)
                } else {
                    alert("어쩌구..")
                    router.push('/user/login')
                }
            })
            .catch(err => console.error(err))
        console.log(socialData);


    }, [router]);

    // 현재 여기에 이름, id, email, 전화번호 있음
    const [socialData, setSocialData] = useState({
        socialId: "",
        socialName: "",
        socialEmail: ""
    });

    const API_URL = `${LOCAL_API_BASE_URL}/user/join`;

    // 텍스트필드 초기화
    const initUvo = {
        userId: "",
        k_userId: "",
        userPw: "",
        userName: "",
        userNickname: "",
        userMail: "",
        userPhone: "",
        userAddr: ""
    }

    const [uvo, setUvo] = useState(initUvo);
    const [pwError, setPwError] = useState(false);

    const [idError, setIdError] = useState(false);
    const [idPass, setIdPass] = useState(false);
    const [idHelper, setIdHelper] = useState("");

    const [nickPass, setNickPass] = useState(false);
    const [nickHelper, setNickHelper] = useState("");

    const [phoneError, setPhoneError] = useState(false);
    const [phonePass, setPhonePass] = useState(false);
    const [phoneHelper, setPhoneHelper] = useState("");

    const [disableUpdate, setDisableUpdate] = useState(true);

    const [mailNum, setMailNum] = useState("");
    const [chkMailNum, setChkMailNum] = useState("");
    const [mailPass, setMailPass] = useState(false);

    // 모든 입력 필드가 비어있지 않아야 true => 버튼이 활성화
    const isBtnChk = !uvo.userId || idError || !idPass || !uvo.userPw || pwError || !uvo.userNickname
        || !uvo.userPhone || phoneError || !phonePass || !nickPass || !uvo.userAddr || !mailPass;


    const checkDuplicate = useCallback(
        debounce((field, value) => {
            axios.get(`${API_URL}/chkDupl`, {
                params: { field, value }
            }).then((res) => {
                console.log(res)
                if (field === "userId") {
                    setIdHelper(res.data.message)
                    setIdPass(res.data.success)
                }
                if (field === "userNickname") {
                    setNickHelper(res.data.message)
                    setNickPass(res.data.success)
                }
                if (field === "userPhone") {
                    setPhoneHelper(res.data.message)
                    setPhonePass(res.data.success)
                    console.log(!phoneError)
                    console.log(!res.data.success)
                    setDisableUpdate(phoneError || res.data.success)
                }
            }).catch(err => console.error(err));
        }, 500), []
    )

    // 입력 때 마다 값 갱신 및 함수 실행
    function changeUvo(e) {
        const { name, value } = e.target;

        if (name === "userId") {
            setIdHelper("")
            setIdPass(false)
            const chkId = validId(value)
            setIdError(!chkId)
            if (chkId) {
                checkDuplicate(name, value);
            }
        }
        if (name === "userPw") {
            setPwError(!validPw(value))
        }
        if (name === "userNickname") {
            setNickPass(false)
            setNickHelper("");
            checkDuplicate(name, value);
        }
        if (name === "userPhone") {
            setDisableUpdate(true)
            setPhonePass(false)
            setPhoneHelper("")
            const chkPhone = validPhone(value)
            setPhoneError(!chkPhone)
            if (chkPhone) {
                checkDuplicate(name, value);
            }
        }
        if (name === "userMail") {
            setMailPass(false)
            setMailNum("")
            setChkMailNum("")
        }
        setUvo(prev => ({
            ...prev, [name]: value
        }));
    }

    // ID & PW & Phone 패턴 정하기
    const validId = (id) => {
        if (!id || id.length === 0) {
            return false;
        }
        const idPattern = /^[a-zA-Z0-9]{4,15}$/;
        return idPattern.test(id);
    }
    const validPw = (pw) => {
        if (!pw || pw.length === 0) {
            return false;
        }
        const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])\S{6,15}$/;
        return pwPattern.test(pw)
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

    // 기존 회원 정보 연동
    const updateKakaoId = () => {
        if (!disableUpdate) {
            if (confirm("해당 전화번호와 연동된 계정이 있습니다. 연결하시겠습니까?")) {
                axios.post(`${API_URL}/chkKakao`, {
                    ...uvo,
                    k_userId: socialData.socialId,
                    userPhone: uvo.userPhone,
                    userName: socialData.socialName,
                    userMail: socialData.socialEmail
                })
                    .then(res => {
                        if (res.data.success) {
                            console.log(res);
                            alert(res.data.message);
                            setMailNum(res.data.data);
                        } else {
                            alert(res.data.message);
                            router.push("/user/login");
                        }
                    })
                    .catch(err => console.error(err))
            }
        }
    }

    // 이메일 발송
    const handleSendMail = () => {
        axios.get(`${API_URL}/mailchk/${socialData.socialEmail}`)
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

            if (!disableUpdate) {
                axios.post(`${API_URL}/updateKakao`, {
                    ...uvo,
                    k_userId: socialData.socialId,
                    userName: socialData.socialName,
                    userMail: socialData.socialEmail
                })
                    .then(res => {
                        console.log(res);
                        if (res.data.success) {
                            alert(res.data.message);
                        } else {
                            alert(res.data.message);
                        }
                        router.push("/user/login");
                    })
                    .catch(err => console.error(err))
            }
        } else {
            alert("올바르지 못한 번호입니다!")
        }
    }

    // Boot로 정보 보내기
    function goServer() {
        axios.post(API_URL, {
            ...uvo,
            k_userId: socialData.socialId,
            userName: socialData.socialName,
            userMail: socialData.socialEmail
        })
            .then(data => {
                if (data.data.success) {
                    alert(data.data.message);
                    router.push("/user/login");
                } else {
                    alert(data.data.message);
                    setUvo(initUvo);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('회원가입 중 오류가 발생했습니다.');
            });
    }


    return (
        <div>
            <h2>최초 Kakao 로그인 시 회원가입을 위해 아래 정보를 입력해주세요</h2>
            <h4>전화번호로 기존 회원 정보를 확인하실 수 있습니다</h4>
            <FormControl>
                <Stack direction="column" spacing={1} alignItems='center'>
                    <Avatar />

                    <TextField error={idError || uvo.userId && !idPass} type='text' label='아이디'
                        name='userId' value={uvo.userId} onChange={changeUvo}
                        disabled={!disableUpdate}
                        placeholder='대소문자와 숫자로 구성 4~15자'
                        helperText={!uvo.userId ? "" : idError ? "올바르지 못한 아이디입니다"
                            : idHelper ? idHelper : "중복검사 중..."
                        } />

                    <TextField error={uvo.userPhone && !phonePass || phoneError} type='text' label='전화번호'
                        name='userPhone' value={uvo.userPhone}
                        helperText={
                            !uvo.userPhone ? "" : phoneError ? "올바르지 못한 전화번호입니다"
                                : phoneHelper ? phoneHelper : "중복검사 중..."} onChange={changeUvo} />
                    {disableUpdate ? <></> :
                        <Button variant='contained' disabled={disableUpdate} onClick={updateKakaoId}>
                            기존 회원 정보 연동하기</Button>
                    }

                    <TextField error={pwError} type='password' label='패스워드'
                        name='userPw' value={uvo.userPw} onChange={changeUvo}
                        disabled={!disableUpdate}
                        placeholder='특수, 대소문자 1개씩 포함, 공백 불가, 6~15자'
                        helperText={!uvo.userPw ? "" : pwError ? "올바르지 못한 비밀번호입니다" :
                            "사용 가능한 비밀번호 입니다!"
                        } />

                    <TextField type='text' label='이 름'
                        value={socialData.socialName}
                        disabled
                    />

                    <TextField error={uvo.userNickname && !nickPass}
                        type='text' label='닉네임'
                        name='userNickname' value={uvo.userNickname}
                        disabled={!disableUpdate}
                        helperText={uvo.userNickname && (nickHelper ? nickHelper : "중복검사 중...")} onChange={changeUvo} />

                    <Box>
                        <TextField
                            type='text' label='이메일'
                            value={socialData.socialEmail && (socialData.socialEmail.slice(0, 4).concat('****')
                                .concat(socialData.socialEmail.slice(socialData.socialEmail.indexOf('@'))))}
                            disabled
                        />
                        <Button variant='contained' sx={{ ml: 2 }} onClick={handleSendMail}>인증번호 발송</Button>
                    </Box>

                    <Box>
                        <TextField type='text' label='인증번호 확인'
                            disabled={!mailNum} name="chkMailNum" value={chkMailNum}
                            onChange={(e) => setChkMailNum(e.target.value)} />
                        <Button disabled={!mailNum} variant='contained'
                            sx={{ ml: 2 }} onClick={handleMailChk}>인증번호 확인</Button>
                    </Box>

                    <Box>
                        <TextField type='text' label='주 소' name='userAddr'
                            disabled={!disableUpdate}
                            value={uvo.userAddr} onChange={changeUvo} />
                        <Button variant='contained'
                            disabled={!disableUpdate} onClick={handleAddr} sx={{ ml: 2 }}>주소 찾기</Button>
                    </Box>

                    <Button fullWidth variant='contained' disabled={isBtnChk} onClick={goServer}>JOIN</Button>
                </Stack>
            </FormControl>
        </div >

    );
}

export default Page;
