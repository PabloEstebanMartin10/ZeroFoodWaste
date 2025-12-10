import { createContext, useEffect, useState, type ReactNode } from "react";
import { useFetchUser } from "../hooks/useFetchUser/useFetchUser";
import type { userInfo } from "../types/user/userInfo";
import type { AuthContextType } from "../types/user/AuthContextType";


export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<userInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const {fetchUserFunction, error} = useFetchUser()

  useEffect(() => {
    const fetchUser = async (token: string)  =>{
      const userResult = await fetchUserFunction(token);
      if (!error){
        setUser(userResult);
        console.log(userResult);
      } else {
        console.log(error);
        setUser(null);
      } 
    }
    const tokenLocal = localStorage.getItem("token");
    if(tokenLocal){
      fetchUser(tokenLocal)
      setToken(tokenLocal)
    }else {
      setUser(null); 
    } 
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};