'use client'
import React, { useEffect, useState } from 'react';
import MyPageList from './MyPageList';
import { Box, Stack } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import useAuthStore from '../../../store/authStore';
import axios from 'axios';
import MyPageCard from './MyPageCard';
import MyPageCardLog from './MyPageCardLog';

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    const { user, token } = useAuthStore();

    const [products, setProducts] = useState([]);
    const [mylogList, setMylogList] = useState([]);

    // 내가 판매한 상품 정보 가져오기
    useEffect(() => {
        if (!user) return;
        axios.get(`${LOCAL_API_BASE_URL}/deal/management/${user.userIdx}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then((res) => {
                console.log(res.data);
                const uniqueItems = res.data.data.reduce((acc, current) => {
                    const existingItem = acc.find(item => item.dealIdx === current.dealIdx);
                    if (!existingItem) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                setProducts(uniqueItems.slice(0, 5))
            })
            .catch((err) => console.log(err))

    }, [user])

    // 내가 등록한 후기 정보 가져오기
    useEffect(() => {
        if (!user) return;
        const page = 1;
        const size = 5;
        const userIdx = user.userIdx

        axios.get(`${LOCAL_API_BASE_URL}/mycamp/mylog/list`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { userIdx, page, size },
        })
            .then((res) => {
                if (res.data.success) {
                    setMylogList(res.data.data.data.slice(0, 5));
                    console.log("데이터 가져오기:", res.data.data);
                } else {
                    alert(res.data.message);
                }
            })
    }, [user])

    return (
        <div className='mypage-body'>

            <Box display='flex'>
                {/* 마이페이지 메뉴 > */}
                <MyPageList />
                <Box flexGrow={1} p={2} m={1} sx={{ borderRadius: '10px' }}>
                    <h2 className='m-sub'>
                        내가 올린 상품&nbsp;
                        <Link className='m-sub' href='/deal/management'>
                            {/* 내가 올린 상품  */}
                            <ArrowForwardIosIcon style={{ marginBottom: '9px', width: '30px' }} /> </Link>
                    </h2>
                    <Stack className='product-grid' direction="row">
                        {products.length > 0 ?
                            products.map((prod) => {
                                return <MyPageCard product={prod} key={prod.dealIdx} />

                            })
                            :
                            <p>등록한 상품이 없습니다!</p>
                        }
                    </Stack>

                    <hr />
                    <h2 className='m-sub'>내가 작성한 후기&nbsp;
                        <Link href='/mycamp/mylog/list'><ArrowForwardIosIcon style={{ marginBottom: '9px', width: '30px' }} /> </Link>
                    </h2>
                    <Stack className='product-grid' direction="row">
                        {mylogList.length > 0 ?
                            mylogList.map((mylog) => {
                                return <MyPageCardLog mylog={mylog} key={mylog.logIdx} />
                            })
                            :
                            <p>등록한 후기가 없습니다!</p>
                        }
                    </Stack>
                </Box>
            </Box>
        </div>
    );
}

export default Page;