"use client"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import './Detail.css';

function Page({ item }) {
  return (
    <>
      <h2 className="title">GuestBook Detail</h2>
      <TableContainer className="table-container">
        <Table className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header">ID</TableCell>
              <TableCell className="table-header">이름</TableCell>
              <TableCell className="table-header">제목</TableCell>
              <TableCell className="table-header">내용</TableCell>
              <TableCell className="table-header">이메일</TableCell>
              <TableCell className="table-header">등록일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="table-cell">{item.gb_idx}</TableCell>
              <TableCell className="table-cell">{item.gb_name}</TableCell>
              <TableCell className="table-cell">{item.gb_subject}</TableCell>
              <TableCell className="table-cell">{item.gb_content}</TableCell>
              <TableCell className="table-cell">{item.gb_email}</TableCell>
              <TableCell className="table-cell">{item.gb_regdate.substring(0,10)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Page;