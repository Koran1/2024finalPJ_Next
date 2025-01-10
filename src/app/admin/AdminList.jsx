'use client'
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LandscapeIcon from '@mui/icons-material/Landscape';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import './admin.css';
import React from "react";

export default function AdminList() {
    const router = useRouter();
    const pathname = usePathname();

    // 클릭한 메뉴로 이동
    const handleNavigation = (path) => {
        if (pathname !== path) {
            router.push(path);
        }
    };

    return (
        <List
            sx={{
                width: '100%',
                height: '100vh',
                minWidth: 240,
                maxWidth: 360,
                bgcolor: 'background.paper',
                borderRight: '1px solid black',
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader" sx={{ fontSize: '32px', borderBottom: '1px solid lightgray' }}>
                    <Link className="ad-txt" href="/admin/main/">
                        관리자 페이지
                    </Link>
                </ListSubheader>
            }
        >
            {[
                { path: '/admin/userList', text: '회원정보관리', icon: <ManageAccountsIcon /> },
                { path: '/admin/userReport', text: '신고내역관리', icon: <ReportGmailerrorredIcon /> },
                { path: '/admin/campList', text: '캠핑정보관리', icon: <LandscapeIcon /> },
                { path: '/admin/campLogList', text: '캠핑로그관리', icon: <PostAddIcon /> },
                { path: '/admin/dealList', text: '캠핑마켓관리', icon: <LocalGroceryStoreIcon /> },
                { path: '/admin/noticeList', text: '공지사항관리', icon: <AnnouncementIcon /> },
                { path: '/admin/faqList', text: 'FAQ관리', icon: <QuestionAnswerIcon /> },
                { path: '/admin/qnaList', text: 'QNA관리', icon: <HelpCenterIcon /> },
                { path: '/admin/weather', text: '날씨정보관리', icon: <WbSunnyIcon /> },
            ].map((menu, index) => (
                <ListItemButton
                    key={index}
                    onClick={() => handleNavigation(menu.path)}
                    sx={{
                        '&:hover': {
                            bgcolor: 'lightgray' // Hover 시 배경색
                        }
                    }}
                >
                    <ListItemIcon>
                        {React.cloneElement(menu.icon, {
                            sx: {
                                color: pathname === menu.path ? '#1976D2' : 'inherit'
                            }
                        })}
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography
                                sx={{
                                    color: pathname === menu.path ? '#1976D2' : 'inherit', 
                                    fontWeight: pathname === menu.path ? 'bold' : 'normal', 
                                }}
                            >
                                {menu.text}
                            </Typography>
                        }
                    />
                </ListItemButton>
            ))}
        </List>
    );
}
