import React, { useEffect, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string | null>(null);

  const token = localStorage.getItem("token"); // 로그인 상태 여부 확인
  const isLoggedIn = !!token;                  // boolean type으로 변환


  useEffect(() => {
    const fetchUserInfo = async () => {
      if(!token) return;

      try {
        const res = await fetch("api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("사용자 정보 불러오기 실패");

        const data = await res.json();

        setNickname(data.nickname);

      } catch(err) {
        console.log(err);
      }
    };


    // 함수 실행
    fetchUserInfo(); 
  }, [token]);


  const goLogin = () => {
    navigate('/login'); 
  }

  const goSignup = () => {
    navigate('/signup');
  }

  const goMypage = () => {
    navigate('/mypage');
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그아웃 되었습니다.");
    navigate('/');
  }

  const goToMainPage = () => {
    navigate('/');
  }


  return (
    <header className="header-container">
      {/* 로고 */}
      <div className="logo" onClick = {goToMainPage}>BeMyGuest</div>

      {/* 로그인 여부에 따라, 로그인/로그아웃 버튼 */}
      {isLoggedIn ? (
      <div>
        <div className='user-header-right'>
          <span>{nickname} 님</span>
          <button className="auth-button" onClick={goMypage}>마이페이지</button>
          <button className="auth-button" onClick={handleLogout}>로그아웃</button>
        </div>
      </div>  
      ) : (
        <div className='auth-buttons'>
          <button className="auth-button" onClick={goLogin}>로그인</button>
          <button className="auth-button" onClick={goSignup}>회원가입</button>
        </div>
      )}
    </header>
  );
};

export default Header;
