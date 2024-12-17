'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page(props) {
    const router = useRouter(); // useRouter 초기화
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        // 주소창에 있는 파라미터 가져와서 로그인 처리하자
        const socialIdx = searchParams.get('socialIdx');
        axios.get(`${LOCAL_API_BASE_URL}/user/getSocials?socialIdx=${socialIdx}`)
            .then(res => {
                if (res.data.success) {
                    setSocialData(res.data.data)
                    console.log(res.data.data);
                } else {
                    alert(res.data.message)
                    router.push('/user/login')
                }
            })
            .catch(err => console.error(err))
    }, [router]);

    const [socialData, setSocialData] = useState([]);
    // 현재 여기에 이름, id, email 있음

    return (
        <div>
            <h2>Naver Social Join Page</h2>

        </div>
    );
}

export default Page;