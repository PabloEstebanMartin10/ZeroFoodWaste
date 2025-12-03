import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="w-full grid grid-cols-3 items-center p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 cursor-pointer" />
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Link
          to="/dashboard"
          className="text-xl font-semibold hover:opacity-80"
        >
          Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-end space-x-6">
        <button
          className="px-4 py-2 rounded-xl shadow hover:shadow-lg transition"
          onClick={() => navigate("/login")}
        >
          Conéctate
        </button>
        <button
          className="px-4 py-2 rounded-xl shadow hover:shadow-lg transition"
          onClick={() => navigate("/registro")}
        >
          Regístrate
        </button>

        <Link to="/profile">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80"
          />
        </Link>
      </div>
    </nav>
  );
}
