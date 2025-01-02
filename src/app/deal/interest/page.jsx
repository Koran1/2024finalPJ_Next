// app/deal/interest/page.js
"use client";

import React from "react";
import ProductList from "./ProductList";
import "./interest.css";
import Navigation from "../../../../components/deal/Navigation"; // Navigation 컴포넌트 가져오기

function Page() {
    return (
        <div className="pd-reg-container">
            {/* 상단 네비게이션 */}
            <Navigation />
            
            <hr />
            <div>
                <ProductList /> {/* 관심 상품 리스트 표시 */}
            </div>
        </div>
    );
}

export default Page;
