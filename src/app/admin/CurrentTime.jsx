"use client"
import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

export default function CurrentTime() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Box sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 20,
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '5px'
        }}>
            <Typography variant="h6">
                {currentTime.toLocaleString('ko-KR')}
            </Typography>
        </Box>
    );
}
