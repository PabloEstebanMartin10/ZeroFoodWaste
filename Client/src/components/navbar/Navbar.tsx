import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logos/Logo_ZFWTransparent.png";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext missing");
  const { user, setUser, setToken, entity, setEntity } = auth;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    setEntity(null);
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("entity");
    navigate("/login");
  }

  return (
    <nav className="w-full grid grid-cols-3 items-center h-14 pl-4 bg-green-600 shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center space-x-4 text-white">
        <img src={Logo} alt="Logo" onClick={() => navigate("/")} className="w-16 h-8 cursor-pointer" />
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
      {!user ? (
        <div className="flex h-full overflow-hidden bg-green-600">
          <button
            className="h-full px-6 flex items-center justify-center border-r border-white border-opacity-40 hover:bg-green-500 text-white font-semibold shadow-none transition"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
          <button
            className="h-full px-6 flex items-center justify-center text-white border-r border-white border-opacity-40 hover:bg-green-500 font-semibold shadow-none transition"
            onClick={() => navigate("/registro")}
          >
            Regístrate
          </button>
        </div>
        ) : (
        
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
                    {entity?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>

              <Link
                to={user.role === "Establishment" ? "/comercio" : "/banco"}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to={user.role === "Establishment" ? "/perfil-comercio" : "/perfil-banco"}
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
                onClick={() => handleLogout()}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>)}
      </div>
    </nav>
  );
}
