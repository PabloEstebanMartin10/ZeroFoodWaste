import type { EstablishmentInfo } from "../establishment/EstablishmentInfo";
import type { FoodBankInfo } from "../foodbank/FoodBankInfo";
import type { userInfo } from "./userInfo";

export interface AuthContextType {
  user: userInfo | null;
  entity: EstablishmentInfo | FoodBankInfo | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<userInfo | null>>;
  setEntity: React.Dispatch<React.SetStateAction<EstablishmentInfo | FoodBankInfo | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}