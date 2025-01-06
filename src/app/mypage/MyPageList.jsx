'use client'
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import { useState } from "react";
import CommentIcon from '@mui/icons-material/Comment';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useRouter } from "next/navigation";
import './mypage.css'
import Link from "next/link";

export default function MyPageList() {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List
            sx={{ width: '100%', minWidth: 240, maxWidth: 360, bgcolor: 'background.paper', borderRight: '1px solid black' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader" sx={{ fontSize: '20px', borderBottom: '1px solid lightgray', fontWeight: 'bold' }}>
                    <Link href="/mypage">
                        <div className="mypage-title">
                            마이 페이지
                        </div>
                    </Link>
                </ListSubheader>
            }

        >
            <ListItemButton onClick={() => router.push('/mypage/mycomments')}>
                <ListItemIcon>
                    <CommentIcon />
                </ListItemIcon>
                <ListItemText className="mypage-menu-1" primary="나의 댓글관리" />
            </ListItemButton>

            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <PersonSearchIcon />
                </ListItemIcon>
                <ListItemText primary="회원정보" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4, backgroundColor: '#fafafa' }} onClick={() => router.push('/mypage/changeUserInfo')}>
                        <ListItemIcon>
                            <ManageAccountsIcon />
                        </ListItemIcon>
                        <ListItemText primary="회원정보 수정" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4, backgroundColor: '#fafafa' }} onClick={() => router.push('/mypage/changePw')}>
                        <ListItemIcon>
                            <LockOpenIcon />
                        </ListItemIcon>
                        <ListItemText primary="비밀번호 변경" />
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={() => router.push('/mypage/qna')}>
                <ListItemIcon>
                    <LiveHelpIcon />
                </ListItemIcon>
                <ListItemText primary="나의 질문" />
            </ListItemButton>
        </List>
    );
}