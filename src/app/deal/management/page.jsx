"use client"

import React from 'react';
import Link from "next/link";
import { useState } from 'react';
import './management.css';

function page(props) {
    return (
        <div className="pd-reg-container">
            <Link href="/deal/write" className="btn1">상품 관리</Link>
            <Link href="/deal/write" className="btn1">구매 내역</Link>
            <Link href="/deal/write" className="btn1">관심 목록</Link>
            <Link href="/deal/write" className="btn1">나의 평점</Link>
            <Link href="/deal/write" className="btn1">쪽지 목록</Link>
        </div>
    );
}

export default page;