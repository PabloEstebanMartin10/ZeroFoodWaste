import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

interface Donation {
  id: number;
  productName: string;
  quantity: number;
  unit?: string;
  expirationDate: string;
  status: "Disponible" | "Reservado" | "Completado";
  description?: string;
  establishment?: string;
  assignmentId?: number;
}

const mapStatusToBackend: Record<string, string> = {
  Disponible: "AVAILABLE",
  Reservado: "RESERVED",
  Completado: "COMPLETED",
};

const mapStatusFromBackend: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Reservado",
  COMPLETED: "Completado",
};

const BASE_URL = "http://localhost:8080";

export default function DashboardBanco() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"disponibles" | "reservadas">(
    "disponibles"
  );

  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext missing");
  const { entity } = auth;

  // ESTADO: Controla la visibilidad del cartel
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // ESTADO: Controla el TEXTO del cartel
  const [notification, setNotification] = useState({ title: "", body: "" });

  const [foodBankId, setFoodBankId] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          const currentId = userObj.foodBankId || userObj.id;

          if (currentId) {
            setFoodBankId(currentId);
          } else {
            console.error("No se encontró foodBankId en el usuario logueado");
          }
        }
      } catch (error) {
        console.error("Error leyendo localStorage:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // ============================
  // FETCH DONACIONES
  // ============================
  const fetchDonations = async () => {
    if (!foodBankId) return;
    try {
      let url = `${BASE_URL}/donations?status=AVAILABLE`;

      if (activeTab === "reservadas") {
        url = `${BASE_URL}/donations/reserved?foodBankId=${foodBankId}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error fetching data");

      const data = await res.json();

      const donationsMap: Record<number, Donation> = {};
      data.forEach((d: any) => {
        donationsMap[d.id] = {
          ...d,
          status: d.status ? mapStatusFromBackend[d.status] : "Disponible",
        };
      });

      const donationsList: Donation[] = Object.values(donationsMap);
      setDonations(donationsList);
    } catch (err) {
      console.error("Error cargando donaciones:", err);
      setDonations([]);
    }
  };

  // ============================
  // RESERVAR / CANCELAR
  // ============================
  const toggleReservation = async () => {
    if (!selectedDonation || !foodBankId) return;

    const isReserving = selectedDonation.status === "Disponible";

    let url = "";
    if (isReserving) {
      url = `${BASE_URL}/donations/${selectedDonation.id}/accept/${foodBankId}`;
    } else if (selectedDonation.status === "Reservado") {
      url = `${BASE_URL}/donations/${selectedDonation.id}/cancel/${foodBankId}`;
    } else {
      return;
    }

    try {
      const res = await fetch(url, { method: "POST" });

      if (!res.ok) {
        throw new Error("La respuesta del servidor no fue exitosa");
      }

      setDonations((prev) => {
        const updated = prev.map((d) => {
          if (d.id === selectedDonation.id) {
            if (d.status === "Disponible") return { ...d, status: "Reservado" };
            if (d.status === "Reservado") return { ...d, status: "Disponible" };
          }
          return d;
        });

        if (activeTab === "disponibles") {
          return updated.filter((d) => d.status === "Disponible");
        }
        if (activeTab === "reservadas") {
          return updated.filter((d) => d.status === "Reservado");
        }
        return updated;
      });

      // ===== LÓGICA DE UI =====
      if (isReserving) {
        setNotification({
          title: "¡Acción Completada!",
          body: "La donación ha sido reservada con éxito.",
        });
      } else {
        setNotification({
          title: "Reserva Cancelada",
          body: "La donación vuelve a estar disponible.",
        });
      }

      setSelectedDonation(null); // Cerrar Modal
      setShowSuccessMessage(true); // Mostrar Cartel
      setTimeout(() => setShowSuccessMessage(false), 1000); // Ocultar a los 3s

    } catch (err) {
      console.error("Error al cambiar estado de la donación:", err);
      alert(
        "No se pudo realizar la acción. Verifica si la donación sigue disponible."
      );
    }
  };

  // ============================
  // ORDENACIÓN
  // ============================
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "productName", direction: "asc" });

  const sortedDonations = [...donations].sort((a, b) => {
    const key = sortConfig.key as keyof Donation;
    let aVal = a[key] ?? "";
    let bVal = b[key] ?? "";

    if (key === "expirationDate") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ============================
  // PAGINACIÓN
  // ============================
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDonations = sortedDonations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(sortedDonations.length / ITEMS_PER_PAGE);

  // ============================
  // USE EFFECTS
  // ============================
  useEffect(() => {
    if (foodBankId > 0) {
      fetchDonations();
    }
    setCurrentPage(1);
  }, [activeTab, foodBankId]);

  if (loading && foodBankId === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 text-gray-500">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-10 relative">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">{entity?.name}</h1>
        <p className="text-gray-600">
          Gestiona las donaciones disponibles
        </p>
      </header>

      {/* TABS */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "disponibles"
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("disponibles")}
        >
          Donaciones Disponibles
        </button>

        <button
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "reservadas"
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("reservadas")}
        >
          Mis Reservas
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-3">
          {activeTab === "disponibles"
            ? "Donaciones Disponibles"
            : "Mis Reservas"}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100 text-left text-gray-600 uppercase text-sm">
                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("productName")}
                >
                  Producto
                </th>
                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("quantity")}
                >
                  Cantidad
                </th>
                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("expirationDate")}
                >
                  Caducidad
                </th>
                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Estado
                </th>
                <th className="py-3 px-4">Detalles</th>
              </tr>
            </thead>

            <tbody>
              {paginatedDonations.length > 0 ? (
                paginatedDonations.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">
                      {item.productName}
                    </td>
                    <td className="py-4 px-4">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-4 px-4">
                      {new Date(item.expirationDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "Disponible"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Reservado"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedDonation(item)}
                        className="text-green-700 font-semibold hover:underline"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No hay donaciones en esta sección.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="font-semibold">
              Página {currentPage} de {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE DETALLES */}
      {selectedDonation && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setSelectedDonation(null)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg max-w-xl w-full shadow-lg relative p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedDonation(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-3">
                {selectedDonation.productName}
              </h2>

              <p className="text-gray-600 mb-4">
                {selectedDonation.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <p>
                  <strong>Cantidad:</strong> {selectedDonation.quantity}{" "}
                  {selectedDonation.unit}
                </p>
                <p>
                  <strong>Caducidad:</strong>{" "}
                  {new Date(
                    selectedDonation.expirationDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Estado:</strong> {selectedDonation.status}
                </p>
                <p>
                  <strong>Comercio:</strong>{" "}
                  {selectedDonation.establishment || "—"}
                </p>
              </div>

              <button
                onClick={toggleReservation}
                className={`w-full py-3 rounded-lg text-white font-semibold ${
                  selectedDonation.status === "Disponible"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {selectedDonation.status === "Disponible"
                  ? "Reservar Donación"
                  : "Cancelar Reserva"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- CARTEL CENTRAL MODERNO (NUEVO DISEÑO) --- */}
      {showSuccessMessage && (
        <>
          {/* Fondo desenfocado detrás del cartel */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity" />

          {/* El Cartel */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-4 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-green-50">
              
              {/* Decoración de fondo sutil */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-green-100 rounded-full opacity-50 blur-2xl"></div>

              {/* Icono Grande */}
              <div className="mb-5 p-4 bg-green-100 rounded-full relative z-10">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>

              {/* Textos */}
              <h3 className="text-2xl font-extrabold text-gray-800 mb-3 relative z-10">
                {notification.title}
              </h3>
              <p className="text-gray-600 font-medium relative z-10 leading-relaxed">
                {notification.body}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}