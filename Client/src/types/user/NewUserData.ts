export type TipoRegistro = "comercio" | "banco";


export interface NewUserData {
  // User data
  email: string;
  password: string;
  role: "Establishment" | "FoodBank";

  // Establishment data
  establishmentName?: string;
  establishmentAddress?: string;
  establishmentContactPhone?: string;
  description?: string;

  // Food bank data
  foodBankName?: string;
  foodBankAddress?: string;
  foodBankContactPhone?: string;
}