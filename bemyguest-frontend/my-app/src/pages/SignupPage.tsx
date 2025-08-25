import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* 회원가입 페이지 */

interface SignupForm {
  email: string;
  password: string;
  nickname: string;
  phone?: string;
  gender: "M" | "F" | "N";
}

const SignupPage: React.FC = () => {
  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    nickname: "",
    phone: "",
    gender: "N", // 기본값: 선택 안함
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/user/signup", form);
      alert("회원가입 성공!");
      navigate('/');
      
    } catch (error) {
      alert("회원가입 실패!");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={form.nickname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="전화번호(선택)"
          value={form.phone}
          onChange={handleChange}
        />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="N">선택 안함</option>
          <option value="M">남성</option>
          <option value="F">여성</option>
        </select>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;
