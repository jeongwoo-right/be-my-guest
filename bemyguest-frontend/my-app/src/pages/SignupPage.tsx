import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await axios.post("http://localhost:8080/api/user/signup", form);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      setError("회원가입 실패! 입력 내용을 확인해주세요.");
      console.error(err);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <h2>회원가입</h2>

      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              className="form-input"
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              className="form-input"
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              className="form-input"
              type="text"
              name="nickname"
              placeholder="닉네임을 입력하세요"
              value={form.nickname}
              onChange={handleChange}
              required
              maxLength={30}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호(선택)</label>
            <input
              id="phone"
              className="form-input"
              type="text"
              name="phone"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={handleChange}
              inputMode="tel"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">성별(선택)</label>
            <select
              id="gender"
              className="form-select"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="N">선택 안 함</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              회원가입
            </button>
          </div>

          {error && <p className="feedback error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
