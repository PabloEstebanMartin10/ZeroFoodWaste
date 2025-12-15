import { useState } from "react";
import type { NewUserData, TipoRegistro } from "../../types/user/NewUserData";
import { useRegister } from "../../hooks/useRegister/useRegister";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  tipo: TipoRegistro | "";
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  // Solo para comercio
  cif: string;
  // Solo para banco
  provincia: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const provincias = [
  "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ciudad Real",
  "Córdoba",
  "La Coruña",
  "Cuenca",
  "Gerona",
  "Granada",
  "Guadalajara",
  "Guipúzcoa",
  "Huelva",
  "Huesca",
  "Islas Baleares",
  "Jaén",
  "León",
  "Lérida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Murcia",
  "Navarra",
  "Orense",
  "Palencia",
  "Las Palmas",
  "Pontevedra",
  "La Rioja",
  "Salamanca",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Santa Cruz de Tenerife",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vizcaya",
  "Zamora",
  "Zaragoza",
];

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    tipo: "",
    nombre: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    cif: "",
    provincia: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const { registerFunction, registerError } = useRegister();
  const navigate =  useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tipo === "") {
      alert("Por favor, selecciona si eres Comercio o Banco de Alimentos.");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    
    const formDataToSend: NewUserData = {
      email: formData.email,
      password: formData.password,
      role: formData.tipo === "comercio" ? "Establishment" : "FoodBank",
      establishmentName: formData.tipo === "comercio" ? formData.nombre : undefined,
      establishmentAddress: formData.tipo === "comercio" ? formData.direccion : undefined,
      establishmentContactPhone: formData.tipo === "comercio" ? formData.telefono : undefined,
      description: formData.descripcion,
      foodBankName: formData.tipo === "banco" ? formData.nombre : undefined,
      foodBankAddress: formData.tipo === "banco" ? formData.direccion : undefined,
      foodBankContactPhone: formData.tipo === "banco" ? formData.telefono : undefined,
    };

    const response = registerFunction(formDataToSend);
    console.log(response);
    // Aquí puedes procesar el formData o enviarlo al backend
    console.log("Formulario enviado:", formData);
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-amber-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-green-900 text-center mb-8">
          Registro
        </h1>

        {/* Tipo desplegable obligatorio */}
        <label className="block mb-6">
          <span className="text-green-800 font-medium">Tipo de registro *</span>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] 
                       focus:ring-2 focus:ring-green-300 focus:outline-none"
          >
            <option value="">Selecciona una opción</option>
            <option value="comercio">Comercio</option>
            <option value="banco">Banco de Alimentos</option>
          </select>
        </label>

        {/* Nombre */}
        <label className="block mb-4">
          <span className="text-green-800 font-medium">
            {formData.tipo === "banco"
              ? "Nombre del banco de alimentos *"
              : "Nombre del comercio *"}
          </span>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder={
              formData.tipo === "banco"
                ? "Ej. Banco de Alimentos de Madrid"
                : "Nombre del comercio"
            }
            required
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] 
                       focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-green-800 font-medium">
            Descripcion
          </span>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder={
              formData.tipo === "banco"
                ? "Descripcion del banco de alimentos"
                : "Descripcion del comercio"
            }
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] 
                       focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </label>

        {/* Dirección */}
        <label className="block mb-4">
          <span className="text-green-800 font-medium">Dirección *</span>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Dirección"
            required
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] 
                       focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </label>

        {/* Teléfono */}
        <label className="block mb-4">
          <span className="text-green-800 font-medium">Teléfono *</span>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            required
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] 
                       focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </label>

        {/* Campo condicional: CIF / NIF para Comercio */}
        {formData.tipo === "comercio" && (
          <label className="block mb-4">
            <span className="text-green-800 font-medium">CIF / NIF *</span>
            <input
              type="text"
              name="cif"
              value={formData.cif}
              onChange={handleChange}
              placeholder="CIF / NIF"
              required
              className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] 
                         focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
          </label>
        )}

        {/* Campo condicional: Provincia para Banco */}
        {formData.tipo === "banco" && (
          <label className="block mb-4">
            <span className="text-green-800 font-medium">Provincia *</span>
            <select
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9]
                         focus:ring-2 focus:ring-green-300 focus:outline-none"
            >
              <option value="">Selecciona una provincia</option>
              {provincias.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Email */}
        <label className="block mb-4">
          <span className="text-green-800 font-medium">Email *</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            required
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9] 
                       focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
          <div className="mb-4">
            <span className="text-red-600 font-medium">
              {registerError}
            </span>
          </div>
        </label>

        {/* Contraseña y repetir */}
        <div className="flex gap-4 mb-6">
          <label className="w-1/2">
            <span className="text-green-800 font-medium">Contraseña *</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9]
                         focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
          </label>

          <label className="w-1/2">
            <span className="text-green-800 font-medium">
              Repite contraseña *
            </span>
            <input
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              placeholder="Repite contraseña"
              required
              className="mt-2 w-full px-4 py-3 rounded-lg bg-[#F7FAF5] border border-[#C8D5B9]
                         focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 shadow"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
