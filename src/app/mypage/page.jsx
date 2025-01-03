'use client'
import React, { useEffect } from 'react';
import MyPageList from './MyPageList';
import { Box } from '@mui/material';

function Page() {

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1} sx={{ border: '3px solid lightblue', borderRadius:'10px' }}>
                <div className='mypage-field'>This is MyPage Main</div>
            </Box>
        </Box>
    );
}

export default Page;