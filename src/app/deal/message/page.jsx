"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import "./message.css";
import { alpha, Avatar, Badge, Box, Card, Grid2, InputBase, styled, Typography } from "@mui/material";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ChatBox from "../../../../components/deal/Chat/ChatBox";
import useAuthStore from "../../../../store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";


function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;

    // State to track active link
    const [activeLink, setActiveLink] = useState('/deal/message');

    // Function to determine the active class
    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };

    const { isAuthenticated, isExpired, user } = useAuthStore();
    // 판매자 정보(idx) 가져오기
    const otherUser = useSearchParams().get('seller');
    const dealIdx = useSearchParams().get('dealIdx');

    const [chatList, setChatList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [recentChat, setRecentChat] = useState([]);

    // 로그인 확인 절차
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    // 전체 채팅 정보 가져오기
    useEffect(() => {
        if (user == null) return;
        setLoading(true);

        console.log('otherUserIdx : ' + otherUser);
        axios.get(`${LOCAL_API_BASE_URL}/chat/getChatList?sellerIdx=${otherUser}&userIdx=${user.userIdx}&dealIdx=${dealIdx}`)
            .then((res) => {
                console.log(res.data.data)
                if (res.data.success) {
                    setChatList(res.data.data.chatList);
                    setUserList(res.data.data.userList);
                    setRecentChat(res.data.data.recentChat);
                } else {
                    alert(res.data.message)
                }

            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));


    }, [user]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
    }


    return (
        <div >
            {/* 상단 네비게이션 */}
            <div className="pd-reg-container" >
                <div className="nav-links">
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
                </div>
                <hr />
            </div>

            {/* 채팅 화면 */}
            {chatList.length === 0 ?
                <Box>
                    <h1>채팅 내역이 없습니다</h1>
                </Box>
                :

                <Tabs className="chat-tabs" >
                    <Grid2
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
                    >
                        <Grid2 xs={4} sm={4} md={4} lg={4} xl={4}
                            width="30%"
                        >
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
                                    {
                                        chatList
                                            .sort((a, b) => {
                                                const isAOtherUser = a.userIdx === otherUser && a.dealIdx === dealIdx;
                                                const isBOtherUser = b.userIdx === otherUser && b.dealIdx === dealIdx;

                                                if (isAOtherUser && !isBOtherUser) return -1;   // a가 상대방이면 a를 먼저
                                                if (!isAOtherUser && isBOtherUser) return 1;    // b가 상대방이면 b를 먼저

                                                // 둘 다 아닌 경우
                                                const aRecentChat = recentChat.find((rec) => rec.chatRoom === a.chatRoom);
                                                const bRecentChat = recentChat.find((rec) => rec.chatRoom === b.chatRoom);

                                                const aChatTime = aRecentChat?.chatTime || 0;
                                                const bChatTime = bRecentChat?.chatTime || 0;

                                                return new Date(bChatTime) - new Date(aChatTime);
                                            })
                                            .map((chat) => {
                                                return (
                                                    <Tab style={{
                                                        border: "1px solid #E8E8F7",
                                                        borderRadius: "10px",
                                                        padding: "10px 15px",
                                                    }}
                                                        key={chat.chatRoom}
                                                        value={chat.chatRoom}
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
                                                                        marginRight: "10px",
                                                                    }}
                                                                >
                                                                    {userList.map((user) => {
                                                                        if (chat.userIdx === user.userIdx) {
                                                                            <Avatar src={user.userEtc01 ? `${LOCAL_IMG_URL}/user/${user.userEtc01}` : "default-product-image.jpg"} />
                                                                        }
                                                                    })}
                                                                </Box>

                                                                <Box className="ml-1">
                                                                    <Typography
                                                                        as="h4"
                                                                        fontSize="18px"
                                                                        fontWeight="600"
                                                                        mb="5px"
                                                                    >
                                                                        {/* // 여기에 보낸 사람 이름 */}
                                                                        {userList.find((user) => chat.userIdx === user.userIdx).userNickname}
                                                                    </Typography>

                                                                    {/* // 여기에 메세지 가장 최근 내용 */}
                                                                    <Typography fontSize="12px">
                                                                        {(() => {
                                                                            const rec = recentChat.find((rec) => rec.chatRoom === chat.chatRoom);
                                                                            if (rec) {
                                                                                const msg = rec.chatMessage;
                                                                                return msg ? (msg.length > 15 ? msg.substring(0, 15) + '...' : msg) : "...";
                                                                            }
                                                                            return
                                                                        })()}
                                                                    </Typography>

                                                                </Box>
                                                            </Box>

                                                            <Box textAlign="right">
                                                                <Typography
                                                                    sx={{
                                                                        color: "#A9A9C8",
                                                                        fontSize: "11px",
                                                                    }}
                                                                >
                                                                    {/* // 여기에 메세지 시간 */}
                                                                    {recentChat.map((rec) => {
                                                                        if (rec.chatRoom === chat.chatRoom) {
                                                                            const msgTime = rec.chatTime;
                                                                            if (msgTime) {
                                                                                const todayDate = new Date().getDay();

                                                                                // 오늘 날짜이면 시간만 표시
                                                                                if (todayDate === new Date(msgTime).getDay()) {
                                                                                    const ampm = msgTime.substring(11, 13) > 11 ? 'PM' : 'AM';
                                                                                    return msgTime.substring(11, 16) + ' ' + ampm;
                                                                                } else {
                                                                                    return msgTime.substring(5, 7) + '.' + msgTime.substring(8, 16);
                                                                                }
                                                                            } else {
                                                                                return ''
                                                                            }
                                                                        }
                                                                    })}
                                                                </Typography>

                                                                <Box className="mr-10px">
                                                                    <Badge
                                                                        badgeContent={chat.unReadCount} // 여기에 메세지 개수
                                                                        color="primary"
                                                                        className="for-dark-text-white"
                                                                    ></Badge>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Tab>

                                                )
                                            })
                                    }


                                </TabList>
                            </Card>
                        </Grid2>

                        <Grid2 xs={8} sm={8} md={8} lg={8} xl={8}
                            width="60%" paddingLeft="5%" paddingRight="5%">
                            <Card
                                sx={{
                                    boxShadow: "none",
                                    p: "30px 30px",
                                    mb: "15px",
                                    borderRadius: "10px",
                                }}
                            >
                                {
                                    chatList.map((chat) => {
                                        return (
                                            <TabPanel key={chat.chatRoom} value={chat.chatRoom}>
                                                {/* ChatBox */}
                                                <ChatBox room={chat.chatRoom} senderIdx={chat.userIdx}
                                                    senderNick={userList.map((user) => {
                                                        if (chat.userIdx === user.userIdx) {
                                                            return user.userNickname
                                                        }
                                                    })}
                                                    dealIdx={chat.dealIdx}
                                                />
                                            </TabPanel>
                                        )
                                    })
                                }


                            </Card>
                        </Grid2>
                    </Grid2>
                </Tabs>
            }
        </div>
    );
}

export default Page;
