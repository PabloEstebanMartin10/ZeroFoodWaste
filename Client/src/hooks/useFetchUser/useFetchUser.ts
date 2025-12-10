import { useState } from "react";
import { zfwApiInstance } from "../../api/apiInstance";
import { useNavigate } from "react-router-dom";
import type { userInfo } from "../../types/user/userInfo";

const URL = "/User"

export const useFetchUser = () => {
  const [error, setError] = useState<string | null>(null);

  const fetchUserFunction = async (token?: string) : Promise<userInfo | null> => {
    setError(null);
    try {
      const response = await zfwApiInstance.get<userInfo>(`${URL}?token=${token}`);
      return response.data;
    } catch {
      setError("An error happened");
      return null;
    }
  };

  return { fetchUserFunction, error };
};