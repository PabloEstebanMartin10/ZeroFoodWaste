import React, { useEffect, useState } from "react";

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
const DEFAULT_ESTABLISHMENT_ID = 1;

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
        if (obj[dia] && typeof obj[dia] === "object") {
          safe[dia] = {
            inicio: obj[dia].inicio ?? safe[dia].inicio,
            cierre: obj[dia].cierre ?? safe[dia].cierre,
          };
        }
      }
      return safe as Horarios;
    } catch (e) {
      console.error("Error parsing opening hours JSON:", e);
    }
  }

  const match = trimmed.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
  if (match) {
    const [, inicio, cierre] = match;
    return {
      lunes: { inicio, cierre },
      martes: { inicio, cierre },
      miercoles: { inicio, cierre },
      jueves: { inicio, cierre },
      viernes: { inicio, cierre },
      sabado: { inicio: "10:00", cierre: "14:00" },
      domingo: { inicio: "--:--", cierre: "--:--" },
    };
  }

  return defaultHorarios();
};

const serializeHorariosToOpeningHours = (horarios: Horarios): string => {
  const payload = {
    lunes: { inicio: horarios.lunes.inicio, cierre: horarios.lunes.cierre },
    martes: { inicio: horarios.martes.inicio, cierre: horarios.martes.cierre },
    miercoles: {
      inicio: horarios.miercoles.inicio,
      cierre: horarios.miercoles.cierre,
    },
    jueves: { inicio: horarios.jueves.inicio, cierre: horarios.jueves.cierre },
    viernes: {
      inicio: horarios.viernes.inicio,
      cierre: horarios.viernes.cierre,
    },
    sabado: { inicio: horarios.sabado.inicio, cierre: horarios.sabado.cierre },
    domingo: {
      inicio: horarios.domingo.inicio,
      cierre: horarios.domingo.cierre,
    },
  };
  return JSON.stringify(payload);
};

const RestaurantProfile: React.FC = () => {
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
    establishmentId: DEFAULT_ESTABLISHMENT_ID,
  });

  const [donationsHistory, setDonationsHistory] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    totalDonado: { value: "0", change: "+0%", period: "Este mes" },
    personasAyudadas: { value: "0", change: "+0%", period: "Aproximadamente" },
    donacionesActivas: { value: "0", period: "En este momento" },
  });

  // Paginación
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

  // Fetch establishment data
  const fetchEstablishment = async (id: number = DEFAULT_ESTABLISHMENT_ID) => {
    try {
      const res = await fetch(`${REST_API_BASE}/establishment/${id}`);
      if (!res.ok) {
        throw new Error(
          `Error al obtener establecimiento (status ${res.status})`
        );
      }
      const json = await res.json();

      setProfileData((prev) => ({
        ...prev,
        nombre: json.name || "",
        telefono: json.contactPhone || "",
        direccion: json.address || "",
        email: json.email || prev.email,
        descripcion: json.description || prev.descripcion,
        horarios: parseOpeningHoursToHorarios(json.openingHours || ""),
        establishmentId: json.establishmentId || prev.establishmentId,
      }));
    } catch (err: any) {
      console.error("Error fetching establishment:", err);
      throw err;
    }
  };

  // Fetch donations history
  const fetchDonations = async () => {
    try {
      const res = await fetch(
        `${REST_API_BASE}/donations/establishment/${DEFAULT_ESTABLISHMENT_ID}`
      );
      if (!res.ok) {
        throw new Error(`Error al obtener donaciones (status ${res.status})`);
      }
      const json = await res.json();

      // Mapear los datos del backend al formato del frontend
      const mappedDonations = json.map((d: any) => ({
        id: d.donationId || d.id,
        nombre: d.foodItem || d.description || "Sin nombre",
        cantidad: d.quantity ? `${d.quantity} ${d.unit || "kg"}` : "N/A",
        destino: d.recipient || d.destination || "Sin destino",
        fecha: d.donationDate || d.date || "N/A",
        estado: d.status || "Completado",
      }));

      setDonationsHistory(mappedDonations);

      // Calcular estadísticas basadas en datos reales
      setStats({
        totalDonado: {
          value: mappedDonations.length.toString(),
          change: "+0%",
          period: "Este mes",
        },
        personasAyudadas: {
          value: (mappedDonations.length * 60).toString(),
          change: "+0%",
          period: "Aproximadamente",
        },
        donacionesActivas: {
          value: mappedDonations
            .filter((d: Donation) => d.estado !== "Completado")
            .length.toString(),
          period: "En este momento",
        },
      });
    } catch (err: any) {
      console.error("Error fetching donations:", err);
      // No lanzar error, simplemente dejar arrays vacíos
      setDonationsHistory([]);
    }
  };

  // Cargar todos los datos al iniciar
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchEstablishment();
        await fetchDonations();
      } catch (err: any) {
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
        establishmentId: profileData.establishmentId,
        userId: null,
        name: profileData.nombre,
        address: profileData.direccion,
        contactPhone: profileData.telefono,
        openingHours: openingHoursJson,
      };

      const res = await fetch(
        `${REST_API_BASE}/establishment/${profileData.establishmentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Error al guardar (status ${res.status}) ${text}`);
      }

      await fetchEstablishment(profileData.establishmentId);
      setActiveTab("general");
    } catch (err: any) {
      setError(err.message || "Error al guardar cambios");
      alert("No se pudieron guardar los cambios: " + (err.message ?? ""));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando datos del establecimiento…</div>
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
            Gestiona tu perfil y revisa el impacto de tus donaciones
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
                  {profileData.nombre.substring(0, 2).toUpperCase() || "RE"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profileData.nombre || "Nombre no disponible"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {profileData.email || "Email no disponible"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
                        Nombre del Restaurante:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {profileData.nombre || "No disponible"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Email:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {profileData.email || "No disponible"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Teléfono:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {profileData.telefono || "No disponible"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Dirección:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {profileData.direccion || "No disponible"}
                      </p>
                    </div>
                  </div>

                  {profileData.descripcion && (
                    <div>
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
                            horario.cierre === "--:--";

                          return (
                            <div
                              key={dia}
                              className="flex justify-between items-center py-2 border-b border-gray-100 pr-12"
                            >
                              <span className="text-gray-700 font-medium">
                                {dias[dia]}
                              </span>
                              <span
                                className={`${
                                  esCerrado ? "text-red-600" : "text-gray-800"
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

              {/* Stats Grid */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Estadísticas
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Donaciones Totales
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
                    {stats.totalDonado.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalDonado.period}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Donaciones Activas
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.donacionesActivas.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.donacionesActivas.period}
                  </p>
                </div>
              </div>
            </>
          ) : activeTab === "historial" ? (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Historial de Donaciones
                </h3>

                {donationsHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay donaciones registradas aún
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {currentDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="bg-white p-3 rounded-lg">
                            <svg
                              className="w-6 h-6 text-gray-600"
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
                              <span>📍 {donation.destino}</span>
                              <span>📅 {donation.fecha}</span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              donation.estado === "Completado"
                                ? "bg-green-100 text-green-700"
                                : donation.estado === "Programado"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {donation.estado}
                          </span>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Anterior
                        </button>

                        <div className="flex gap-1">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentPage === pageNum
                                  ? "bg-green-700 text-white"
                                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Siguiente
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
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Configuración del Perfil
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Restaurante
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
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                    />
                  </div>

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
                              <span className="text-gray-700 font-medium w-24">
                                {dias[dia]}
                              </span>
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center gap-2">
                                  <label className="text-sm text-gray-600">
                                    Hora de Inicio:
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
                                        e.target.value || "--:--"
                                      )
                                    }
                                    className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-sm text-gray-600">
                                    Hora de Cierre:
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
                                        e.target.value || "--:--"
                                      )
                                    }
                                    className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="text-lg font-semibold text-gray-800">
                        Seguridad
                      </span>
                    </div>

                    <div className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          placeholder="Ingresa tu contraseña actual"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          placeholder="Ingresa tu nueva contraseña"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          placeholder="Confirma tu nueva contraseña"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>

                      <button className="px-6 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                        Actualizar Contraseña
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setActiveTab("general")}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className="px-6 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-60"
                    >
                      {saving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="max-w-6xl mx-auto mt-4">
            <div className="text-sm text-red-600">Error: {error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfile;
