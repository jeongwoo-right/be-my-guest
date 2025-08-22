import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header-container">
      {/* 로고 */}
      <div className="logo">BeMyGuest</div>

      {/* 사용자 메뉴 */}
      <div className="user-menu">
        {/* <div className="avatar"></div> */}
        <button className="login-button">로그인</button>
        <div className="menu-icon">☰</div>
      </div>
    </header>
  );
};

export default Header;
