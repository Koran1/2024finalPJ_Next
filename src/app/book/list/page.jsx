"use client"
import Link from 'next/link';
import { useState } from 'react';
import "./booklist.css";

function Page(props) {
    const [navMenu, setNavMenu] = useState("/book/list");

    // 상단 네비게이션 메뉴 활성화 여부
    const getActiveClass = (link) => {
        return navMenu === link ? 'active' : '';
    }
    
    return (
        <div className="book-list-main-container">
            <div className="book-navmenu-container">
                {/* 상단 네비게이션바 */}
                <Link href="/mycamp/plan"
                        className={`btn1 ${getActiveClass('/mylog/plan')}`}
                        onClick={() => setNavMenu('/mylog/plan')}
                        >
                        캠핑플래너
                </Link>
                <Link href="/book/list"
                        className={`btn1 ${getActiveClass('/book/list')}`}
                        onClick={() => setNavMenu('/book/list')}
                        >
                        나의 예약
                </Link>
                <Link href="/mycamp/mylog/list"
                        className={`btn1 ${getActiveClass('/mylog/list')}`}
                        onClick={() => setNavMenu('/mylog/list')}
                        >
                        나의 캠핑로그
                </Link>
                <Link href="/camp/favCamp"
                        className={`btn1 ${getActiveClass('/mylog/favcamp')}`}
                        onClick={() => setNavMenu('/mylog/favcamp')}
                        >
                        위시리스트
                </Link>
            </div>
        </div>
    );
}

export default Page;