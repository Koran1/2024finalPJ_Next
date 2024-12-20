import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { Avatar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";


const ChatBox = ({ room }) => {

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(`http://localhost:8081?room=${room}`);
    socketRef.current.connect();
    socketRef.current.on("receive_message", (data) => {
      console.log(data);
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [room]);

  // 채팅 파트
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const input = { message: message, room: room };
    socketRef.current.emit("send_message", input);
    setMessage("");
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "60vh",
        border: "1px solid black",
        borderRadius: "14px",


      }}
      className="for-dark-chat-box"
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid black",
          p: "15px",
        }}
        className="for-dark-chat-header"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Avatar src="/images/tree-2.jpg" />
          <Box className="ml-1" style={{ marginLeft: "10px" }}>
            <Typography as="h5" fontWeight="500">
              User Name
            </Typography>
            <Typography fontSize="12px" position="relative">
              <span className="active-status2 successBgColor"></span> Active Status
            </Typography>
          </Box>
        </Box>

        <Box>
          <IconButton
            size="small"
            sx={{ background: "#F2F6F8" }}
            className="ml-5px for-dark-button"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Chat List */}
      <Box
        sx={{
          flex: "1",
          overflowY: "auto",
          padding: "15px",
          display: "flex",
          flexDirection: "column-reverse",
        }}
        className="chat-list-box"
      >
        {/* Left Chat */}
        <Box
          sx={{
            display: "flex",
            maxWidth: "730px",
            mb: "20px",
          }}
        >
          <Avatar src="/images/tree-2.jpg" />
          <Box
            sx={{
              display: "flex",
              ml: "10px",
            }}
            className="ml-1"
          >
            <Box>
              <Typography
                sx={{
                  background: "#F5F6FA",
                  borderRadius: "0px 15px 15px 15px",
                  p: "14px 20px",
                  mb: "10px",
                }}
                className="dark-BG-101010"
              >
                Chatting Contents from Left Side
              </Typography>

              <Typography fontSize="12px">19:10  more recent timeline1</Typography>
            </Box>

            {/* Replay Dropdown */}
            <Box className="ml-1">
              <div className="right-replay-box">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>

                <div className="hover-caption">
                  <List sx={{ display: "inline" }}>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ padding: "1px 15px" }}>
                        <DeleteOutlineIcon
                          fontSize="small"
                          sx={{ mt: "-4px" }}
                          className="mr-5px"
                        />
                        <ListItemText
                          primary="Delete"
                          primaryTypographyProps={{ fontSize: "12px" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </div>
              </div>
            </Box>
          </Box>
        </Box>

        {/* Right Chat */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            maxWidth: "730px",
            mb: "20px",
          }}
          className="ml-auto"
        >
          <Box
            sx={{
              display: "flex",
            }}
            className="ml-1"
          >
            {/* Replay Dropdown */}
            <Box>
              <div className="left-replay-box">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>

                <div className="hover-caption">
                  <List sx={{ display: "inline" }}>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ padding: "1px 15px" }}>
                        <DeleteOutlineIcon
                          fontSize="small"
                          sx={{ mt: "-4px" }}
                          className="mr-5px"
                        />
                        <ListItemText
                          primary="Delete"
                          primaryTypographyProps={{ fontSize: "12px" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </div>
              </div>
            </Box>

            <Box className="mr-1" style={{ marginRight: "10px" }}>
              <Typography
                sx={{
                  background: "#757FEF",
                  color: "#fff !important",
                  borderRadius: "15px 0 15px 15px",
                  p: "14px 20px",
                  mb: "10px",
                }}
              >
                Chatting Contents from Right Side
              </Typography>

              <Typography fontSize="12px" textAlign="end">
                19:04 timeline2
              </Typography>
            </Box>
          </Box>
          <Avatar src="/images/tree-4.jpg" />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: "#F5F6FA",
          borderRadius: "15px",
          display: "flex",
          alignItems: "space-around",
          p: "15px",
          position: "relative",
        }}
        className="dark-BG-101010"
      >
        <Box
          sx={{
            flex: "auto",
          }}
          className="pr-60px"
        >
          <TextField
            id="typeSomething"
            label="Type Something..."
            name="message"
            style={{
              background: "#fff",
              width: "80%",
              marginRight: "7%",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "capitalize",
              borderRadius: "100%",
              fontWeight: "500",
              fontSize: "16px",
              padding: "0",
              minWidth: "44px",
              minHeight: "44px",
              position: "absolute",
              top: "22px",
              color: "#fff !important"
            }}
            className="right-20px"
            onClick={sendMessage}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBox;
