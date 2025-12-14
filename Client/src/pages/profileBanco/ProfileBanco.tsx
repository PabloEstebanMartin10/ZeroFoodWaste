import React, { useState, useEffect } from "react";

interface Horario {
  inicio: string;
  cierre: string;
}

interface Horarios {
  lunes: Horario;
  martes: Horario;
  miercoles: Horario;
  jueves: Horario;
  viernes: Horario;
  sabado: Horario;
  domingo: Horario;
}

interface Donation {
  id: number;
  nombre: string;
  cantidad: string;
  destino: string;
  fecha: string;
  estado: string;
}

type Tab = "general" | "config" | "historial";

const REST_API_BASE = "http://localhost:8080";

const defaultHorarios = (): Horarios => ({
  lunes: { inicio: "09:00", cierre: "17:00" },
  martes: { inicio: "09:00", cierre: "17:00" },
  miercoles: { inicio: "09:00", cierre: "17:00" },
  jueves: { inicio: "09:00", cierre: "17:00" },
  viernes: { inicio: "09:00", cierre: "17:00" },
  sabado: { inicio: "10:00", cierre: "14:00" },
  domingo: { inicio: "--:--", cierre: "--:--" },
});

const parseOpeningHoursToHorarios = (openingHours?: string): Horarios => {
  if (!openingHours) return defaultHorarios();

  const trimmed = openingHours.trim();

  if (trimmed.startsWith("{")) {
    try {
      const obj = JSON.parse(trimmed);
      const safe = { ...defaultHorarios() } as any;
      for (const dia of Object.keys(safe)) {
        if (obj[dia]) {
          safe[dia] = {
            inicio: obj[dia].inicio || safe[dia].inicio,
            cierre: obj[dia].cierre || safe[dia].cierre,
          };
        }
      }
      return safe as Horarios;
    } catch (e) {
      console.error("Error parsing opening hours JSON:", e);
      return defaultHorarios();
    }
  }

  const match = trimmed.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
  if (match) {
    const [, inicio, cierre] = match;
    const common = { inicio, cierre };
    return {
      lunes: common,
      martes: common,
      miercoles: common,
      jueves: common,
      viernes: common,
      sabado: { inicio: "10:00", cierre: "14:00" },
      domingo: { inicio: "--:--", cierre: "--:--" },
    };
  }

  return defaultHorarios();
};

const serializeHorariosToOpeningHours = (horarios: Horarios): string => {
  return JSON.stringify(horarios);
};

const FoodBankProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    descripcion: "",
    horarios: defaultHorarios(),
    foodBankId: 0,
  });

  const [donationsHistory, setDonationsHistory] = useState<Donation[]>([]);

  // Simplificado: Solo guardamos el total de recogidas
  const [totalRecogidas, setTotalRecogidas] = useState("0");

  // --- LÓGICA DE CARGA DE DATOS ---

  const fetchFoodBank = async (id: number) => {
    const res = await fetch(`${REST_API_BASE}/foodbank/${id}`);
    if (!res.ok)
      throw new Error(`Error al obtener banco (status ${res.status})`);

    const json = await res.json();

    const loadedData = {
      nombre: json.name || "",
      telefono: json.contactPhone || "",
      direccion: json.address || "",
      email: json.email || "",
      descripcion: json.description || "",
      // Ahora que has arreglado el backend, esto debería traer datos
      horarios: parseOpeningHoursToHorarios(json.openingHours || ""),
      foodBankId: json.id || id, // Usamos json.id directamente del DTO de FoodBank
    };

    setProfileData((prev) => ({ ...prev, ...loadedData }));
    return loadedData;
  };

  const fetchDonations = async (foodBankId: number) => {
    try {
      if (!foodBankId) return;

      const res = await fetch(
        `${REST_API_BASE}/foodbank/${foodBankId}/donations`
      );

      if (!res.ok) {
        console.warn("No se pudieron cargar donaciones o no existen");
        setDonationsHistory([]);
        setTotalRecogidas("0");
        return;
      }

      const json = await res.json();

      const mappedDonations = json
        .map((d: any) => ({
          id: d.donationId || d.id,
          nombre: d.foodItem || d.description || "Sin nombre",
          cantidad: d.quantity ? `${d.quantity} ${d.unit || "kg"}` : "N/A",
          destino: d.recipient || d.destination || "Sin destino",
          fecha: d.donationDate || d.date || "N/A",
          estado: d.status || "Completado",
        }))
        .reverse();

      setDonationsHistory(mappedDonations);

      // Calculamos SOLO las recogidas
      const donacionesCompletadas = mappedDonations.filter(
        (d: Donation) =>
          d.estado === "COMPLETED" ||
          d.estado === "Completado" ||
          d.estado === "Recogido"
      );

      setTotalRecogidas(donacionesCompletadas.length.toString());
    } catch (err) {
      console.error("Error fetching donations:", err);
      setDonationsHistory([]);
    }
  };

  // useEffect: Carga en Cascada
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUser = localStorage.getItem("user");

        let currentId = 0;

        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          // Dependiendo de cómo guardes el objeto usuario, el ID puede estar en:
          // userObj.id, userObj.establishmentId, o userObj.userId
          currentId = userObj.foodBankId || userObj.id;
        }

        if (!currentId) {
          throw new Error(
            "No se encontró sesión de usuario. Por favor inicie sesión."
          );
        }

        // Actualizamos el estado con el ID correcto
        setProfileData((prev) => ({ ...prev, foodBankId: currentId }));

        // 2. Usar ese ID para las peticiones
        await fetchFoodBank(currentId);
        await fetchDonations(currentId);
      } catch (err: any) {
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // --- PAGINACIÓN ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonations = donationsHistory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(donationsHistory.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // --- GUARDADO DE DATOS ---
  const updateHorario = (
    dia: keyof Horarios,
    campo: "inicio" | "cierre",
    valor: string
  ) => {
    setProfileData((prev) => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          ...prev.horarios[dia],
          [campo]: valor,
        },
      },
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    try {
      const openingHoursJson = serializeHorariosToOpeningHours(
        profileData.horarios
      );

      const payload = {
        id: profileData.foodBankId, // El DTO espera 'id'
        name: profileData.nombre,
        address: profileData.direccion,
        contactPhone: profileData.telefono,
        // Estos campos ahora funcionarán si actualizas el Backend DTO y Entidad
        email: profileData.email,
        description: profileData.descripcion,
        openingHours: openingHoursJson,
      };

      const res = await fetch(
        `${REST_API_BASE}/foodbank/${profileData.foodBankId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Error al guardar (status ${res.status}): ${text}`);
      }

      await fetchFoodBank(profileData.foodBankId);

      setActiveTab("general");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al guardar cambios");
      alert("Error: " + (err.message || "No se pudo guardar"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-gray-600 animate-pulse">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-amber-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Mi Cuenta</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu perfil y revisa el impacto de las donaciones recogidas
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <div className="bg-green-200 rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-gray-700 font-bold text-xl">
                  {profileData.nombre
                    ? profileData.nombre.substring(0, 2).toUpperCase()
                    : "BA"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profileData.nombre || "Nombre no definido"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {profileData.email || "Sin email registrado"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Food Bank ID: {profileData.foodBankId}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-green-300 rounded-lg transition-colors">
              {/* Icono Logout */}
              <svg
                className="w-6 h-6 text-green-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 border-b-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "general"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Vista General
            </button>
            <button
              onClick={() => setActiveTab("historial")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "historial"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Historial
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "config"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Configuración
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          {activeTab === "general" ? (
            <>
              {/* Profile Information */}
              <div className="max-w-6xl mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Información del Perfil
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Nombre:
                      </span>
                      <p className="text-gray-800 mt-1">{profileData.nombre}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Email:
                      </span>
                      <p className="text-gray-800 mt-1">{profileData.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Teléfono:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {profileData.telefono}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Dirección:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {profileData.direccion}
                      </p>
                    </div>
                  </div>
                  {profileData.descripcion && (
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-600">
                        Descripción:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {profileData.descripcion}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-lg font-semibold text-gray-800">
                        Horario de Atención
                      </span>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(profileData.horarios).map(
                        ([dia, horario]) => {
                          const dias: Record<string, string> = {
                            lunes: "Lunes",
                            martes: "Martes",
                            miercoles: "Miércoles",
                            jueves: "Jueves",
                            viernes: "Viernes",
                            sabado: "Sábado",
                            domingo: "Domingo",
                          };
                          const esCerrado =
                            horario.inicio === "--:--" ||
                            horario.cierre === "--:--" ||
                            !horario.inicio;
                          return (
                            <div
                              key={dia}
                              className="flex justify-between items-center py-2 border-b border-gray-100 pr-12 last:border-0"
                            >
                              <span className="text-gray-700 font-medium">
                                {dias[dia]}
                              </span>
                              <span
                                className={`${
                                  esCerrado
                                    ? "text-red-500 font-medium"
                                    : "text-gray-800"
                                }`}
                              >
                                {esCerrado
                                  ? "Cerrado"
                                  : `${horario.inicio} - ${horario.cierre}`}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid - SIMPLIFICADO A SOLO TOTAL */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Estadísticas de Impacto
                </h3>
                {/* Modificamos el Grid para que se ajuste al contenido */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {/* Total Donado - ÚNICA TARJETA */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm min-w-[250px]">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Donaciones Recogidas
                      </span>
                      <div className="bg-green-50 p-2 rounded-lg">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {totalRecogidas}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Total acumulado
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === "historial" ? (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Historial de Donaciones (ID Banco: {profileData.foodBankId})
                </h3>

                {donationsHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">
                      No hay historial de donaciones para este banco.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {currentDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <svg
                              className="w-6 h-6 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">
                              {donation.nombre}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {donation.cantidad}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {donation.destino}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {donation.fecha}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              donation.estado === "AVAILABLE"
                                ? "bg-green-100 text-green-700"
                                : donation.estado === "COMPLETED" ||
                                  donation.estado === "Completado"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {donation.estado}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Paginación */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6 gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <span className="px-3 py-1 text-gray-600">
                          Pág {currentPage} de {totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Configuration Form */}
              <div className="max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Configuración del Perfil
                  </h3>
                  {saving && (
                    <span className="text-sm text-green-600 animate-pulse">
                      Guardando...
                    </span>
                  )}
                </div>
                {/* Form Inputs (Igual que antes) */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={profileData.nombre}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            nombre: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={profileData.telefono}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            telefono: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={profileData.direccion}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            direccion: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={profileData.descripcion}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          descripcion: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Horario inputs */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-lg font-semibold text-gray-800">
                        Horario de Atención
                      </span>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(profileData.horarios).map(
                        ([dia, horario]) => {
                          const dias: Record<string, string> = {
                            lunes: "Lunes",
                            martes: "Martes",
                            miercoles: "Miércoles",
                            jueves: "Jueves",
                            viernes: "Viernes",
                            sabado: "Sábado",
                            domingo: "Domingo",
                          };
                          return (
                            <div key={dia} className="flex items-center gap-4">
                              <span className="text-gray-700 font-medium w-24 capitalize">
                                {dias[dia]}
                              </span>
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center gap-2">
                                  <label className="text-sm text-gray-600">
                                    Apertura:
                                  </label>
                                  <input
                                    type="time"
                                    value={
                                      horario.inicio === "--:--"
                                        ? ""
                                        : horario.inicio
                                    }
                                    onChange={(e) =>
                                      updateHorario(
                                        dia as keyof Horarios,
                                        "inicio",
                                        e.target.value
                                      )
                                    }
                                    className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-sm text-gray-600">
                                    Cierre:
                                  </label>
                                  <input
                                    type="time"
                                    value={
                                      horario.cierre === "--:--"
                                        ? ""
                                        : horario.cierre
                                    }
                                    onChange={(e) =>
                                      updateHorario(
                                        dia as keyof Horarios,
                                        "cierre",
                                        e.target.value
                                      )
                                    }
                                    className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setActiveTab("general")}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className={`px-6 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors ${
                        saving ? "opacity-70 cursor-wait" : ""
                      }`}
                    >
                      {saving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodBankProfile;
