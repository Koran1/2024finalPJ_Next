"use client";
import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Typography,
    TextareaAutosize,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import AdminList from "@/app/admin/AdminList";
import CurrentTime from "@/app/admin/CurrentTime";

function Page() {
    const { faqIdx } = useParams(); // <-- use useParams() instead of props
    const CAMP_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const router = useRouter();

    const [formData, setFormData] = useState(null); // 폼 데이터 상태
    const [loading, setLoading] = useState(true);    // 로딩 상태
    const [error, setError] = useState(null);        // 에러 상태

    // 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const API_URL = `${CAMP_API_BASE_URL}/admin/faqList/detail/${faqIdx}`; // 수정된 부분
                const response = await axios.get(API_URL);

                if (response.data.success) {
                    setFormData(response.data.data);
                    console.log("FAQ 수정 데이터: ", response.data.data);
                } else {
                    setError("FAQ 데이터를 가져오는 데 실패했습니다.");
                }
            } catch (err) {
                console.error("FAQ 가져오기 오류:", err);
                setError("FAQ 데이터를 가져오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [faqIdx, CAMP_API_BASE_URL]);


    // 입력 값 변경 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const API_URL = `${CAMP_API_BASE_URL}/admin/faqList/update/${faqIdx}`;

        try {
            const response = await axios.put(API_URL, formData, {
                headers: { "Content-Type": "application/json" }, // JSON 형식으로 전달
            });

            if (response.data.success) {
                alert("FAQ 수정 완료");
                router.push("/admin/faqList");
            } else {
                alert("FAQ 수정 실패");
            }
        } catch (err) {
            console.error("FAQ 수정 오류 발생", err);
            alert("FAQ 수정 중 오류가 발생했습니다.");
        }
    };

    // 로딩 중 또는 데이터가 없는 경우 처리
    if (loading || !formData) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const isFormValid =
        formData?.faqQuestion &&
        formData?.faqAnswer &&
        formData?.faqReg &&
        formData?.faqStatus;

    return (
        <Box position="relative" display="flex">
            {/* 좌측 네비게이션 메뉴 */}
            <AdminList />

            {/* 우측 컨텐츠 */}
            <Box flex={1} p={3}>
                {/* 상단 현재 시간 */}
                <CurrentTime />

                {/* FAQ 수정 영역 */}
                <TableContainer component={Paper} sx={{ marginTop: 5, padding: 2 }}>
                    <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                        FAQ 수정
                    </Typography>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">자주 묻는 질문 Question</TableCell>
                                <TableCell>
                                    <TextareaAutosize
                                        minRows={6}
                                        placeholder="FAQ 질문 내용을 입력하세요"
                                        style={{ width: "100%", padding: "8px" }}
                                        name="faqQuestion"
                                        value={formData.faqQuestion || ""}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">자주 묻는 질문 Answer</TableCell>
                                <TableCell>
                                    <TextareaAutosize
                                        minRows={6}
                                        placeholder="FAQ 답변 내용을 입력하세요"
                                        style={{ width: "100%", padding: "8px" }}
                                        name="faqAnswer"
                                        value={formData.faqAnswer || ""}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">등록 일자</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        // type="date"
                                        variant="standard"
                                        name="faqReg"
                                        value={
                                            formData.faqReg
                                                ? formData.faqReg.split(" ")[0]
                                                : ""
                                        }
                                        disabled
                                        // onChange={handleChange}
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
                                            name="noticeStatus"
                                            value={formData.faqStatus || ""}
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

                    <Box display="flex" justifyContent="center" mt={2} gap={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!isFormValid}
                            onClick={handleSubmit}
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
