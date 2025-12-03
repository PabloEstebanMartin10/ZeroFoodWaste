import React, { useState } from "react";
// Todos los componentes e interfaces necesarios
interface Donation { // Define la interfaz Donation
  id: number; 
  producto: string;
  establecimiento: string;
  distancia: number | null;
  caducidad: string;
  estado: "Reservado" | "Disponible";
  cantidad: string;
  ubicacion: string;
  fechaPublicacion: string;
  descripcion: string;
  imagen: string;
}

const Dashboard: React.FC = () => { 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [distanceSort, setDistanceSort] = useState<"asc" | "desc" | null>(null);
  const [statusSort, setStatusSort] = useState<"asc" | "desc" | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [activeTab, setActiveTab] = useState<"disponibles" | "reservadas">("disponibles");

  const [donations, setDonations] = useState<Donation[]>([
    { id: 1, producto: "Productos del día", establecimiento: "Supermercado Día", distancia: 1.2, caducidad: "12/12/2025", estado: "Reservado", cantidad: "10 Unidades", ubicacion: "Calle San Fernando, 4 Málaga", fechaPublicacion: "01/12/2025", descripcion: "Productos del día, yogures, pan y embutidos", imagen: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop" },
    { id: 2, producto: "Mix de verduras", establecimiento: "Frutería Del Sol", distancia: 4.7, caducidad: "Dec 25, 2024", estado: "Disponible", cantidad: "15 kg", ubicacion: "456 Oak Ave, San Francisco, CA", fechaPublicacion: "Dec 21, 2024", descripcion: "Fresh organic vegetables, variety of seasonal produce.", imagen: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop" },
    { id: 3, producto: "Fresh Bread Loaves", establecimiento: "Green Valley Restaurant", distancia: 2.3, caducidad: "Dec 26, 2024", estado: "Disponible", cantidad: "30 units", ubicacion: "789 Elm St, San Francisco, CA", fechaPublicacion: "Dec 22, 2024", descripcion: "Fresh artisan bread baked daily.", imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop" },
    { id: 4, producto: "Fresh Fruit Selection", establecimiento: "Garden Grill", distancia: 3.1, caducidad: "Dec 27, 2024", estado: "Disponible", cantidad: "20 kg", ubicacion: "321 Pine St, San Francisco, CA", fechaPublicacion: "Dec 23, 2024", descripcion: "Assorted fresh fruits.", imagen: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop" },
    { id: 5, producto: "Bakery Items", establecimiento: "Sunrise Bakery", distancia: null, caducidad: "Dec 28, 2024", estado: "Disponible", cantidad: "50 units", ubicacion: "654 Maple Ave, San Francisco, CA", fechaPublicacion: "Dec 23, 2024", descripcion: "Variety of bakery items.", imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop" },
    { id: 6, producto: "Canned Goods Assortment", establecimiento: "Metro Market", distancia: 5.8, caducidad: "Mar 15, 2025", estado: "Disponible", cantidad: "100 cans", ubicacion: "987 Cedar Rd, San Francisco, CA", fechaPublicacion: "Dec 20, 2024", descripcion: "Various canned goods.", imagen: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=300&fit=crop" },
    { id: 7, producto: "Pasta & Grains", establecimiento: "City Supermarket", distancia: 1.5, caducidad: "Jan 10, 2025", estado: "Disponible", cantidad: "25 kg", ubicacion: "147 Birch St, San Francisco, CA", fechaPublicacion: "Dec 19, 2024", descripcion: "Dry pasta and grains.", imagen: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=300&fit=crop" },
    { id: 8, producto: "Frozen Vegetables", establecimiento: "Food Hub", distancia: 3.8, caducidad: "Feb 20, 2025", estado: "Reservado", cantidad: "40 bags", ubicacion: "258 Willow Dr, San Francisco, CA", fechaPublicacion: "Dec 18, 2024", descripcion: "Frozen vegetables.", imagen: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop" },
  ]);

  const itemsPerPage = 5;

  // Filtro por búsqueda y por pestaña activa
  const filteredDonations = donations.filter((donation) => {
    const matchesSearch = 
      donation.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.establecimiento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "disponibles" 
        ? donation.estado === "Disponible"
        : donation.estado === "Reservado";
    
    return matchesSearch && matchesTab;
  });

  // Esto es para ordenar distancia, fecha y estado
  const sortedDonations = [...filteredDonations];

  sortedDonations.sort((a, b) => {
    const dateA = new Date(a.caducidad).getTime();
    const dateB = new Date(b.caducidad).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  if (distanceSort) {
    sortedDonations.sort((a, b) => {
      const distA = a.distancia ?? 999;
      const distB = b.distancia ?? 999;
      return distanceSort === "asc" ? distA - distB : distB - distA;
    });
  }

  if (statusSort) {
    sortedDonations.sort((a, b) => {
      return statusSort === "asc"
        ? a.estado.localeCompare(b.estado)
        : b.estado.localeCompare(a.estado);
    });
  }

  // Paginación
  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonations = sortedDonations.slice(startIndex, startIndex + itemsPerPage);

  const toggleDateSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setDistanceSort(null);
    setStatusSort(null);
  };

  const toggleDistanceSort = () => {
    setDistanceSort(distanceSort === "asc" ? "desc" : distanceSort === "desc" ? null : "asc");
    setSortOrder("asc");
    setStatusSort(null);
  };

  const toggleStatusSort = () => {
    setStatusSort(statusSort === "asc" ? "desc" : statusSort === "desc" ? null : "asc");
    setSortOrder("asc");
    setDistanceSort(null);
  };

  const handleReserve = () => {
    if (selectedDonation) {
      setDonations(donations.map((d) =>
        d.id === selectedDonation.id
          ? { ...d, estado: d.estado === "Disponible" ? "Reservado" : "Disponible" }
          : d
      ));
      setSelectedDonation({
        ...selectedDonation,
        estado: selectedDonation.estado === "Disponible" ? "Reservado" : "Disponible",
      });
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-amber-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-gray-800">Banco de Alimentos</h1>
          <p className="text-gray-600 mt-1">Administra tus donaciones de comida</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-4 items-center">
          <button
            onClick={() => {
              setActiveTab("disponibles");
              setCurrentPage(1);
            }}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
              activeTab === "disponibles"
                ? "bg-green-700 text-white shadow-md"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-green-300"
            }`}
          >
            Donaciones Disponibles
          </button>
          
          <button
            onClick={() => {
              setActiveTab("reservadas");
              setCurrentPage(1);
            }}
            className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
              activeTab === "reservadas"
                ? "bg-yellow-600 text-white shadow-md"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-yellow-300"
            }`}
          >
            Donaciones Reservadas
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {activeTab === "disponibles" 
              ? "Alimentos listos para recoger de establecimientos locales"
              : "Alimentos que ya has reservado"}
          </p>
        </div>

        {/* Barra de busqueda */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por producto o establecimiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-green-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wide">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wide">
                  Establecimiento
                </th>

                {/* Distancia */}
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wide">
                  <button
                    onClick={toggleDistanceSort}
                    className="flex items-center gap-2 hover:text-green-700"
                  >
                    Distancia
                    <span>{distanceSort === "asc" ? "▲" : distanceSort === "desc" ? "▼" : "—"}</span>
                  </button>
                </th>

                {/* Fecha */}
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wide">
                  <button
                    onClick={toggleDateSort}
                    className="flex items-center gap-2 hover:text-green-700"
                  >
                    Fecha Caducidad
                    <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                  </button>
                </th>

                {/* Estado */}
                <th className="px-6 py-4 text-left text-sm font-bold text-green-800 uppercase tracking-wide">
                  <button
                    onClick={toggleStatusSort}
                    className="flex items-center gap-2 hover:text-green-700"
                  >
                    Estado
                    <span>{statusSort === "asc" ? "▲" : statusSort === "desc" ? "▼" : "—"}</span>
                  </button>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedDonations.map((donation) => (
                <tr
                  key={donation.id}
                  onClick={() => setSelectedDonation(donation)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">{donation.producto}</td>
                  <td className="px-6 py-4 text-gray-600">{donation.establecimiento}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {donation.distancia ? `${donation.distancia} Km` : "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{donation.caducidad}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-lg text-sm font-medium ${
                        donation.estado === "Disponible"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {donation.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-600">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(startIndex + itemsPerPage, sortedDonations.length)} de{" "}
              {sortedDonations.length} donaciones
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === page
                      ? "bg-green-700 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedDonation.imagen}
                alt={selectedDonation.producto}
                className="w-full h-64 object-cover rounded-t-2xl"
              />

              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedDonation(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                ✖
              </button>

              {/* Estado */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedDonation.estado === "Disponible"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedDonation.estado}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedDonation.producto}
              </h2>
              <p className="text-gray-600 mb-6">{selectedDonation.descripcion}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Cantidad</p>
                  <p className="text-gray-800 font-semibold">{selectedDonation.cantidad}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Fecha Caducidad</p>
                  <p className="text-gray-800 font-semibold">{selectedDonation.caducidad}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Establecimiento</p>
                  <p className="text-gray-800 font-semibold">
                    {selectedDonation.establecimiento}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Distancia</p>
                  <p className="text-gray-800 font-semibold">
                    {selectedDonation.distancia
                      ? `${selectedDonation.distancia} Km`
                      : "No especificada"}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-gray-500 uppercase mb-1">Ubicación</p>
                  <p className="text-gray-800 font-semibold">
                    📍 {selectedDonation.ubicacion}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Publicado</p>
                  <p className="text-gray-800 font-semibold">
                    {selectedDonation.fechaPublicacion}
                  </p>
                </div>
              </div>

              <button
                onClick={handleReserve}
                className={`w-full py-3 rounded-lg text-lg font-medium shadow-md hover:shadow-lg ${
                  selectedDonation.estado === "Disponible"
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
              >
                {selectedDonation.estado === "Disponible"
                  ? "Reservar Donación"
                  : "Cancelar Reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;