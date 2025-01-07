'use client'
import { Box, Paper } from '@mui/material';
import MyPageList from '../MyPageList';
import { DataGrid } from '@mui/x-data-grid';

function Page() {

    const columns = [
        { field: 'id', width: 30 },
        { field: 'commentTable', headerName: '게시판 명', minWidth: 140 },
        { field: 'commentTitle', headerName: '게시글', minWidth: 130 },
        { field: 'commentContent', headerName: '댓글 내용', minWidth: 500 },
        { field: 'commentRegDate', headerName: '작성 일자', minWidth: 200 },
    ];

    // 여기가 실제 data 들
    const rows = [
        {
            id: 1,
            commentTable: '캠핌로그', commentTitle: '캠핑로그 제목',
            commentContent: '댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ',
            commentRegDate: '2024-12-12 15:03:51'
        },
        {
            id: 2,
            commentTable: '캠핑장', commentTitle: '캠핑장 제목',
            commentContent: '캠핑장 댓글은 없음 / 캠핑 로그 댓글만 살릴거임 ',
            commentRegDate: '2024-12-12 15:03:52'
        },
        {
            id: 3,
            commentTable: '캠핌로그', commentTitle: '캠핑로그 제목',
            commentContent: '댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ',
            commentRegDate: '2024-12-12 15:03:53'
        },
        {
            id: 4,
            commentTable: '캠핌로그', commentTitle: '캠핑로그 제목',
            commentContent: '댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ',
            commentRegDate: '2024-12-12 15:03:54'
        },
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1}>

                <Paper sx={{ overflow: 'hidden' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper>

            </Box>
        </Box>
    );
}


export default Page;