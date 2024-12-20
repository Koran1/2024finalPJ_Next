"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import "./message.css";
import { alpha, Avatar, Badge, Box, Card, Grid2, InputBase, styled, Typography } from "@mui/material";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SearchIcon from "@mui/icons-material/Search";
import ChatBox from "../../../../components/deal/Chat/ChatBox";

// Search field style
const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 100,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 20,
    width: "100%",
    [theme.breakpoints.up("xs")]: {
        marginRight: theme.spacing(1),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    color: "#757FEF",
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    right: "0",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "5",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        backgroundColor: "#F5F7FA",
        borderRadius: "30px",
        padding: theme.spacing(1.4, 0, 1.4, 2),
    },
}));

function Page() {


    // State to track active link
    const [activeLink, setActiveLink] = useState('/deal/message');

    // Function to determine the active class
    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };



    return (
        <div className="pd-reg-container">
            {/* 상단 네비게이션 */}
            <div>
                <Link href="/deal/management"
                    className={`btn1 ${getActiveClass('/deal/management')}`}
                    onClick={() => setActiveLink('/deal/management')}>
                    상품 관리
                </Link>
                <Link href="/deal/purchase"
                    className={`btn1 ${getActiveClass('/deal/purchase')}`}>
                    구매 관리
                </Link>
                <Link href="/deal/interest"
                    className={`btn1 ${getActiveClass('/deal/interest')}`}
                    onClick={() => setActiveLink('/deal/interest')}>
                    관심 목록
                </Link>
                <Link href="/deal/rating"
                    className={`btn1 ${getActiveClass('/deal/rating')}`}
                    onClick={() => setActiveLink('/deal/rating')}>
                    나의 평점
                </Link>
                <Link href="/deal/message"
                    className={`btn1 ${getActiveClass('/deal/message')}`}
                    onClick={() => setActiveLink('/deal/message')}>
                    쪽지 목록
                </Link>
                <br />
                <div className="part"> 평점 39개</div>
            </div>



            <Tabs className="chat-tabs">
                <Grid2
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
                >
                    <Grid2 xs={12} sm={12} md={4} lg={4} xl={3}>
                        <Card
                            sx={{
                                boxShadow: "none",
                                p: "20px",
                                mb: "15px",
                            }}
                        >
                            {/* All Messages */}
                            <Typography mb="10px">
                                <i className="ri-message-2-line"></i> 모든 메세지
                            </Typography>

                            <TabList >
                                {/* Tab 1 */}
                                <Tab style={{
                                    border: "1px solid #E8E8F7",
                                    borderRadius: "10px",
                                    padding: "10px 15px",
                                }}
                                    onClick={() => alert("Tab 1 Clicked")}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                }}
                                            >
                                                <Avatar src="/images/tree-2.jpg" />
                                                <span className="active-status successBgColor"></span>
                                            </Box>

                                            <Box className="ml-1">
                                                <Typography
                                                    as="h4"
                                                    fontSize="13px"
                                                    fontWeight="500"
                                                    mb="5px"
                                                >
                                                    Laurent Perrier
                                                    {/* // 여기에 보낸 사람 이름 */}
                                                </Typography>
                                                <Typography fontSize="12px">Typing...</Typography>
                                                {/* // 여기에 메세지 가장 최근 내용 */}
                                            </Box>
                                        </Box>

                                        <Box textAlign="right">
                                            <Typography
                                                sx={{
                                                    color: "#A9A9C8",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                4:30 PM
                                                {/* // 여기에 메세지 시간 */}
                                            </Typography>

                                            <Box className="mr-10px">
                                                <Badge
                                                    badgeContent={2} // 여기에 메세지 개수
                                                    color="primary"
                                                    className="for-dark-text-white"
                                                ></Badge>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Tab>

                            </TabList>
                        </Card>
                    </Grid2>
                    <Grid2 xs={12} sm={12} md={8} lg={8} xl={9}>
                        <Card
                            sx={{
                                boxShadow: "none",
                                p: "25px 20px",
                                mb: "15px",
                                borderRadius: "10px",
                            }}
                        >
                            <TabPanel>
                                {/* ChatBox */}
                                <ChatBox room={1} />
                            </TabPanel>


                        </Card>
                    </Grid2>
                </Grid2>
            </Tabs>
        </div>
    );
}

export default Page;
