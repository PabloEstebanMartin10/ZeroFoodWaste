import { useState } from "react";

interface ComercioFormData {
  nombre: string;
  direccion: string;
  telefono: string;
  cif: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default function FormComercio() {
  const [formData, setFormData] = useState<ComercioFormData>({
    nombre: "",
    direccion: "",
    telefono: "",
    cif: "",
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
    console.log("Datos Comercio:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 rounded-3xl p-6">
      <form
        className="bg-white shadow-md rounded-3xl p-10 w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-4 text-green-800 text-center">
          Regístrate
        </h2>
        <p className="text-green-700 mb-8 text-center">Registra tu comercio</p>

        {/* Nombre */}
        <label className="block mb-5">
          <span className="text-green-800 font-medium">
            Nombre del comercio
          </span>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del comercio"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 transition-colors"
          />
        </label>

        {/* Dirección */}
        <label className="block mb-5">
          <span className="text-green-800 font-medium">Dirección</span>
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 transition-colors"
          />
        </label>

        {/* Teléfono + CIF */}
        <div className="flex gap-4 mb-5">
          <label className="block w-1/2">
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

          <label className="block w-1/2">
            <span className="text-green-800 font-medium">CIF / NIF</span>
            <input
              type="text"
              name="cif"
              placeholder="CIF / NIF"
              value={formData.cif}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 transition-colors"
            />
          </label>
        </div>

        {/* Email */}
        <label className="block mb-5">
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

        {/* Contraseña + Repite */}
        <div className="flex gap-4 mb-5">
          <label className="block w-1/2">
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

          <label className="block w-1/2">
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
          Tu contribución ayudará a que la comida llegue a quienes más la
          necesitan.
        </p>
      </form>
    </div>
  );
}
