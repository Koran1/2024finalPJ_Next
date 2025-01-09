"use client";
import { useState } from "react";
import {
    Box, TextField, Select, MenuItem, FormControl, Button,
    Table, TableBody, TableCell, TableContainer, TableRow,
    Paper, Typography, TextareaAutosize,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import AdminList from "../../AdminList";
import CurrentTime from "../../CurrentTime";

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
        faqQuestion: "",
        faqAnswer: "",
        faqStatus: "",
        faqReg: getKoreanDate(),
    });

    // 입력 값 변경 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // FAQ 작성 함수
    const handleSubmit = async () => {
        const API_URL = `${CAMP_API_BASE_URL}/admin/faqList/write`;
        const data = new FormData();

        data.append("faqQuestion", formData.faqQuestion);
        data.append("faqAnswer", formData.faqAnswer);
        data.append("faqStatus", formData.faqStatus);
        data.append("faqReg", formData.faqReg);

        try {
            const response = await axios.post(API_URL, data);
            if (response.data.success) {
                alert(response.data.message);
                router.push("/admin/faqList");
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            console.error("FAQ 작성 오류 발생", err);
            alert("FAQ 작성 오류 발생");
        }
    };

    // 입력 값 검증 함수
    const isFormValid =
        formData.faqQuestion &&
        formData.faqAnswer &&
        formData.faqReg &&
        formData.faqStatus;

    return (
        <Box position="relative" display="flex">
            {/* 좌측 네비게이션 메뉴 */}
            <AdminList />

            {/* 우측 컨텐츠 */}
            <Box flex={1} p={3}>
                {/* 상단 현재 시간 */}
                <CurrentTime />

                {/* FAQ 작성 영역 */}
                <TableContainer component={Paper} sx={{ marginTop: 5, padding: 2 }}>
                    <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                        FAQ 작성
                    </Typography>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    자주 묻는 질문 Question
                                </TableCell>
                                <TableCell>
                                    <TextareaAutosize
                                        minRows={6}
                                        placeholder="FAQ 질문 입력하세요"
                                        style={{ width: "100%", padding: "8px" }}
                                        name="faqQuestion"
                                        value={formData.faqQuestion}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    자주 묻는 질문 Answer
                                </TableCell>
                                <TableCell>
                                    <TextareaAutosize
                                        minRows={6}
                                        placeholder="FAQ 답변 입력하세요"
                                        style={{ width: "100%", padding: "8px" }}
                                        name="faqAnswer"
                                        value={formData.faqAnswer}
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
                                        type="date"
                                        variant="standard"
                                        name="faqReg"
                                        value={formData.faqReg}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    게시글 보이기
                                </TableCell>
                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select
                                            name="faqStatus"
                                            value={formData.faqStatus}
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
                        <Link href="/admin/faqList">
                            <Button variant="outlined">취소</Button>
                        </Link>
                    </Box>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Page;
