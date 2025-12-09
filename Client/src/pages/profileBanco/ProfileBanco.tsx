import React, { useState } from "react";

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

const FoodBankProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "config" | "historial">("general");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [profileData, setProfileData] = useState({
    nombre: "Banco de Alimentos Regional",
    email: "contacto@bancoalimentos.org",
    telefono: "+34 913 456 789",
    direccion: "Avenida de la Solidaridad 45, Málaga",
    descripcion: "Organización sin ánimo de lucro dedicada a la lucha contra el hambre y el desperdicio alimentario. Colaboramos con restaurantes, comercios y donantes para redistribuir alimentos a familias necesitadas desde 2015.",
    horarios: {
      lunes: { inicio: "08:00", cierre: "18:00" },
      martes: { inicio: "08:00", cierre: "18:00" },
      miercoles: { inicio: "08:00", cierre: "18:00" },
      jueves: { inicio: "08:00", cierre: "18:00" },
      viernes: { inicio: "08:00", cierre: "18:00" },
      sabado: { inicio: "09:00", cierre: "14:00" },
      domingo: { inicio: "--:--", cierre: "--:--" }
    }
  });

  const donationsHistory = [
    {
      id: 1,
      nombre: "Pan del día anterior",
      cantidad: "15 kg",
      origen: "Restaurante El Buen Sabor",
      fecha: "2 Dic 2025",
      estado: "Recogido"
    },
    {
      id: 2,
      nombre: "Verduras frescas",
      cantidad: "8 kg",
      origen: "Supermercado La Esquina",
      fecha: "1 Dic 2025",
      estado: "Recogido"
    },
    {
      id: 3,
      nombre: "Comidas preparadas",
      cantidad: "12 raciones",
      origen: "Restaurante El Buen Sabor",
      fecha: "4 Dic 2025",
      estado: "Recogido"
    },
    {
      id: 4,
      nombre: "Frutas variadas",
      cantidad: "10 kg",
      origen: "Frutería Martínez",
      fecha: "3 Dic 2025",
      estado: "Recogido"
    },
    {
      id: 5,
      nombre: "Lácteos",
      cantidad: "20 kg",
      origen: "Supermercado La Esquina",
      fecha: "30 Nov 2025",
      estado: "Recogido"
    },
    {
      id: 6,
      nombre: "Carnes preparadas",
      cantidad: "18 kg",
      origen: "Carnicería García",
      fecha: "29 Nov 2025",
      estado: "Recogido"
    },
    {
      id: 7,
      nombre: "Pasta",
      cantidad: "25 kg",
      origen: "Restaurante La Italiana",
      fecha: "28 Nov 2025",
      estado: "Recogido"
    },
    {
      id: 8,
      nombre: "Conservas variadas",
      cantidad: "30 unidades",
      origen: "Supermercado La Esquina",
      fecha: "27 Nov 2025",
      estado: "Recogido"
    },
    {
      id: 9,
      nombre: "Arroz",
      cantidad: "40 kg",
      origen: "Restaurante Oriente",
      fecha: "26 Nov 2025",
      estado: "Recogido"
    },
    {
      id: 10,
      nombre: "Legumbres",
      cantidad: "15 kg",
      origen: "Tienda Bio Natural",
      fecha: "25 Nov 2025",
      estado: "Recogido"
    },
    {
      id: 11,
      nombre: "Aceite de oliva",
      cantidad: "12 litros",
      origen: "Restaurante Mediterráneo",
      fecha: "24 Nov 2025",
      estado: "Recogido"
    },
    {
      id: 12,
      nombre: "Postres variados",
      cantidad: "20 unidades",
      origen: "Pastelería Dulce Hogar",
      fecha: "23 Nov 2025",
      estado: "Recogido"
    }
  ];

  const stats = {
    donacionesRecogidas: { value: "20", change: "+15%", period: "Este mes" }
  };

  const updateHorario = (dia: keyof Horarios, campo: 'inicio' | 'cierre', valor: string) => {
    setProfileData({
      ...profileData,
      horarios: {
        ...profileData.horarios,
        [dia]: {
          ...profileData.horarios[dia],
          [campo]: valor
        }
      }
    });
  };

  const handleSaveChanges = () => {
    // Aquí para el backend
    setActiveTab("general");
  };

  // Calcular donaciones para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonations = donationsHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(donationsHistory.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-amber-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Mi Cuenta</h1>
          <p className="text-gray-600 mt-1">Gestiona tu perfil y revisa el impacto de las donaciones recogidas</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <div className="bg-green-200 rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-gray-700 font-bold text-xl">BA</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{profileData.nombre}</h2>
                <p className="text-gray-600 text-sm">{profileData.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
              {/* Profile Information - Read Only */}
              <div className="max-w-6xl mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Información del Perfil</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Nombre del Banco de Alimentos:</span>
                      <p className="text-gray-800 mt-1">{profileData.nombre}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <p className="text-gray-800 mt-1">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                      <p className="text-gray-800 mt-1">{profileData.telefono}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Dirección:</span>
                      <p className="text-gray-800 mt-1">{profileData.direccion}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">Descripción:</span>
                    <p className="text-gray-800 mt-1">{profileData.descripcion}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg font-semibold text-gray-800">Horario de Atención</span>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(profileData.horarios).map(([dia, horario]) => {
                        const dias: Record<string, string> = {
                          lunes: "Lunes",
                          martes: "Martes",
                          miercoles: "Miércoles",
                          jueves: "Jueves",
                          viernes: "Viernes",
                          sabado: "Sábado",
                          domingo: "Domingo"
                        };
                        
                        const esCerrado = horario.inicio === "--:--" || horario.cierre === "--:--";
                        
                        return (
                          <div key={dia} className="flex justify-between items-center py-2 border-b border-gray-100 pr-12">
                            <span className="text-gray-700 font-medium">{dias[dia]}</span>
                            <span className={`${esCerrado ? 'text-red-600' : 'text-gray-800'}`}>
                              {esCerrado ? 'Cerrado' : `${horario.inicio} - ${horario.cierre}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Estadísticas</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 mb-8 max-w-md">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-600">Donaciones Recogidas</span>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.donacionesRecogidas.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.donacionesRecogidas.period}</p>
                </div>
              </div>
            </>
          ) : activeTab === "historial" ? (
            <>
              {/* Historial donaciones */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Donaciones Recogidas</h3>
                <div className="space-y-3">
                  {currentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="bg-white p-3 rounded-lg">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{donation.nombre}</h4>
                        <p className="text-sm text-gray-600">{donation.cantidad}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>📍 {donation.origen}</span>
                          <span>📅 {donation.fecha}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                        {donation.estado}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
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
              </div>
            </>
          ) : (
            <>
              {/* Configuración */}
              <div className="max-w-6xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Configuración del Perfil</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Banco de Alimentos</label>
                      <input
                        type="text"
                        value={profileData.nombre}
                        onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="text"
                        value={profileData.telefono}
                        onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                      <input
                        type="text"
                        value={profileData.direccion}
                        onChange={(e) => setProfileData({ ...profileData, direccion: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={profileData.descripcion}
                      onChange={(e) => setProfileData({ ...profileData, descripcion: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg font-semibold text-gray-800">Horario de Atención</span>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(profileData.horarios).map(([dia, horario]) => {
                        const dias: Record<string, string> = {
                          lunes: "Lunes",
                          martes: "Martes",
                          miercoles: "Miércoles",
                          jueves: "Jueves",
                          viernes: "Viernes",
                          sabado: "Sábado",
                          domingo: "Domingo"
                        };
                        
                        return (
                          <div key={dia} className="flex items-center gap-4">
                            <span className="text-gray-700 font-medium w-24">{dias[dia]}</span>
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Hora de Inicio:</label>
                                <input
                                  type="time"
                                  value={horario.inicio}
                                  onChange={(e) => updateHorario(dia as keyof Horarios, 'inicio', e.target.value)}
                                  className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Hora de Cierre:</label>
                                <input
                                  type="time"
                                  value={horario.cierre}
                                  onChange={(e) => updateHorario(dia as keyof Horarios, 'cierre', e.target.value)}
                                  className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-lg font-semibold text-gray-800">Seguridad</span>
                    </div>
                    
                    <div className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                        <input
                          type="password"
                          placeholder="Ingresa tu contraseña actual"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                        <input
                          type="password"
                          placeholder="Ingresa tu nueva contraseña"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
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
                      className="px-6 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
                    >
                      Guardar Cambios
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