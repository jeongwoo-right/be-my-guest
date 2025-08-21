import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GuesthouseDetail from "./pages/GuesthouseDetail";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /guesthouses/20 같은 경로에서 상세 페이지 */}
        <Route path="/guesthouses/:id" element={<GuesthouseDetail />} />
        {/* 루트로 오면 샘플 id로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/guesthouses/20" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
