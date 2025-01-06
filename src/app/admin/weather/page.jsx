"use client"
import React from 'react';
import { Box, Grid2 } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';

function Page(props) {
    return (
        <div>
            <Box position="relative">
                <AdminList />
                <CurrentTime />
            </Box>
            <Grid2 container spacing={0}>
                <Grid2 size={0} />
                <Grid2 size={12}>
                    {/* 다른 컴포넌트 내용 */}
                </Grid2>
                <Grid2 size={0} />
            </Grid2>
        </div>
    );
}

export default Page;
