import React, { useState } from "react";
import LogoFull from "../../assets/logos/Logo_ZeroFoodWasteTransparent.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Intentando iniciar sesión con correo electrónico: ${email}`);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-amber-50 p-6">
      <div className="flex gap-20 items-center max-w-4xl mx-auto h-full">
        {/* Columna izquierda */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <img
            src={LogoFull}
            alt="Logo"
            className="w-[90%] h-auto object-contain"
          />
        </div>

        {/* Columna derecha - Login */}
        <div className="w-1/2 bg-white rounded-2xl shadow-md p-10 ">
          <h1 className="text-3xl mb-6 font-semibold text-green-800 text-center">
            Bienvenido
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-green-800 font-medium mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] focus:ring-2 focus:ring-[#8FC0A9] focus:outline-none placeholder-gray-300"
              />
            </div>

            <div className="text-left">
              <label className="block text-green-800 font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] focus:ring-2 focus:ring-[#8FC0A9] focus:outline-none placeholder-gray-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 hover:bg-green-700 text-white rounded-lg text-lg font-medium bg-green-800 transition-all shadow-md hover:shadow-lg"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            <a href="#" className="text-green-800 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
            <p className="mt-2">
              ¿No tienes cuenta?{" "}
              <a
                href="#"
                className="text-green-800 hover:underline font-medium"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
