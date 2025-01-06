"use client"
import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box } from '@mui/material';

const CurrentTime = () => {
    const [currentTime, setCurrentTime] = useState('');

    // 현재 시간 업데이트 함수
    const updateCurrentTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        setCurrentTime(`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
    };

    useEffect(() => {
        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box 
            position="absolute" 
            top="16px" 
            right="16px" 
            display="flex" 
            flexDirection="column" 
            alignItems="flex-end" 
            fontWeight="bold"
            fontSize="20px"
        >
            <span>
                {currentTime} {" "}
                <AccountCircleIcon style={{ fontSize: "35px" }} />
            </span>
        </Box>
    );
};

export default CurrentTime;
