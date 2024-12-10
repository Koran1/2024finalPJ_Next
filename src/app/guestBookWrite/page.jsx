"use client"

import { TextField, Button } from "@mui/material";
import useAuthStore from "../../../store/authStore";
import axios from "axios";
import { useState } from "react";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    gb_name: "",
    gb_subject: "",
    gb_content: "",
    gb_email: "",
    gb_pw: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev, file: e.target.files[0]
    }));
  };

  // 저장은 post 방식, FormData를 쓴다
  // async await 가 비동기 처리가 가능하다
  const handleSubmit = async () => {
    const API_URL = `${LOCAL_API_BASE_URL}/guestbook/write`;
    const data = new FormData();
    data.append("gb_name", formData.gb_name);
    data.append("gb_subject", formData.gb_subject);
    data.append("gb_content", formData.gb_content);
    data.append("gb_email", formData.gb_email);
    data.append("gb_pw", formData.gb_pwd);
    // data.append("file", formData.file);
    if (formData.file) {
      data.append("file", formData.file);
    }
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,

        },
      });
      if (response.data.success) {
        alert(response.data.message);
        router.push("/guestBookList");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };



  // 로그인 상태이고, 빈칸이 없으면 저장 버튼 활성화
  const isFormValid =
    isAuthenticated &&
    formData.gb_name.trim() !== "" &&
    formData.gb_subject.trim() !== "" &&
    formData.gb_pw.trim() !== "" &&
    formData.gb_content.trim() !== "" &&
    formData.gb_email.trim() !== "";

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>GuestBookWrite</h2>
      <TextField
        label="NAME"
        name="gb_name"
        value={formData.gb_name}
        onChange={handleChange}
        fullWidth
        margin="dense" />
      <TextField
        label="SUBJECT"
        name="gb_subject"
        value={formData.gb_subject}
        onChange={handleChange}
        fullWidth
        margin="dense" />

      <SimpleMDE
        value={formData.gb_content}
        onChange={(value) => setFormData({
          ...formData, gb_content: value
        })}
      />

      <TextField
        label="PASSWORD"
        name="gb_pw"
        value={formData.gb_pw}
        onChange={handleChange}
        fullWidth
        margin="dense" />
      <TextField
        label="EMAIL"
        name="gb_email"
        value={formData.gb_email}
        onChange={handleChange}
        fullWidth
        margin="dense" />

      <input type="file" name="file" onChange={handleFileChange} />
      <Button variant="contained" color="success" onClick={handleSubmit} style={{ marginTop: "20px" }} disabled={!isFormValid}>저장</Button>
    </div>
  )
}