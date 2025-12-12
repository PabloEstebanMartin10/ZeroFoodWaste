import { useState, type ReactNode } from "react";
// import { useFetchUser } from "../hooks/useFetchUser/useFetchUser";
import type { userInfo } from "../types/user/userInfo";
import { AuthContext } from "./AuthContext";
import type { EstablishmentInfo } from "../types/establishment/EstablishmentInfo";
import type { FoodBankInfo } from "../types/foodbank/FoodBankInfo";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<userInfo | null>(JSON.parse(localStorage.getItem("user") ?? "null"));
  const [entity, setEntity] = useState<EstablishmentInfo | FoodBankInfo | null>(JSON.parse(localStorage.getItem("entity") ?? "null"));
  //const [entity, setEntity] = useState<userInfo | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // const {fetchUserFunction, error} = useFetchUser()

//  useEffect(() => {
    // const fetchUser = async (token: string)  =>{
    //   const userResult = await fetchUserFunction(token);
    //   console.log(error);
    //   if (!error){
    //     setUser(userResult);
    //     console.log(userResult);
    //   } else {
    //     console.log(error);
    //     setUser(null);
    //   } 
    // }
    //const tokenLocal = localStorage.getItem("token");
    //if(tokenLocal){
      // fetchUser(tokenLocal)
      //setToken(tokenLocal)
    //} else {
      //setUser(null); 
    //} 
 // }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, entity, setEntity }}>
      {children}
    </AuthContext.Provider>
  );
};