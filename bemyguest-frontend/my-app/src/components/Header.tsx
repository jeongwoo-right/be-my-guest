import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';


const Header: React.FC = () => {
  const navigate = useNavigate();
  
  // 401 알림 중복 방지 ref (컴포넌트 내부)
  const shown401Ref = useRef(false);

  // token을 state로 관리 (localStorage 초기값 반영)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [nickname, setNickname] = useState<string | null>(null);
  const isLoggedIn = !!token;

  // 같은 탭에서의 토큰 변경도 감지 (커스텀 이벤트)
  useEffect(() => {
    const onTokenChanged = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('token-changed', onTokenChanged as EventListener);


    // 다른 탭/창에서의 변경 감지 (storage 이벤트)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') setToken(e.newValue);
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('token-changed', onTokenChanged as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);


  // 토큰 변경 시 내 정보 갱신
  useEffect(() => {
    const fetchUserInfo = async () => {
      // if (!token) {
      //   setNickname(null);
      //   alert("token 정보가 없습니다." + token);
      //   return;
      // }

      try {
        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          if (!shown401Ref.current) {
            shown401Ref.current = true;
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        }
          // 만료 처리: localStorage + state 동시 갱신
          localStorage.removeItem("token");
          setToken(null);
          setNickname(null);
          return;
        }

        shown401Ref.current = false;


        if (!res.ok) throw new Error("사용자 정보 불러오기 실패");

        const data = await res.json();
        setNickname(data?.nickname ?? null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserInfo();
  }, [token, location.pathname]);

  const goLogin = () => navigate('/login');
  const goSignup = () => navigate('/signup');
  const goMypage = () => navigate('/mypage');
  const goToMainPage = () => navigate('/');

  const handleLogout = () => {
    // 로그아웃 시 즉시 반영
    localStorage.removeItem("token");
    setToken(null);
    setNickname(null);
    alert("로그아웃 되었습니다.");
    navigate('/');
  };

  return (
    <header className="header-container">
      {/* 로고 */}
      <div className="logo" onClick={goToMainPage}>BeMyGuest</div>

      {/* 로그인 여부에 따라, 로그인/로그아웃 버튼 */}
      {isLoggedIn ? (
        <div className='user-header-right'>
          <span>{nickname ? `${nickname} 님` : ''}</span>
          <button className="auth-button" onClick={goMypage}>마이페이지</button>
          <button className="auth-button" onClick={handleLogout}>로그아웃</button>
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
