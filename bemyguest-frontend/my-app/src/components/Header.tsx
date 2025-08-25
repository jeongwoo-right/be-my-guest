import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header-container">
      {/* 로고 */}
      <div className="logo">BeMyGuest</div>

      {/* 로그인 버튼 */}
      <button className="login-button">로그인</button>
    </header>
  );
};

export default Header;
