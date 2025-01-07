'use client'
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

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
                    <Link href="/admin/main/">
                        Admin Page
                    </Link>
                </ListSubheader>
            }
        >
            {[
                { path: '/admin/userList', text: '회원정보관리' },
                { path: '/admin/userReport', text: '신고내역관리' },
                { path: '/admin/campList', text: '캠핑정보관리' },
                { path: '/admin/campLogList', text: '캠핑로그관리' },
                { path: '/admin/dealList', text: '캠핑마켓관리' },
                { path: '/admin/noticeList', text: '공지사항관리' },
                { path: '/admin/faqList', text: 'FAQ관리' },
                { path: '/admin/qnaList', text: 'QNA관리' },
                { path: '/admin/weather', text: '날씨정보관리' },
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
                        <ManageAccountsIcon sx={{ color: pathname === menu.path ? '#1976D2' : 'inherit' }} />
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
