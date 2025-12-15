import type { loginData } from './../../types/user/loginData';
import { useState } from "react";
import { zfwApiInstance } from "../../api/apiInstance";
import axios from 'axios';
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.status === 404){
          setLoginError("Credenciales incorrectas");
        }
      } else {
        setLoginError("Unexpected error");
      }
      return null;
    }
  };

  return { loginFunction, loginError };
};