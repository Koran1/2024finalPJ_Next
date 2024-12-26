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
import useAuthStore from "../../../store/authStore";
import { useRouter } from "next/navigation";


const ChatBox = ({ room }) => {

  const socketRef = useRef();
  const router = useRouter();
  const { user, token, isExpired, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      console.warn("User or token is not available yet.");
      return;
    }

    setLoading(true);

    // if (isExpired() || !isAuthenticated) {
    //   alert("로그인이 필요한 서비스입니다.");
    //   router.push("/user/login");
    // }

    const userIdx = user.userIdx;
    socketRef.current = socketRef.current = io(`http://localhost:8081`, {
      query: { room, token, userIdx },
    })

    socketRef.current.connect();
    socketRef.current.on("receive_message", (data) => {
      console.log(data);
      setChat((prevChat) => [...prevChat, data]);
      setLoading(false)
    });

    socketRef.current.on('chatList', (chatList) => {
      console.log(chatList)
      setChat(chatList);
      setLoading(false)
    });

    return () => {
      socketRef.current.disconnect();

    };
  }, [room, user, token]);

  // 채팅 파트
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const input = { chatRoom: room, chatSenderIdx: user.userIdx, chatMessage: message };
    if (chat.length === 0) {
      socketRef.current.emit("first_message", input);
    } else {
      socketRef.current.emit("send_message", input);
    }
    setMessage("");
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        height: "80vh",
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
          p: "15px"
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
              <span className="active-status2 successBgColor"></span> Maybe 평점
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
          overflowY: "scroll",
          padding: "15px",
          display: "flex",
          flexDirection: "column-reverse",
        }}
        className="chat-list-box"
      >
        {chat.slice().reverse().map((chat) => {
          if (chat.chatSenderIdx === user.userIdx) {
            // Right Chat
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  maxWidth: "730px",
                  mb: "20px",
                  boxSizing: "border-box",
                  marginLeft: "auto"
                }}
                className="ml-auto"
                key={chat.chatTime}
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
                      {chat.chatMessage}
                    </Typography>

                    <Typography fontSize="12px" textAlign="end">
                      {chat.chatTime}
                    </Typography>
                  </Box>
                </Box>
                <Avatar src="/images/tree-4.jpg" />
              </Box>
            );
          } else {
            // Left Chat
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: 'flex-start',
                  maxWidth: "730px",
                  mb: "20px",
                }}
                key={chat.chatTime}
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
                      {chat.chatMessage}
                    </Typography>

                    <Typography fontSize="12px">{chat.chatTime}</Typography>
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
            );
          }
        })}
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
            flex: "auto"
          }}
          className="pr-60px"
        >
          <TextField
            id="typeSomething"
            label="Type Something..."
            name="message"
            style={{
              background: "#fff",
              width: "90%",
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
              right: "2%",
              color: "#fff !important",
            }}
            className="right-20px"
            onClick={sendMessage}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box >
  );
};

export default ChatBox;
