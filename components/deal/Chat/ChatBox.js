import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { Avatar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../../../store/authStore";
import { useRouter } from "next/navigation";
import './chat.css';
import axios from "axios";
import Link from "next/link";
import ReportModal from "@/app/deal/detail/[dealIdx]/report/page";
import SatisfactionModal from "@/app/deal/detail/[dealIdx]/satisfaction/page";

const ChatBox = ({ room, senderIdx, senderNick, dealIdx }) => {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const socketRef = useRef();
  const router = useRouter();
  const { user, token, isExpired, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [img, setImg] = useState("");

  useEffect(() => {
    if (!user || !token) {
      console.warn("User or token is not available yet.");
      return;
    }

    setLoading(true);

    if (isExpired() || !isAuthenticated) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/user/login");
      return;
    }

    const userIdx = user.userIdx;
    socketRef.current = io(`http://localhost:8081`, {
      query: { room, token, userIdx },
      reconnection: true,
      reconnectionDelay: 1000, // 1 second
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

  // deal 정보 가져오기
  useEffect(() => {
    if (!dealIdx) return;
    axios.get(`${LOCAL_API_BASE_URL}/deal/detail/${dealIdx}`)
      .then((res) => {
        console.log(res.data.data);
        setProduct(res.data.data.deal);
        setImg(res.data.data.files[0].fileName)
      })
      .catch((err) => console.log(err));

    checkSatisfactionRating();
  }, [dealIdx]);

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

  // 채팅 신고
  const handleReportChat = () => {
    alert("신고하기")
  }

  // 판매 완료
  const handleSold = () => {
    if (confirm("정말 판매 완료 처리하시겠습니까?")) {
      const formData = new FormData();
      formData.append("dealIdx", dealIdx);
      formData.append("senderIdx", senderIdx);
      formData.append("senderNick", senderNick);

      axios.put(`${LOCAL_API_BASE_URL}/deal/status`, formData)
        .then((res) => {
          console.log(res.data)
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }

  const [hasSatisfactionRating, setHasSatisfactionRating] = useState(false);
  const [isSatisfactionModalOpen, setIsSatisfactionModalOpen] = useState(false);

  // 만족도 등록 여부 확인 함수
  const checkSatisfactionRating = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/check-satisfaction/${dealIdx}`, {
        params: {
          userIdx: user?.userIdx
        }
      });
      setHasSatisfactionRating(response.data.exists);
    } catch (error) {
      console.error('만족도 확인 실패:', error);
    }
  };

  // 만족도 모달 닫힐 때 만족도 상태 다시 확인
  const handleSatisfactionModalClose = () => {
    setIsSatisfactionModalOpen(false);
    checkSatisfactionRating(); // 모달이 닫힐 때 만족도 등록 여부 다시 확인
  };

  // 후기 작성
  const handleSatisfaction = () => {
    alert("후기 작성")

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
        {/* 상품 정보 표기 */}
        <Box
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href={`/deal/detail/${dealIdx}`}>
            <img src={`${LOCAL_IMG_URL}/deal/${img}` || "default-product-image.jpg"} alt="product"
              width="80px" height="80px" />
          </Link>
          <Box className="ml-1" style={{ marginLeft: "10px" }} justifyContent="space-between">
            <Typography as="h5" fontWeight="500">
              상품명 : {product.dealTitle}
            </Typography>
            <Typography fontSize="12px" position="relative">
              <span className="active-status2 successBgColor"></span>
              등록일 : {product.dealRegDate}
            </Typography>
            {product.deal02 ?
              <>
                <Box>
                  {product.deal02}
                </Box>
                {
                  user.nickname != product.dealSellerNick &&
                  <Button
                    variant="contained"
                    color="success"
                    className="satisfaction-button"
                    onClick={() => setIsSatisfactionModalOpen(true)}
                    disabled={hasSatisfactionRating} // 만족도 등록 여부에 따라 버튼 비활성화
                  >
                    {hasSatisfactionRating ? '후기 등록 완료' : '후기 등록하기'}
                  </Button>
                }
              </>
              :
              <>
                <Button variant="outlined" onClick={handleSold}>판매중</Button>
              </>
            }

          </Box>
        </Box>

        <Box className="ml-1">
          <div className="right-replay-box">
            <IconButton size="small">
              <MoreVertIcon sx={{ fontSize: "28px" }} />
            </IconButton>

            <div className="hover-caption">
              <List sx={{ display: "inline" }}>
                <ListItem disablePadding>
                  <ListItemButton sx={{ padding: "1px 15px" }} onClick={handleReportChat}>
                    <img src="/siren-siren-svgrepo-com.svg"
                      width="20px" height="20px" style={{ marginTop: "-4px" }} />
                    <ListItemText
                      primary="&nbsp;신고하기"
                      sx={{ whiteSpace: 'nowrap' }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </div>
          </div>
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
      {/* <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        dealTitle={item.dealTitle}
        sellerNick={item.dealSellerNick}
      /> */}
      <SatisfactionModal
        isOpen={isSatisfactionModalOpen}
        onClose={handleSatisfactionModalClose}
        dealIdx={dealIdx}
      />
    </Box >
  );
};

export default ChatBox;
