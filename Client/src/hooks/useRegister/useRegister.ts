import type { NewUserData } from '../../types/user/NewUserData';
import { useState } from "react";
import { zfwApiInstance } from "../../api/apiInstance";
import type { userInfo } from '../../types/user/userInfo';

const URL = "/User"

export const useRegister = () => {
  const [registerError, setRegisterError] = useState<string | null>(null);

  const registerFunction = async (registerFormData: NewUserData) => {
    setRegisterError(null);
    try {
      const response = await zfwApiInstance.post<userInfo>(URL, registerFormData);
      return response.data;
    } catch {
      setRegisterError("An error happened");
      return null;
    }
  };

  return { registerFunction, registerError };
};