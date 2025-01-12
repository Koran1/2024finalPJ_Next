"use client";
import { useState } from "react";
import {
    Box, TextField, Select, MenuItem, FormControl, Button,
    Table, TableBody, TableCell, TableContainer, TableRow,
    Paper, Typography, TextareaAutosize,
} from "@mui/material";
import AdminList from "../../AdminList";
import CurrentTime from "../../CurrentTime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function Page() {
    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const router = useRouter();

    // 현재 날짜 가져오는 함수
    const getKoreanDate = () => {
        const now = new Date();
        now.setHours(now.getHours() + 9);
        return now.toISOString().split("T")[0];
    };

    // 폼 데이터 초기화
    const [formData, setFormData] = useState({
        noticeSubject: "",
        noticeReg: getKoreanDate(),
        noticeLevel: "",
        noticeStatus: "",
        noticeContent: "",
        noticeMultipartFile: null
    });

    // 입력 값 변경 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 파일 처리 함수
    const handleFileChange = (e) => {
        const { name, valuse } = e.target;
        setFormData((prev) => ({
            ...prev, file: e.target.files[0]
        }));
    }

    // 공지사항 작성 함수
    const handleSubmit = async () => {
        const API_URL = `${CAMP_API_BASE_URL}/admin/noticeList/write`;
        const data = new FormData();

        data.append("noticeSubject", formData.noticeSubject);
        data.append("noticeReg", formData.noticeReg);
        data.append("noticeLevel", formData.noticeLevel);
        data.append("noticeStatus", formData.noticeStatus);
        data.append("noticeContent", formData.noticeContent);
        if (formData.file) {
            data.append("noticeMultipartFile", formData.file);
        }

        try {
            const response = await axios.post(API_URL, data);
            if (response.data.success) {
                alert(response.data.message);
                router.push("/admin/noticeList");
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            console.error("공지사항 작성 오류 발생", err);
            alert("공지사항 작성 오류 발생");
        }
    };

    // 입력 값 검증 함수
    const isFormValid =
        formData.noticeSubject &&
        formData.noticeReg &&
        formData.noticeLevel &&
        formData.noticeStatus &&
        formData.noticeContent;

    return (
        <Box position="relative" display="flex">
            {/* 좌측 네비게이션 메뉴 */}
            <AdminList />

            {/* 우측 컨텐츠 */}
            <Box flex={1} p={3}>
                {/* 상단 현재 시간 */}
                <CurrentTime />

                {/* 공지사항 작성 영역 */}
                <TableContainer component={Paper} sx={{ marginTop: 5, padding: 2 }}>
                    <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                        공지사항 작성
                    </Typography>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    제목
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        placeholder="공지사항 제목 입력"
                                        name="noticeSubject"
                                        value={formData.noticeSubject}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    등록 일자
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        // type="date"
                                        variant="standard"
                                        name="noticeReg"
                                        value={formData.noticeReg}
                                        disabled
                                        // onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    게시글 Level
                                </TableCell>
                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select
                                            name="noticeLevel"
                                            value={formData.noticeLevel}
                                            onChange={handleChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                <em>선택</em>
                                            </MenuItem>
                                            <MenuItem value="1">1</MenuItem>
                                            <MenuItem value="2">2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    게시글 보이기
                                </TableCell>
                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select
                                            name="noticeStatus"
                                            value={formData.noticeStatus}
                                            onChange={handleChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                <em>선택</em>
                                            </MenuItem>
                                            <MenuItem value="on">on</MenuItem>
                                            <MenuItem value="off">off</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    첨부파일
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        파일 선택
                                        <input
                                            type="file"
                                            hidden
                                            name="noticeMultipartFile"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {formData.file && (
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            선택된 파일: {formData.file.name}
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    내용
                                </TableCell>
                                <TableCell>
                                    <TextareaAutosize
                                        minRows={6}
                                        placeholder="공지사항 내용을 입력하세요"
                                        style={{ width: "100%", padding: "8px" }}
                                        name="noticeContent"
                                        value={formData.noticeContent}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!isFormValid}
                            onClick={handleSubmit}
                            sx={{ mr: 2 }}
                        >
                            저장
                        </Button>
                        <Link href="/admin/noticeList">
                            <Button variant="outlined">취소</Button>
                        </Link>
                    </Box>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Page;
