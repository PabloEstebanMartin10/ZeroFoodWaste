import type { NewUserData } from '../../types/user/NewUserData';
import { useState } from "react";
import { zfwApiInstance } from "../../api/apiInstance";
import type { userInfo } from '../../types/user/userInfo';
import axios from 'axios';

const URL = "/User"

export const useRegister = () => {
  const [registerError, setRegisterError] = useState<string | null>(null);

  const registerFunction = async (registerFormData: NewUserData) => {
    setRegisterError(null);
    try {
      const response = await zfwApiInstance.post<userInfo>(URL, registerFormData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409){
          setRegisterError("Este email ya esta registrado");
        }
      } else {
        setRegisterError("Unexpected error");
      }
      return null;
    }
  };

  return { registerFunction, registerError };
};