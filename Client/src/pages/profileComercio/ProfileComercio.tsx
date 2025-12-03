import React, { useState } from "react";

const RestaurantProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: "Green Leaf Bistro",
    tipo: "Restaurante",
    direccion: "123 Main Street, Downtown, City 12345",
    telefono: "+1 (555) 123-4567",
    email: "contact@greenleafbistro.com",
    horarios: [
      { dia: "Lunes", inicio: "11:00", cierre: "22:00" },
      { dia: "Martes", inicio: "11:00", cierre: "22:00" },
      { dia: "Miércoles", inicio: "11:00", cierre: "22:00" },
      { dia: "Jueves", inicio: "11:00", cierre: "22:00" },
      { dia: "Viernes", inicio: "11:00", cierre: "23:00" },
      { dia: "Sábado", inicio: "11:00", cierre: "23:00" },
      { dia: "Domingo", inicio: "10:00", cierre: "21:00" }
    ]
  });

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
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Green Header */}
          <div className="bg-green-700 px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profileData.nombre}</h2>
                <p className="text-green-100">{profileData.tipo}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              {isEditing ? "Guardar Cambios" : "Editar Perfil"}
            </button>
          </div>

          {/* Basic Information */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Información Básica</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Nombre del Restaurante</label>
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
                  📍 Dirección
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.direccion}
                    onChange={(e) => setProfileData({...profileData, direccion: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{profileData.direccion}</p>
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

          {/* Opening Hours */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">
              📅 Horario de Apertura
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
                    <span className="text-gray-600">{horario.inicio} - {horario.cierre}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Estadísticas de Donaciones</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-700">24</p>
              <p className="text-sm text-gray-600 mt-1">Donaciones Totales</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-700">3</p>
              <p className="text-sm text-gray-600 mt-1">Donaciones Activas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;