import type { loginData } from './../../types/user/loginData';
import { useState } from "react";
import { zfwApiInstance } from "../../api/apiInstance";
// import { useNavigate } from "react-router-dom";
// import type { userInfo } from "../../types/user/userInfo";

const URL = "/auth/login"

interface LoginResponse {
  token: string;
}

export const useLogin = () => {
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginFunction = async (loginData: loginData) => {
    setLoginError(null);
    try {
      const response = await zfwApiInstance.post<LoginResponse>(URL, loginData);
      return response.data.token;
    } catch {
      setLoginError("An error happened");
      return null;
    }
  };

  return { loginFunction, loginError };
};