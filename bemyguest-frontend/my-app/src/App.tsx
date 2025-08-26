import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GuesthouseDetail from "./pages/GuesthouseDetail";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GuesthouseListPage from "./pages/GuesthouseListPage";
import MyPage from "./pages/MyPage/MyPage";
import Header from "./components/Header";
import { Button } from "./components/ui/button";
import "./index.css";

import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* ✅ 메인(루트)에서 SearchPage 보여주기 */}
        <Route path="/" element={<SearchPage />} />

        {/* 상세 페이지 */}
        <Route path="/guesthouses/:id" element={<GuesthouseDetail />} />
        {/* 루트로 오면 샘플 id로 리다이렉트 */}
        <Route
          path="/"
          element={<Navigate to="/guesthouses/search" replace />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* ✅ 검색 결과(목록) 페이지: SearchPage에서 여기로 이동 */}
        <Route path="/guesthouses/search" element={<GuesthouseListPage />} />

        {/* 그 외 경로는 루트로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
