import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logos/Logo_ZFWTransparent.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full grid grid-cols-3 items-center h-14 pl-4 bg-green-600 shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center space-x-4 text-white">
        <img src={Logo} alt="Logo" className="w-16 h-8 cursor-pointer" />
        <span className="font-bold text-2xl">ZeroFoodWaste</span>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Link
          to="/"
          className="text-xl text-white font-semibold hover:opacity-80"
        >
          Inicio
        </Link>
      </div>

      <div className="flex text-white items-center justify-end h-full">
        <div className="flex h-full overflow-hidden bg-green-600">
          <button
            className="h-full px-6 flex items-center justify-center border-r border-white border-opacity-40 hover:bg-green-500 text-white font-semibold shadow-none transition"
            onClick={() => navigate("/login")}
          >
            Conéctate
          </button>
          <button
            className="h-full px-6 flex items-center justify-center text-white border-r border-white border-opacity-40 hover:bg-green-500 font-semibold shadow-none transition"
            onClick={() => navigate("/registro")}
          >
            Regístrate
          </button>
        </div>

        {/* Avatar como botón rectangular */}
        <div className="relative h-14" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="h-full px-4 flex items-center justify-center text-white hover:bg-green-500 font-semibold shadow-none transition space-x-2"
          >
            <span>Perfil</span>
            <span className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center overflow-hidden">
              {/* Aquí va la foto de perfil o un icono */}
              {/*<img
                src="" // url de la imagen o icono
                alt=""
                className="w-full h-full object-cover"
              />*/}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold text-gray-900">
                  BurgerKing
                </p>
                <p className="text-xs text-gray-500 truncate">
                  user@example.com
                </p>
              </div>

              <Link
                to="/comercio"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              <Link
                to="/account"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  alert("Cerrar sesión");
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
