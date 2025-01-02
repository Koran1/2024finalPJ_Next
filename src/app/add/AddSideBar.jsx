import { FlagCircle, HelpOutline } from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

export const AddSideBar = () => {
    return (
        <>
            <List>
                <ListItem component="a" href="/add/notice">
                    <ListItemIcon>
                        <FlagCircle />
                    </ListItemIcon>
                    <ListItemText primary="공지사항" />
                </ListItem>
                <ListItem component="a" href="/add/faq">
                    <ListItemIcon>
                        <HelpOutline />
                    </ListItemIcon>
                    <ListItemText primary="FAQ" />
                </ListItem>
            </List >
        </>
    )
}