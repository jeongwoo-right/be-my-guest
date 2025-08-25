import React, { useEffect, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  // Initialize from localStorage so it persists across reloads
  const [nickname, setNickname] = useState<string | null>(() => localStorage.getItem('nickname'));

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    // If there’s no token, clear nickname and stop
    if (!token) {
      setNickname(null);
      localStorage.removeItem('nickname');
      return;
    }

    let ignore = false;

    const fetchUserInfo = async () => {
      try {
        // Important: absolute path so it works from any route
        const res = await fetch('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load user info');

        const data = await res.json();
        if (!ignore) {
          const nextNickname = data?.nickname ?? null;
          setNickname(nextNickname);
          if (nextNickname) {
            localStorage.setItem('nickname', nextNickname);
          } else {
            localStorage.removeItem('nickname');
          }
        }
      } catch (err) {
        console.error(err);
        // Optionally handle 401 here (e.g., remove token, redirect)
      }
    };

    fetchUserInfo();
    return () => {
      ignore = true;
    };
  }, [token]);

  const goLogin = () => navigate('/login');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname'); // keep things in sync
    alert('You have been logged out.');
    navigate('/login');
  };

  const goToMainPage = () => navigate('/');

  return (
    <header className="header-container">
      {/* Logo */}
      <div className="logo" onClick={goToMainPage}>BeMyGuest</div>

      {/* Auth section */}
      {isLoggedIn ? (
        <div>
          <span>{nickname ? `${nickname} 님` : '…'}</span>
          <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <button className="login-button" onClick={goLogin}>로그인</button>
      )}
    </header>
  );
};

export default Header;
