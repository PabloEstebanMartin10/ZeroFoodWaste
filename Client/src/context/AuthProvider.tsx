import { createContext, useEffect, useState, type ReactNode } from "react";

export interface AuthContextType {
  user: any;
  login: (data: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>();


  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored){
      setUser(JSON.parse(stored));
    } 
  }, []);

  const login = (data: any) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};