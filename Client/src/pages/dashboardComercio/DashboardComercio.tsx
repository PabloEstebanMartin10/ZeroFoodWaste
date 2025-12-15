import { useEffect, useState } from "react";

interface Donation {
  id?: number;
  productName: string;
  quantity: number;
  unit?: string;
  expirationDate: string;
  status: "Disponible" | "Reservado" | "Completado";
  description?: string;
  establishment?: { id: number; name?: string };
  createdAt?: string;
  updatedAt?: string;
  photoUrl?: string;
  foodBank?: string;
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

export default function DashboardComercio() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonationIndex, setSelectedDonationIndex] = useState<
    number | null
  >(null);
  const [formData, setFormData] = useState<Donation | null>(null);

  const [activeTab, setActiveTab] = useState<"donaciones" | "registro">(
    "donaciones"
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ✅ NUEVO: Estado para el ID dinámico
  const [establishmentId, setEstablishmentId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. Función de validación (Reemplaza tu actual lógica dentro de handleCreateDonation)
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newDonation.productName.trim()) {
      newErrors.productName = "El nombre del producto es obligatorio.";
    }

    if (!newDonation.quantity) {
      newErrors.quantity = "La cantidad es obligatoria.";
    } else if (newDonation.quantity <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0.";
    }

    if (!newDonation.unit) {
      newErrors.unit = "Debes seleccionar una unidad.";
    }

    if (!newDonation.expirationDate) {
      newErrors.expirationDate = "La fecha es obligatoria.";
    }

    setErrors(newErrors);
    // Devuelve true si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  // Estado para nueva donación (inicialmente vacío hasta tener el ID)
  const [newDonation, setNewDonation] = useState<Donation>({
    productName: "",
    quantity: 0,
    unit: "",
    expirationDate: "",
    status: "Disponible",
    description: "",
    establishment: { id: 0 }, // Se actualizará cuando cargue el ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    photoUrl: "",
  });

  // ============================
  // 1. CARGAR ID DEL USUARIO (localStorage)
  // ============================
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          // Buscamos establishmentId o el id genérico
          const currentId = userObj.establishmentId || userObj.id;

          if (currentId) {
            setEstablishmentId(currentId);
            // Actualizamos el estado inicial de newDonation con el ID correcto
            setNewDonation((prev) => ({
              ...prev,
              establishment: { id: currentId },
            }));
          } else {
            console.error(
              "No se encontró establishmentId en el usuario logueado"
            );
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
  // 2. FETCH DE DONACIONES (Depende del ID)
  // ============================
  useEffect(() => {
    // Solo ejecutamos si ya tenemos el ID
    if (establishmentId > 0) {
      const url = `${BASE_URL}/donations/establishment/${establishmentId}`;
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Error fetching");
          return res.json();
        })
        .then((data) => {
          const fixedData = data.map((d: any) => ({
            ...d,
            status: mapStatusFromBackend[d.status], // ⬅ convierte backend → frontend
          }));
          setDonations(fixedData);
        })
        .catch((err) => {
          console.error("Error cargando donaciones:", err);
          setDonations([]); // Limpiar en caso de error
        });
    }
  }, [establishmentId]); // Se ejecuta cuando el ID cambia (de 0 al real)

  // Filtrado
  const donationsList = donations.filter((d) => d.status !== "Completado");
  const donationsCompletadas = donations.filter(
    (d) => d.status === "Completado"
  );

  const openModal = (index: number) => {
    const realIndex =
      activeTab === "donaciones"
        ? donations.findIndex((d) => d === donationsList[index])
        : donations.findIndex((d) => d === donationsCompletadas[index]);

    setSelectedDonationIndex(realIndex);
    setFormData(donations[realIndex]);
  };

  const closeModal = () => {
    setSelectedDonationIndex(null);
    setFormData(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!formData) return;
    const { name, value } = e.target;

    if (name === "expirationDate") {
      // Convertimos la fecha del input (yyyy-MM-dd) a LocalDateTime
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(
          2,
          "0"
        )}T00:00:00`;
        setFormData({ ...formData, [name]: formattedDate });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCompleteDonation = async (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.stopPropagation();
    // 1. Identificar la donación correcta desde la lista filtrada
    const realIndex = donations.findIndex((d) => d === donationsList[index]);
    const donation = donations[realIndex];

    if (!donation || !donation.id) return;

    // 2. Preparar payload (asegurando formato de fecha como en handleSave)
    const date = new Date(donation.expirationDate);
    const expirationDateFormatted = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T00:00:00`;

    const payload = {
      ...donation,
      quantity: Number(donation.quantity),
      expirationDate: expirationDateFormatted,
      status: "COMPLETED", // Forzamos el estado a COMPLETED
    };

    try {
      // 3. Petición al Backend
      const res = await fetch(`${BASE_URL}/donations/${donation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error en backend: ${res.status}`);

      const updated = await res.json();

      // 4. Actualizar estado local (esto moverá el item de tabla automáticamente)
      const fixedDonation = {
        ...updated,
        status: "Completado", // Mapeo manual para frontend inmediato
      };

      setDonations((prev) =>
        prev.map((d) => (d.id === fixedDonation.id ? fixedDonation : d))
      );
    } catch (err) {
      console.error("Error completando donación:", err);
      alert("Error al completar la donación.");
    }
  };

  const handleSave = () => {
    if (!formData || !formData.id) return;

    // Formatear fecha para LocalDateTime si es necesario
    const date = new Date(formData.expirationDate);
    const expirationDateFormatted = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T00:00:00`; // Simplificamos la hora para evitar problemas

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      expirationDate: expirationDateFormatted,
      status: mapStatusToBackend[formData.status] || "AVAILABLE",
    };

    fetch(`${BASE_URL}/donations/${formData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error en backend: ${res.status}`);
        return res.json();
      })
      .then((updated) => {
        const fixedDonation = {
          ...updated,
          status: mapStatusFromBackend[updated.status] || "Disponible",
        };
        setDonations((prev) =>
          prev.map((d) => (d.id === fixedDonation.id ? fixedDonation : d))
        );
        closeModal();
      })
      .catch((err) => console.error("Error modificando donación:", err));
  };

  const resetNewDonation = () => {
    setNewDonation({
      productName: "",
      quantity: 0,
      unit: "",
      expirationDate: "",
      status: "Disponible",
      description: "",
      establishment: { id: establishmentId }, // ✅ Mantenemos el ID correcto
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: "",
    });
  };

  const handleCreateDonation = () => {
    if (!validateForm()) return;

    const donationToSend = {
      productName: newDonation.productName,
      description: newDonation.description || "",
      quantity: Number(newDonation.quantity),
      unit: newDonation.unit || "",
      expirationDate: newDonation.expirationDate.includes("T")
        ? newDonation.expirationDate
        : `${newDonation.expirationDate}T00:00:00`,
      status: mapStatusToBackend[newDonation.status] || "AVAILABLE",
      // ✅ USAMOS EL ID DINÁMICO
      establishmentId: establishmentId.toString(),
    };

    console.log("Enviando donación:", donationToSend);

    fetch(`${BASE_URL}/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error en backend: ${res.status}`);
        return res.json();
      })
      .then((savedDonation) => {
        const fixedDonation = {
          ...savedDonation,
          status: mapStatusFromBackend[savedDonation.status] || "Disponible",
        };
        setDonations((prev) => [...prev, fixedDonation]);
        setShowCreateModal(false);
        resetNewDonation();
      })
      .catch((err) => console.error("Error creando donación:", err));
  };

  const handleDeleteDonation = async (index: number) => {
    const realIndex = donations.findIndex((d) => d === donationsList[index]);
    const donation = donations[realIndex];

    if (!donation?.id) {
      console.error("Donación sin ID, no se puede eliminar");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/donations/${donation.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Error backend al eliminar: ${res.status}`);
      }

      setDonations((prev) => prev.filter((d) => d.id !== donation.id));
    } catch (err) {
      console.error(err);
      alert("Hubo un problema eliminando la donación.");
    }
  };

  if (loading && establishmentId === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 text-gray-500">
        Cargando comercio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-10">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Mi Comercio</h1>
          <p className="text-gray-600">
            Administra tus donaciones de comida{" "}
            {establishmentId > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                ID: {establishmentId}
              </span>
            )}
          </p>
        </div>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "donaciones"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("donaciones")}
          >
            Tus Donaciones
          </button>

          <button
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "registro"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("registro")}
          >
            Registro de Donaciones
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-20 rounded-lg shadow-md transition whitespace-nowrap"
        >
          Crear Nueva Donación
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-1">
          {activeTab === "donaciones"
            ? "Tus Donaciones"
            : "Registro de Donaciones"}
        </h2>

        <div className="overflow-x-auto">
          {activeTab === "donaciones" && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-left text-gray-600 uppercase text-sm">
                  <th className="py-3 px-4 w-1/6">Producto</th>
                  <th className="py-3 px-4 w-1/6">Cantidad</th>
                  <th className="py-3 px-4 w-1/6">Fecha Caducidad</th>
                  <th className="py-3 px-4 w-1/6">Estado</th>
                  <th className="py-3 px-4 w-2/6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {donationsList.length > 0 ? (
                  donationsList.map((item, i) => (
                    <tr
                      key={i}
                      onClick={() => openModal(i)}
                      className="border-b hover:bg-gray-50 hover:cursor-pointer"
                    >
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
                          className={`px-3 py-1 rounded-full font-semibold ${
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

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Botón Completar (Estilo Esmeralda Suave) */}
                          <button
                            onClick={(e) => handleCompleteDonation(e, i)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all shadow-sm"
                            title="Marcar como completado"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs font-medium">
                              Completar
                            </span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(i);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all shadow-sm"
                            title="Editar detalles"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                            </svg>
                            <span className="text-xs font-medium">Editar</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Detiene la propagación
                              handleDeleteDonation(i);
                            }}
                            className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar donación"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No hay donaciones activas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === "registro" && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-left text-gray-600 uppercase text-sm">
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Cantidad</th>
                  <th className="py-3 px-4">Establecimiento</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {donationsCompletadas.length > 0 ? (
                  donationsCompletadas.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">
                        {item.productName}
                      </td>
                      <td className="py-4 px-4">{item.quantity}</td>
                      <td className="py-4 px-4">{item.foodBank || "—"}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
                          Completado
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => openModal(i)}
                          className="text-green-700 font-semibold hover:underline"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No hay donaciones completadas aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL EDICIÓN */}
      {selectedDonationIndex !== null && formData && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
            onClick={closeModal}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg max-w-xl w-full shadow-lg overflow-auto max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{formData.productName}</h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.status === "Disponible"
                        ? "bg-green-100 text-green-700"
                        : formData.status === "Reservado"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {formData.status}
                  </span>
                </div>

                <p className="text-gray-600">{formData.description}</p>

                <hr />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="font-semibold">Cantidad</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="0"
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Unidades</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">—</option>
                      <option value="Unidades">Unidades</option>
                      <option value="Litros">Litros</option>
                      <option value="Kg">Kg</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold">Fecha Caducidad</label>
                    <input
                      type="date"
                      name="expirationDate"
                      value={formData.expirationDate.split("T")[0]}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  {(formData.status === "Reservado" ||
                    formData.status === "Completado") && (
                    <div>
                      <label className="font-semibold">Banco que reservó</label>
                      <p className="px-3 py-2 border rounded-md bg-gray-100 text-gray-700">
                        {formData.foodBank || "—"}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="font-semibold">Estado</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Reservado">Reservado</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border rounded-md"
                  >
                    Cerrar
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Modificar Donación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL NUEVA DONACIÓN */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
            onClick={() => setShowCreateModal(false)}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg max-w-xl w-full shadow-lg overflow-auto max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <div className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-green-700">
                  Crear Nueva Donación
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* CAMPO PRODUCTO */}
                  <div>
                    <label className="font-semibold block mb-1">
                      Producto <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newDonation.productName}
                        onChange={(e) => {
                          setNewDonation((prev) => ({
                            ...prev,
                            productName: e.target.value,
                          }));
                          if (errors.productName)
                            setErrors((prev) => ({ ...prev, productName: "" })); // Limpiar error al escribir
                        }}
                        className={`w-full border rounded-md px-3 py-2 ${
                          errors.productName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Ej: Manzanas"
                      />
                      {/* Icono de exclamación si hay error */}
                      {errors.productName && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.productName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.productName}
                      </p>
                    )}
                  </div>

                  {/* CAMPO FECHA */}
                  <div>
                    <label className="font-semibold block mb-1">
                      Fecha Caducidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newDonation.expirationDate}
                      onChange={(e) => {
                        setNewDonation((prev) => ({
                          ...prev,
                          expirationDate: e.target.value,
                        }));
                        if (errors.expirationDate)
                          setErrors((prev) => ({
                            ...prev,
                            expirationDate: "",
                          }));
                      }}
                      className={`w-full border rounded-md px-3 py-2 ${
                        errors.expirationDate
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.expirationDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.expirationDate}
                      </p>
                    )}
                  </div>

                  {/* CAMPO CANTIDAD */}
                  <div>
                    <label className="font-semibold block mb-1">
                      Cantidad <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newDonation.quantity}
                        onChange={(e) => {
                          setNewDonation((prev) => ({
                            ...prev,
                            quantity: Number(e.target.value),
                          }));
                          if (errors.quantity)
                            setErrors((prev) => ({ ...prev, quantity: "" }));
                        }}
                        className={`w-full border rounded-md px-3 py-2 ${
                          errors.quantity
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.quantity && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  {/* CAMPO UNIDADES */}
                  <div>
                    <label className="font-semibold block mb-1">
                      Unidades <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newDonation.unit}
                      onChange={(e) => {
                        setNewDonation((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }));
                        if (errors.unit)
                          setErrors((prev) => ({ ...prev, unit: "" }));
                      }}
                      className={`w-full border rounded-md px-3 py-2 ${
                        errors.unit
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">— Seleccionar —</option>
                      <option value="Unidades">Unidades</option>
                      <option value="Litros">Litros</option>
                      <option value="Kg">Kg</option>
                    </select>
                    {errors.unit && (
                      <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                    )}
                  </div>

                  {/* CAMPO DESCRIPCION (Opcional, sin validación) */}
                  <div className="col-span-2">
                    <label className="font-semibold block mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={newDonation.description}
                      onChange={(e) =>
                        setNewDonation((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setErrors({}); // Limpiar errores al cerrar
                    }}
                    className="px-6 py-2 border rounded-md hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleCreateDonation}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-md"
                  >
                    Crear Donación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
