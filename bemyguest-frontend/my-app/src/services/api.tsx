import axios from "axios";

export const BACKEND_URL = 'http://localhost:8080';

/* Axios 인스턴스 설정 */
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Spring Boot 백엔드 주소
  headers: {
    "Content-Type": "application/json",
  },
});

/* 로그인 후 요청에 토큰 자동 추가 (인터셉터) */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;