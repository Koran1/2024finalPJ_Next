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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function Page() {
    const { noticeIdx } = useParams(); // <-- use useParams() instead of props
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
                const API_URL = `${CAMP_API_BASE_URL}/admin/noticeList/detail/${noticeIdx}`;
                const response = await axios.get(API_URL);

                if (response.data.success) {
                    setFormData(response.data.data);
                    console.log("공지사항 수정 데이터: ", response.data.data);
                } else {
                    setError("공지사항 데이터를 가져오는 데 실패했습니다.");
                }
            } catch (err) {
                console.error("공지사항 가져오기 오류:", err);
                setError("공지사항 데이터를 가져오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [noticeIdx, CAMP_API_BASE_URL]);

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
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            noticeMultipartFile: file, // 새 파일 저장
        }));
    };

    const handleSubmit = async () => {
        const API_URL = `${CAMP_API_BASE_URL}/admin/noticeList/update/${noticeIdx}`;
        const data = new FormData();

        // 새 파일이 있는 경우 추가
        if (formData.noticeMultipartFile) {
            data.append("noticeMultipartFile", formData.noticeMultipartFile);
        }

        // 나머지 데이터를 추가
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "noticeMultipartFile") {
                data.append(key, value);
            }
        });

        try {
            const response = await axios.put(API_URL, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                alert("공지사항 수정 완료");
                router.push("/admin/noticeList");
            } else {
                alert("공지사항 수정 실패");
            }
        } catch (err) {
            console.error("공지사항 수정 오류 발생", err);
            alert("공지사항 수정 중 오류가 발생했습니다.");
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
        formData?.noticeSubject &&
        formData?.noticeReg &&
        formData?.noticeLevel &&
        formData?.noticeStatus &&
        formData?.noticeContent;

    return (
        <Box position="relative" display="flex">
            {/* 좌측 네비게이션 메뉴 */}
            <AdminList />

            {/* 우측 컨텐츠 */}
            <Box flex={1} p={3}>
                {/* 상단 현재 시간 */}
                <CurrentTime />

                {/* 공지사항 수정 영역 */}
                <TableContainer component={Paper} sx={{ marginTop: 5, padding: 2 }}>
                    <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                        공지사항 수정
                    </Typography>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">제목</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        name="noticeSubject"
                                        value={formData.noticeSubject || ""}
                                        onChange={handleChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">등록 일자</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        variant="standard"
                                        name="noticeReg"
                                        value={
                                            formData.noticeReg
                                            ? formData.noticeReg.split(" ")[0] 
                                            : ""
                                        }
                                        onChange={handleChange}
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
                                            value={formData.noticeLevel || ""}
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
                                            value={formData.noticeStatus || ""}
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
                                <TableCell>첨부파일</TableCell>
                                <TableCell>
                                    {/* 기존 파일 이름 표시 */}
                                    {formData?.noticeFile && (
                                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                            기존 파일: {formData.noticeFile}
                                        </Typography>
                                    )}

                                    {/* 새 파일 선택 버튼 */}
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

                                    {/* 새로 선택한 파일 이름 표시 */}
                                    {formData?.noticeMultipartFile && (
                                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                                            수정된 파일: {formData.noticeMultipartFile.name}
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">내용</TableCell>
                                <TableCell>
                                    <TextareaAutosize
                                        minRows={6}
                                        placeholder="공지사항 내용을 입력하세요"
                                        style={{ width: "100%", padding: "8px" }}
                                        name="noticeContent"
                                        value={formData.noticeContent || ""}
                                        onChange={handleChange}
                                    />
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
