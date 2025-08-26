import api from "./api";

/* 로그인 서비스 */

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest) => {
  const response = await api.post("/user/login", data);
  console.log(response);
  return response.data.accessToken;
};
