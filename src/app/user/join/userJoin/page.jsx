"use client"
import { Avatar, Box, Button, FormControl, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
import './userjoin.css'

function Page(props) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const API_URL = `${LOCAL_API_BASE_URL}/user/join`;
    const router = useRouter(); // useRouter 초기화
    // 텍스트필드 초기화
    const initUvo = {
        userId: "",
        userPw: "",
        userName: "",
        userNickname: "",
        userMail: "",
        userPhone: "",
        userAddr: ""
    }

    const [uvo, setUvo] = useState(initUvo);
    const [idError, setIdError] = useState(false);
    const [pwError, setPwError] = useState(false);
    const [mailError, setMailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const [mailNum, setMailNum] = useState("");
    const [chkMailNum, setChkMailNum] = useState("");
    const [mailPass, setMailPass] = useState(false);

    const [idPass, setIdPass] = useState(false);
    const [nickPass, setNickPass] = useState(false);
    const [phonePass, setPhonePass] = useState(false);
    const [mailDupl, setMailDupl] = useState(false);

    const [idHelper, setIdHelper] = useState("");
    const [nickHelper, setNickHelper] = useState("");
    const [phoneHelper, setPhoneHelper] = useState("");
    const [mailHelper, setMailHelper] = useState("");

    // 모든 입력 필드가 비어있지 않아야 true => 버튼이 활성화
    const isBtnChk = !uvo.userId || idError || !idPass || !uvo.userPw || pwError || !uvo.userName
        || !uvo.userNickname || !nickPass || !uvo.userMail || mailError || !mailPass
        || !uvo.userPhone || phoneError || !phonePass || !uvo.userAddr;


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

    // ID & PW & Mail & Phone 패턴 정하기
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

    // Boot로 정보 보내기
    function goServer() {
        axios.post(API_URL, uvo)
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
        <div className='container-box'>
            <div className='p1'> 회원가입 </div>
            <FormControl >
                {/* 수직정렬 */}
                <Stack direction="column" spacing={1} alignItems='center'>
                    {/* <Avatar /> */}
                    <TextField className='textf' error={idError || uvo.userId && !idPass} type='text' label='아이디'
                        name='userId' value={uvo.userId} onChange={changeUvo}
                        placeholder='대소문자와 숫자로 구성 4~15자'
                        helperText={!uvo.userId ? "" : idError ? "올바르지 못한 아이디입니다"
                            : idHelper ? idHelper : "중복검사 중..."
                        } />

                    <TextField className='textf' error={pwError && uvo.userPw} type='password' label='패스워드'
                        name='userPw' value={uvo.userPw} onChange={changeUvo}
                        placeholder='특수, 대소문자 1개씩 포함, 공백 불가, 6~15자'
                        helperText={!uvo.userPw ? "" : pwError ? "올바르지 못한 비밀번호입니다" :
                            "사용 가능한 비밀번호 입니다!"
                        } />

                    <TextField className='textf' type='text' label='이 름' name='userName'
                        value={uvo.userName} onChange={changeUvo} />

                    <TextField className='textf' error={uvo.userNickname && !nickPass}
                        type='text' label='닉네임'
                        name='userNickname' value={uvo.userNickname}
                        helperText={uvo.userNickname && (nickHelper ? nickHelper : "중복검사 중...")} onChange={changeUvo} />

                    <Box>
                        <TextField error={uvo.userMail && !mailDupl || mailError}
                            type='text' label='이메일'
                            name='userMail' value={uvo.userMail}
                            helperText={uvo.userMail && (mailError ? "올바르지 못한 이메일입니다"
                                : mailHelper ? mailHelper : "중복 검사 중...")}
                            onChange={changeUvo} />
                        <Button variant='contained' sx={{ ml: 2 }}
                            disabled={!uvo.userMail || mailError} onClick={handleSendMail}>인증번호 발송</Button>
                    </Box>

                    <Box>
                        <TextField type='text' label='인증번호 확인'
                            disabled={!mailNum} name="chkMailNum" value={chkMailNum}
                            onChange={(e) => setChkMailNum(e.target.value)} />
                        <Button disabled={!mailNum} variant='contained'
                            sx={{ ml: 2 }} onClick={handleMailChk}>인증번호 확인</Button>
                    </Box>

                    <TextField className='textf' error={uvo.userPhone && !phonePass || phoneError} type='text' label='전화번호'
                        name='userPhone' value={uvo.userPhone}
                        helperText={
                            !uvo.userPhone ? "" : phoneError ? "올바르지 못한 전화번호입니다"
                                : phoneHelper ? phoneHelper : "중복검사 중..."} onChange={changeUvo} />

                    <Box>
                        <TextField type='text' label='주 소' name='userAddr'
                            value={uvo.userAddr} onChange={changeUvo} />
                        <Button variant='contained' onClick={handleAddr} sx={{ ml: 2 }}>주소 찾기</Button>
                    </Box>

                    <Button fullWidth variant='contained' disabled={isBtnChk} onClick={goServer}>JOIN</Button>
                </Stack>
            </FormControl>
        </div >

    );
}

export default Page;