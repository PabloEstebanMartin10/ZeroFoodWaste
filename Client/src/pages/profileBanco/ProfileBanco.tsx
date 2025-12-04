import React, { useState } from "react";

const FoodBankProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDonations, setShowDonations] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [profileData, setProfileData] = useState({
    nombre: "Community Food Bank",
    tipo: "Banco de Alimentos",
    areaOperacion: "Avenida Miraflores, 19, Málaga",
    telefono: "+34 600 123 456",
    email: "info@communityfoodbank.org",
    capacidadDiaria: "500 meals per day",
    poblacionServida: "Approximately 2,000 families monthly",
    horarios: [
      { dia: "Lunes", inicio: "09:00", cierre: "17:00" },
      { dia: "Martes", inicio: "09:00", cierre: "17:00" },
      { dia: "Miércoles", inicio: "09:00", cierre: "17:00" },
      { dia: "Jueves", inicio: "09:00", cierre: "17:00" },
      { dia: "Viernes", inicio: "09:00", cierre: "17:00" },
      { dia: "Sábado", inicio: "10:00", cierre: "14:00" },
      { dia: "Domingo", inicio: "", cierre: "" }
    ]
  });

  const donacionesCompletadas = [
    { producto: "Mix de verduras", establecimiento: "Frutería Del Sol", distancia: "4.7 Km", fechaCaducidad: "Dec 25, 2024", estado: "Recogida" },
    { producto: "Fresh Bread Loaves", establecimiento: "Green Valley Restaurant", distancia: "2.3 Km", fechaCaducidad: "Dec 26, 2024", estado: "Recogida" },
    { producto: "Fresh Fruit Selection", establecimiento: "Garden Grill", distancia: "3.1 Km", fechaCaducidad: "Dec 27, 2024", estado: "Recogida" },
    { producto: "Bakery Items", establecimiento: "Sunrise Bakery", distancia: "—", fechaCaducidad: "Dec 28, 2024", estado: "Recogida" },
    { producto: "Pasta & Grains", establecimiento: "City Supermarket", distancia: "1.5 Km", fechaCaducidad: "Jan 10, 2025", estado: "Recogida" },
    { producto: "Dairy Products", establecimiento: "Healthy Foods Market", distancia: "2.8 Km", fechaCaducidad: "Jan 12, 2025", estado: "Recogida" },
    { producto: "Canned Goods", establecimiento: "Neighborhood Grocery", distancia: "3.5 Km", fechaCaducidad: "Jan 15, 2025", estado: "Recogida" },
    { producto: "Assorted Beverages", establecimiento: "Downtown Deli", distancia: "2.0 Km", fechaCaducidad: "Jan 18, 2025", estado: "Recogida" },
    
  ];

  // Calcula la paginación
  const totalPages = Math.ceil(donacionesCompletadas.length / itemsPerPage);

  const currentItems = donacionesCompletadas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-amber-50">

      {/* Header */}
      <div className="bg-amber-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Perfil</h1>
          <p className="text-gray-600 mt-1">Administra la información de tu cuenta</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          
          {/* Green Header */}
          <div className="bg-green-700 px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profileData.nombre}</h2>
                <p className="text-green-100">{profileData.tipo}</p>
              </div>
            </div>

            {/* Botón de cerrar */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                {isEditing ? "Guardar Cambios" : "Editar Perfil"}
              </button>
              <button 
                onClick={() => {
                  setShowDonations(true);
                  setCurrentPage(1); //Resetea a la primera página al abrir
                }}
                className="px-6 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Registro
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Información Básica</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Nombre de la Organización</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.nombre}
                    onChange={(e) => setProfileData({...profileData, nombre: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{profileData.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  📍 Área de Operación
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.areaOperacion}
                    onChange={(e) => setProfileData({...profileData, areaOperacion: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{profileData.areaOperacion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Información de Contacto</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  📞 Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.telefono}
                    onChange={(e) => setProfileData({...profileData, telefono: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{profileData.telefono}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  ✉️ Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{profileData.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Capacity Information */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Información Adicional </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Capacidad Diaria</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.capacidadDiaria}
                    onChange={(e) => setProfileData({...profileData, capacidadDiaria: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{profileData.capacidadDiaria}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Población Servida</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.poblacionServida}
                    onChange={(e) => setProfileData({...profileData, poblacionServida: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{profileData.poblacionServida}</p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">
              📅 Horario de Atención
            </h3>
            
            <div className="space-y-2">
              {profileData.horarios.map((horario, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700 font-medium w-32">{horario.dia}</span>
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Hora de Inicio:</label>
                        <input
                          type="time"
                          value={horario.inicio}
                          onChange={(e) => {
                            const newHorarios = [...profileData.horarios];
                            newHorarios[index].inicio = e.target.value;
                            setProfileData({...profileData, horarios: newHorarios});
                          }}
                          className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Hora de Cierre:</label>
                        <input
                          type="time"
                          value={horario.cierre}
                          onChange={(e) => {
                            const newHorarios = [...profileData.horarios];
                            newHorarios[index].cierre = e.target.value;
                            setProfileData({...profileData, horarios: newHorarios});
                          }}
                          className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-600">
                      {horario.inicio && horario.cierre ? `${horario.inicio} - ${horario.cierre}` : "Cerrado"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MODAL DONACIONES */}
      {showDonations && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border w-full max-w-3xl p-6 relative">
            
            {/* Cerrar */}
            <button
              onClick={() => setShowDonations(false)}
              className="absolute top-4 right-4 text-gray-600 text-lg hover:text-gray-900"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Donaciones Completadas
            </h3>

            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">PRODUCTO</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ESTABLECIMIENTO</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DISTANCIA</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CADUCIDAD</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((donacion, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-800">{donacion.producto}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{donacion.establecimiento}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{donacion.distancia}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{donacion.fechaCaducidad}</td>
                      <td className="px-4 py-4">
                        <span className="inline-block px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          {donacion.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-700 text-white hover:bg-green-800"
                }`}
              >
                Anterior
              </button>

              <p className="text-gray-700">
                Página {currentPage} de {totalPages}
              </p>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-700 text-white hover:bg-green-800"
                }`}
              >
                Siguiente
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default FoodBankProfile;
