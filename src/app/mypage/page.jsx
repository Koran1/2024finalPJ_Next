'use client'
import React, { useEffect, useState } from 'react';
import MyPageList from './MyPageList';
import { Box, Stack } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import useAuthStore from '../../../store/authStore';
import axios from 'axios';
import MyPageCard from './MyPageCard';

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    const { user } = useAuthStore();

    const [products, setProducts] = useState([]);
    const [logs, setLogs] = useState([]);

    // 내가 판매한 상품 정보 가져오기
    useEffect(() => {
        if (!user) return;
        axios.get(`${LOCAL_API_BASE_URL}/deal/management/${user.userIdx}`)
            .then((res) => {
                console.log(res.data);
                setProducts(res.data.data.slice(0, 5))
            })
            .catch((err) => console.log(err))

    }, [user])

    // 내가 등록한 후기 정보 가져오기
    // useEffect(() => {
    //     if (!user) return;
    //     axios.get(`${LOCAL_API_BASE_URL}/mycamp/mylog/list`, {
    //         params: { userIdx, page, size },
    //     });
    // }, [user])

    return (
        <div className='mypage-body'>

            <Box display='flex'>
                <MyPageList />
                <Box flexGrow={1} p={2} m={1} sx={{ border: '3px solid lightblue', borderRadius: '10px'}}>
                    <h2>내가 올린 상품&nbsp;
                        <Link href='/deal/management'><ArrowForwardIosIcon /> </Link>
                    </h2>
                    <Stack direction="row">
                        {products.length > 0 ?
                            products.map((prod) => {
                                return <MyPageCard product={prod} key={prod.dealIdx} />

                            })
                            :
                            <p>등록한 상품이 없습니다!</p>
                        }
                    </Stack>

                    <hr />
                    <h2>내가 작성한 후기&nbsp;
                        <Link href='/mycamp/mylog/list'><ArrowForwardIosIcon /> </Link>
                    </h2>
                </Box>
            </Box>
        </div>
    );
}

export default Page;