import type { loginData } from './../../types/user/loginData';
import { useState } from "react";
import { zfwApiInstance } from "../../api/apiInstance";
import { useNavigate } from "react-router-dom";
import type { userInfo } from "../../types/user/userInfo";

const URL = "/auth/login"

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const loginFunction = async (loginData: loginData) => {
    setError(null);
    try {
      const response = await zfwApiInstance.post<userInfo>(URL, loginData);
      return response.data;
    } catch {
      setError("An error happened");
      return null;
    }
  };

  return { loginFunction, error };
};