import React, { useContext, useState } from "react";
import LogoFull from "../../assets/logos/Logo_ZeroFoodWasteTransparent.png";
import type { loginData } from "../../types/user/loginData";
import { useLogin } from "../../hooks/useLogin/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUser } from "../../hooks/useFetchUser/useFetchUser";
import type { userInfo } from "../../types/user/userInfo";
import { AuthContext } from "../../context/AuthContext";
import { useFetchEntity } from "../../hooks/useFetchEntity/useFetchEntity";
import type { EstablishmentInfo } from "../../types/establishment/EstablishmentInfo";
import type { FoodBankInfo } from "../../types/foodbank/FoodBankInfo";

const Login: React.FC = () => {
  const [stayConnected, setStayConnected] = useState(false);
  const [loginData, setLoginData] = useState<loginData>({
    email: "",
    password: "",
  });
  const { loginFunction, loginError } = useLogin();
  const { fetchUserFunction, error } = useFetchUser()
  const { fetchEntityFunction, entityError } = useFetchEntity();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) throw new Error("AuthContext missing");

  const { setUser, setToken, setEntity } = auth;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await loginFunction(loginData);
    if(loginError){ //casi seguro que esto no funciona
      console.log(loginError);
    }
    setToken(token);
    if(token){
      localStorage.setItem("token", token);
      const userLoggedIn: userInfo | null = await fetchUserFunction(token);
      localStorage.setItem("user", JSON.stringify(userLoggedIn));
      if (userLoggedIn?.role.toLowerCase() === "establishment" && userLoggedIn?.establishmentId) {
        const establishment: EstablishmentInfo | null = await fetchEntityFunction(`/establishment/${userLoggedIn.establishmentId}`) as EstablishmentInfo | null;
        localStorage.setItem("entity", JSON.stringify(establishment));
        setEntity(establishment);
      }
      if (userLoggedIn?.role.toLowerCase() === "foodbank" && userLoggedIn?.foodBankId) {
        const foodBank: FoodBankInfo | null = await fetchEntityFunction(`/foodbank/${userLoggedIn.foodBankId}`) as FoodBankInfo | null;
        localStorage.setItem("entity", JSON.stringify(foodBank));
        setEntity(foodBank);
      }
      if(error){ //casi seguro que esto no funciona
        console.log(error);
      }
      setUser(userLoggedIn);
      navigate("/");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
                name="email"
                value={loginData.email}
                onChange={(e) => handleChange(e)}
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
                name="password"
                value={loginData.password}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] focus:ring-2 focus:ring-[#8FC0A9] focus:outline-none placeholder-gray-300"
              />
              <label className="flex items-center space-x-2 cursor-pointer select-none mt-4">
                <input 
                  type="checkbox"
                  checked={stayConnected}
                  onChange={(e) => setStayConnected(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-green-800 focus:text-green-800"
                />
                <span className="text-green-800 font-medium">Mantener la sesión iniciada</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 hover:bg-green-700 text-white rounded-lg text-lg font-medium bg-green-800 transition-all shadow-md hover:shadow-lg"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            <p className="mt-2">
              ¿No tienes cuenta?{" "}
              <Link to="/registro"
                className="text-green-800 hover:underline font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
