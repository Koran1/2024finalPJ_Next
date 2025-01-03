'use client'
import React, { useEffect } from 'react';
import MyPageList from './MyPageList';
import { Box } from '@mui/material';

function Page() {

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1} sx={{ border: '1px solid black' }}>
                <h2>This is MyPage Main</h2>
            </Box>
        </Box>
    );
}

export default Page;