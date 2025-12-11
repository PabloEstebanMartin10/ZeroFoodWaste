import { useEffect, useState } from "react";

interface Donation {
  id: number;
  productName: string;
  quantity: number;
  unit?: string;
  expirationDate: string;
  status: "Disponible" | "Reservado" | "Completado";
  description?: string;
  establishment?: { id: number; name?: string };
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
const MY_FOODBANK_ID = 1;

export default function DashboardBanco() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"disponibles" | "reservadas">(
    "disponibles"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ============================
  // FETCH DONACIONES SEGÚN STATUS
  // ============================
  const fetchDonations = async (): Promise<Donation[]> => {
    try {
      let url = `${BASE_URL}/donations?status=AVAILABLE`;

      if (activeTab === "reservadas") {
        url = `${BASE_URL}/donations/reserved?foodBankId=${MY_FOODBANK_ID}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      // Mapear estados y filtrar duplicados
      const donationsMap: Record<number, Donation> = {};
      data.forEach((d: any) => {
        donationsMap[d.id] = {
          ...d,
          status: d.status ? mapStatusFromBackend[d.status] : "Disponible",
        };
      });

      const donationsList: Donation[] = Object.values(donationsMap);
      setDonations(donationsList);
      return donationsList;
    } catch (err) {
      console.error("Error cargando donaciones:", err);
      return [];
    }
  };

  // ============================
  // RESERVAR / CANCELAR
  // ============================
  const toggleReservation = async () => {
    if (!selectedDonation) return;

    try {
      let res: Response;

      if (selectedDonation.status === "Disponible") {
        // RESERVAR
        res = await fetch(
          `${BASE_URL}/donations/${selectedDonation.id}/accept/${MY_FOODBANK_ID}`,
          { method: "POST" }
        );
      } else if (selectedDonation.status === "Reservado") {
        // CANCELAR
        res = await fetch(
          `${BASE_URL}/donations/${selectedDonation.id}/cancel/${MY_FOODBANK_ID}`,
          { method: "POST" } // revisar si tu backend requiere DELETE
        );
      } else {
        return; // no hacemos nada si es "Completado"
      }

      if (!res.ok) throw new Error("Error en la petición");

      // ===== Actualizamos localmente =====
      setDonations((prev) => {
        const updated = prev.map((d) => {
          if (d.id === selectedDonation.id) {
            if (d.status === "Disponible") return { ...d, status: "Reservado" };
            if (d.status === "Reservado") return { ...d, status: "Disponible" };
          }
          return d;
        });

        // filtramos según el tab activo
        if (activeTab === "disponibles") {
          return updated.filter((d) => d.status === "Disponible");
        }
        if (activeTab === "reservadas") {
          return updated.filter((d) => d.status === "Reservado");
        }
        return updated;
      });

      // actualizamos el modal
      setSelectedDonation((prev) => {
        if (!prev) return null;
        if (prev.status === "Disponible")
          return { ...prev, status: "Reservado" };
        if (prev.status === "Reservado")
          return { ...prev, status: "Disponible" };
        return prev;
      });
    } catch (err) {
      console.error("Error al cambiar estado de la donación:", err);
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
    fetchDonations();
    setCurrentPage(1);
  }, [activeTab]);

  // ============================
  // RENDER
  // ============================
  return (
    <div className="min-h-screen bg-amber-50 p-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Banco de Alimentos</h1>
        <p className="text-gray-600">Gestiona las donaciones disponibles</p>
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
              {paginatedDonations.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{item.productName}</td>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
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
      </div>

      {/* MODAL */}
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
                  {selectedDonation.establishment?.name || "—"}
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
    </div>
  );
}
