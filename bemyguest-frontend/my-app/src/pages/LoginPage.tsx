import React, { useState } from "react";
import { login } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

/* 로그인 페이지 컴포넌트 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login({ email, password });
      localStorage.setItem("token", token); // JWT 저장
      alert("로그인 성공!");
      navigate("/");
    } catch {
      setError("로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="auth-page">
      <h2>로그인</h2>

      <div className="auth-card">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              로그인
            </button>
            <button type="button" className="secondary-button" onClick={goToSignup}>
              회원가입
            </button>
          </div>

          {error && <p className="feedback error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
