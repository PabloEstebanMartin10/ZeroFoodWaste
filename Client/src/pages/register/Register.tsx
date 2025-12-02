import { useState } from "react";
import FormComercio from "./FormComercio";
import FormBancoAlimentos from "./FormBancoAlimentos";

type TipoRegistro = "comercio" | "banco" | null;

export default function Registro() {
  const [tipo, setTipo] = useState<TipoRegistro>(null);

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md max-w-2xl w-full p-8">
        {/* Título + Botones alineados */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <h1 className="text-3xl font-bold text-green-900">Registro</h1>

          <div className="flex gap-6">
            <button
              onClick={() => setTipo("comercio")}
              className={`w-40 px-6 py-3 rounded-md font-semibold transition-colors border-2 ${
                tipo === "comercio"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-100"
              }`}
            >
              Comercio
            </button>

            <button
              onClick={() => setTipo("banco")}
              className={`w-30 px-6 py-3 rounded-md font-semibold transition-colors border-2 ${
                tipo === "banco"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-600 border-green-600 hover:bg-green-100"
              }`}
            >
              Banco de Alimentos
            </button>
          </div>
        </div>

        {/* Contenido dinámico */}
        <div>
          {tipo === "comercio" && <FormComercio />}
          {tipo === "banco" && <FormBancoAlimentos />}
          {tipo === null && (
            <p className="text-center text-gray-500">
              Por favor, selecciona un tipo de registro.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
