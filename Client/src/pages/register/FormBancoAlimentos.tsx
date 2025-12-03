import { useState } from "react";

interface BancoFormData {
  nombreOrganizacion: string;
  telefono: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default function FormBancoAlimentos() {
  const [formData, setFormData] = useState<BancoFormData>({
    nombreOrganizacion: "",
    telefono: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos Banco de Alimentos:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 rounded-3xl p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-10 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-4 text-green-800 text-center">
          Registro Banco de Alimentos
        </h2>
        <p className="text-green-700 mb-8 text-center">
          Únete a nuestra red y recibe donativos de excedentes de comida
        </p>

        {/* Campos verticales */}
        <div className="mb-5">
          <label className="block mb-3">
            <span className="text-green-800 font-medium">
              Nombre de la organización
            </span>
            <input
              type="text"
              name="nombreOrganizacion"
              placeholder="Nombre de la organización"
              value={formData.nombreOrganizacion}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 transition-colors"
            />
          </label>

          <label className="block">
            <span className="text-green-800 font-medium">Teléfono</span>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 transition-colors"
            />
          </label>
        </div>

        {/* Campos horizontales: Email y Contraseñas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <label className="block col-span-2">
            <span className="text-green-800 font-medium">Email</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 transition-colors"
            />
          </label>
        </div>

        {/* Contraseñas en la misma fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <label className="block">
            <span className="text-green-800 font-medium">Contraseña</span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 transition-colors"
            />
          </label>

          <label className="block">
            <span className="text-green-800 font-medium">
              Repite Contraseña
            </span>
            <input
              type="password"
              name="repeatPassword"
              placeholder="Repite Contraseña"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 transition-colors"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors shadow-md"
        >
          Registrarse
        </button>

        <p className="text-green-700 mt-4 text-center text-sm">
          Tu labor ayudará a que la comida llegue a quienes más la necesitan.
        </p>
      </form>
    </div>
  );
}
