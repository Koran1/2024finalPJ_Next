"use client"
import React, { useState } from 'react';
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AdminList from '../AdminList';
import CurrentTime from '../CurrentTime';
import axios from 'axios';

function Page() {
    const LOCAL_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [region, setRegion] = useState(1); // Matches defaultValue
    const [list, setList] = useState([]);

    const handleRefresh = async () => {
        try {
            const API_url = `${LOCAL_URL}/weather/getWthrDatas`;
            const response = await axios.get(API_url);
            alert(response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetWthr = async () => {
        try {
            const API_url = `${LOCAL_URL}/weather/getWthrInfo/${region}`;
            const response = await axios.get(API_url);
            setList(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getMoonImage = (lunAge) => {
        const basePath = '/moon_img/new_calendar_moon';
        const phase = Math.floor(lunAge); // Get the integer part of lunAge
        const phaseRange = phase < 14 ? `${phase}_${phase + 1}` : `${14}_${17}`;
        return `${basePath}${phaseRange}.png`;
    };



    return (
        <Box position="relative" display="flex">
            {/* 좌측 네비게이션 메뉴 */}
            <AdminList />

            {/* 우측 컨텐츠 */}
            <Box flex={1} p={3}>
                {/* 상단 현재 시간 */}
                <CurrentTime />


                <Box
                    display="flex"
                    alignItems="center"
                    mt={5}
                    mb={2}
                    sx={{
                        gap: '16px',
                        height: '48px',
                    }}>
                    <h2>날씨정보관리</h2>

                    <Button variant='contained' onClick={handleRefresh}>날씨 정보 최신화</Button>
                    <br />
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="region-select-label">Region</InputLabel>
                        <Select
                            labelId="region-select-label"
                            id="region-select"
                            value={region}
                            label="Region"
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            {[
                                '서울', '부산', '대구', '인천', '광주', '대전', '울산',
                                '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
                            ].map((name, index) => (
                                <MenuItem key={index + 1} value={index + 1}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant='contained' onClick={handleGetWthr}>날씨 정보 가져오기</Button>

                </Box>
                <TableContainer component={Paper} className="table-container">
                    <Table className="custom-table">
                        <TableHead>

                            <TableRow>
                                {['날짜', '최저', '최고', '날씨', '강수', '일출/일몰', '월출/월몰', '달모양']
                                    .map(header => <TableCell key={header} className="table-header">{header}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map(k => (
                                <TableRow key={k.wthrDate}>
                                    <TableCell>{k.wthrDate}</TableCell>
                                    <TableCell>{Math.round(k.wthrTMin)}</TableCell>
                                    <TableCell>{Math.round(k.wthrTMax)}</TableCell>
                                    <TableCell>{k.wthrSKY_PTY}</TableCell>
                                    <TableCell>{k.wthrPOP}</TableCell>
                                    <TableCell>{k.wthrSunrise}/{k.wthrSunset}</TableCell>
                                    <TableCell>{k.wthrMoonrise}/{k.wthrMoonset}</TableCell>
                                    <TableCell>
                                        <img src={getMoonImage(k.wthrLunAge)} alt={`Moon phase for age ${k.wthrLunAge}`} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Page;
