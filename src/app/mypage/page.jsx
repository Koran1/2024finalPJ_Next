import React from 'react';
import MyPageList from './MyPageList';
import { Box } from '@mui/material';

function Page() {
    return (
        <Box>
            <MyPageList />
            <h2>This is MyPage</h2>
        </Box>
    );
}

export default Page;