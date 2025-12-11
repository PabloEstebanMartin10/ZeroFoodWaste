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
//const MOCK_URL = "http://localhost:5173";

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

  const [newDonation, setNewDonation] = useState<Donation>({
    productName: "",
    quantity: 0,
    unit: "",
    expirationDate: "",
    status: "Disponible",
    description: "",
    establishment: { id: 1 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    photoUrl: "",
  });

  // Fetch inicial
  useEffect(() => {
    const establishmentId = 1;
    const url = `${BASE_URL}/donations/establishment/${establishmentId}`;
    // const url = `${MOCK_URL}/data/donaciones_comercio.json`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const fixedData = data.map((d) => ({
          ...d,
          status: mapStatusFromBackend[d.status], // ⬅ convierte backend → frontend
        }));
        setDonations(fixedData);
      })

      .catch((err) => console.error("Error cargando donaciones:", err));
  }, []);

  //Fetch prueba usuarios
  /*useEffect(() => {
    // 1️⃣ Obtener usuario logueado
    fetch(`${BASE_URL}/users/me`)
      .then((res) => res.json())
      .then((user) => {
        console.log("Usuario recibido:", user); // 👈 Aquí
        // Guardamos el establecimiento del usuario
        setUserEstablishment(user.establishment);

        if (!user.establishment?.id) return [];

        // 2️⃣ Obtener donaciones de ese establecimiento
        return fetch(
          `${BASE_URL}/donations/establishment/${user.establishment.id}`
        ).then((res) => res.json());
      })
      .then((donations) => {
        if (donations) setDonations(donations);
      })
      .catch((err) => console.error("Error cargando donaciones:", err));
  }, []);*/

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
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(2, "0")}`;
      setFormData({ ...formData, [name]: formattedDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = () => {
    if (!formData || !formData.id) return;

    // Formatear fecha para LocalDateTime
    const date = new Date(formData.expirationDate);
    const expirationDateFormatted = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      expirationDate: expirationDateFormatted,
      status: mapStatusToBackend[formData.status] || "AVAILABLE",
      establishment: { id: formData.establishment?.id || 1 },
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

  /*const handleNewDonationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewDonation((prev) => ({ ...prev, [name]: value }));
  };*/

  const resetNewDonation = () => {
    setNewDonation({
      productName: "",
      quantity: 0,
      unit: "",
      expirationDate: "",
      status: "Disponible",
      description: "",
      establishment: { id: 1 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: "",
    });
  };

  const handleCreateDonation = () => {
    if (!newDonation.productName || newDonation.quantity <= 0) {
      alert("Por favor completa el nombre del producto y la cantidad.");
      return;
    }

    const donationToSend = {
      productName: newDonation.productName,
      description: newDonation.description || "",
      quantity: Number(newDonation.quantity), // asegúrate de que sea number
      unit: newDonation.unit || "",
      expirationDate: newDonation.expirationDate.includes("T")
        ? newDonation.expirationDate
        : `${newDonation.expirationDate}T00:00:00`,
      status: mapStatusToBackend[newDonation.status] || "AVAILABLE",
      establishmentId: newDonation.establishment?.id || 1,
    };

    console.log("Enviando donación:", donationToSend);
    console.log(JSON.stringify(donationToSend, null, 2));

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
  if (!window.confirm("¿Estás seguro de que quieres eliminar esta donación?")) {
    return;
  }

  // Obtener índice REAL dentro de donations[]
  const realIndex = donations.findIndex((d) => d === donationsList[index]);
  const donation = donations[realIndex];

  if (!donation?.id) {
    console.error("Donación sin ID, no se puede eliminar");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080//donations/${donation.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Error backend al eliminar: ${res.status}`);
    }

    // Eliminar del estado
    setDonations((prev) => prev.filter((d) => d.id !== donation.id));

  } catch (err) {
    console.error(err);
    alert("Hubo un problema eliminando la donación.");
  }
};


  return (
    <div className="min-h-screen bg-amber-50 p-10">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Burger King</h1>
          <p className="text-gray-600">Administra tus donaciones de comida</p>
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
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Cantidad</th>
                  <th className="py-3 px-4">Fecha Caducidad</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Detalles</th>
                  <th className="py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {donationsList.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
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
                        onClick={() => openModal(i)}
                        className="text-green-700 font-semibold hover:underline"
                      >
                        Ver Detalles
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDeleteDonation(i)}
                        className="text-red-600 font-semibold hover:text-red-800 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
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
                {donationsCompletadas.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">
                      {item.productName}
                    </td>
                    <td className="py-4 px-4">{item.quantity}</td>
                    <td className="py-4 px-4">
                      {item.establishment?.name || "—"}
                    </td>
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
                ))}
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
                        {formData.establishment?.name || "—"}
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
                      <option value="Completado">Completado</option>
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
                  <div>
                    <label className="font-semibold">Producto</label>
                    <input
                      type="text"
                      name="productName"
                      value={newDonation.productName}
                      onChange={(e) =>
                        setNewDonation((prev) => ({
                          ...prev,
                          productName: e.target.value,
                        }))
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Cantidad</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newDonation.quantity}
                      onChange={(e) =>
                        setNewDonation((prev) => ({
                          ...prev,
                          quantity: Number(e.target.value),
                        }))
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Unidades</label>
                    <select
                      name="unit"
                      value={newDonation.unit}
                      onChange={(e) =>
                        setNewDonation((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }))
                      }
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
                      value={newDonation.expirationDate}
                      onChange={(e) =>
                        setNewDonation((prev) => ({
                          ...prev,
                          expirationDate: e.target.value,
                        }))
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="font-semibold">Descripción</label>
                    <textarea
                      name="description"
                      value={newDonation.description}
                      onChange={(e) =>
                        setNewDonation((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border rounded-md"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleCreateDonation}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
