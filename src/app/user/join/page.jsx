"use client"

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

function Page() {
    const [chked, setChked] = useState({
        chkbox1: false,
        chkbox2: false
    })
    const [chkAll, setChkAll] = useState(false);
    const [openModal, setOpenModal] = useState(null);

    const handleOpenModal = (modal) => setOpenModal(modal);
    const handleCloseModal = () => setOpenModal(null);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        const updatedChked = {
            ...chked,
            [name]: checked,
        };

        // Update individual checkboxes and check all state
        setChked(updatedChked);
        setChkAll(Object.values(updatedChked).every((val) => val));
    }
    const toggleChked = () => {
        const newState = !chkAll;
        setChkAll(newState)
        setChked({
            chkbox1: newState,
            chkbox2: newState
        })
    }
    const { chkbox1, chkbox2 } = chked;

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <Typography variant='h5' align='center' sx={{ mb: 2 }}>
                회원가입을 위해서 약관 내용에 먼저 동의해 주세요
            </Typography>

            <FormGroup>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                    <FormControlLabel control={<Checkbox checked={chkAll} onChange={toggleChked} name='chkAll' />} label="전체 동의하기" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, mt: 1 }}>
                    <FormControlLabel required control={<Checkbox checked={chkbox1} onChange={handleChange} name='chkbox1' />}
                        label="(필수) Campers 이용약관 동의" />
                    <Button size='small' variant='outlined' onClick={() => handleOpenModal("joinTerms1")}>전체 보기</Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, mt: 1 }}>
                    <FormControlLabel required control={<Checkbox checked={chkbox2} onChange={handleChange} name='chkbox2' />}
                        label="(필수) Campers 개인정보 수집 및 이용 동의" />
                    <Button size='small' variant='outlined' onClick={() => handleOpenModal("joinTerms2")}>전체 보기</Button>
                </Box>
            </FormGroup>
            <Button variant='contained' disabled={!chkAll} href='/user/join/userJoin'>회원가입</Button>

            <Modal open={openModal === "joinTerms1"} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Box textAlign='right' mt={2}>
                        <Button variant='contained' onClick={handleCloseModal}>X</Button>
                    </Box>
                    <h3>이용약관 동의1</h3>
                    <p>content</p>
                </Box>
            </Modal>

            <Modal open={openModal === "joinTerms2"} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Box textAlign='right' mt={2}>
                        <Button variant='contained' onClick={handleCloseModal}>X</Button>
                    </Box>
                    <h3>이용약관 동의2</h3>
                    <p>content222222222</p>
                </Box>
            </Modal>
        </>
    )
}
export default Page;