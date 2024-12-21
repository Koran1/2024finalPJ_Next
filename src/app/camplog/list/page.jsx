import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';

function Page(props) {
    return (
        <div>
            <h1>이곳은 캠핑로그 리스트 페이지</h1>
            <Link href="/camplog/write"><Button variant="contained">글쓰기</Button></Link>
        </div>
    );
}

export default Page;