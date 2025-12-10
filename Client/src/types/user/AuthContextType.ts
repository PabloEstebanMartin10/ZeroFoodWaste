import type { userInfo } from "./userInfo";

export interface AuthContextType {
  user: userInfo | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<userInfo | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}