import { Box } from '@mui/material';
import React from 'react';
import { AddSideBar } from '../AddSideBar';

function Page(props) {
    return (
        <div>
            <Box display="flex">
                <AddSideBar />
                <Box flexGrow={1} p={2}>
                    <h2>I am FAQ</h2>
                </Box>
            </Box>
        </div>
    );
}

export default Page;