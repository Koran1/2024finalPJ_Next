import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
export const AddSideBar = () => {
    return (
        <>
                <List>
                    <ListItem component="a" href="/add/notice">
                        <ListItemIcon>
                            <AnnouncementIcon />
                        </ListItemIcon>
                        <ListItemText secondary="공지사항" />
                    </ListItem>
                    <ListItem component="a" href="/add/faq">
                        <ListItemIcon>
                            <QuestionAnswerIcon />
                        </ListItemIcon>
                        <ListItemText secondary="FAQ" />
                    </ListItem>
                </List >
        </>
    )
}