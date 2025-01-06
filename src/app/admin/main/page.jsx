import React from 'react';
import AdminList from '../AdminList';
import { Box } from '@mui/material';

function Page() {
    return (
        <Box display='flex'>
            <AdminList />
            <Box flexGrow={1} p={2} m={1} sx={{ border: '1px solid black' }}>
                <h1>Here is Admin Main Page</h1>
            </Box>
        </Box>

    );
}

export default Page;