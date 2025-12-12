import { useState } from "react";
import { zfwApiInstance } from "../../api/apiInstance";
import type { EstablishmentInfo } from "../../types/establishment/EstablishmentInfo";
import type { FoodBankInfo } from "../../types/foodbank/FoodBankInfo";

export const useFetchEntity = () => {
  const [entityError, setEntityError] = useState<string | null>(null);

  const fetchEntityFunction = async (url: string) : Promise<EstablishmentInfo | FoodBankInfo | null> => {
    setEntityError(null);
    try {
      const response = await zfwApiInstance.get<EstablishmentInfo | FoodBankInfo | null>(url);
      return response.data;
    } catch (e) {
      console.log(e);
      setEntityError("An error happened");
      return null;
    }
  };

  return { fetchEntityFunction, entityError };
};