import React, { useState } from "react";

interface Donation {
  product: string;
  quantity: number;
  unit?: string;
  expiration: string;
  status: "Disponible" | "Reservado" | "Completado";
  description?: string;
  establishment?: string;
  location?: string;
  listedDate?: string;
  imageUrl?: string;
}

const donationsData: Donation[] = [
  {
    product: "Pan",
    quantity: 24,
    unit: "unidades",
    expiration: "Dec 28, 2024",
    status: "Disponible",
    description:
      "Pan artesanal horneado diariamente. Perfecta condición, acercándose a la fecha de caducidad.",
    establishment: "Burger King",
    location: "123 Main St, San Francisco, CA",
    listedDate: "Dec 20, 2024",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
  },
  {
    product: "Verduras",
    quantity: 15,
    unit: "Kg",
    expiration: "Dec 26, 2024",
    status: "Reservado",
  },
  {
    product: "Leche",
    quantity: 30,
    unit: "Litros",
    expiration: "Dec 25, 2024",
    status: "Completado",
  },
  {
    product: "Queso",
    quantity: 50,
    expiration: "Mar 15, 2025",
    status: "Disponible",
  },
  {
    product: "Fruta",
    quantity: 20,
    expiration: "2024-12-24",
    status: "Disponible",
  },
];

export default function DashboardComercio() {
  const [donations, setDonations] = useState<Donation[]>(donationsData);
  const [selectedDonationIndex, setSelectedDonationIndex] = useState<
    number | null
  >(null);
  const [formData, setFormData] = useState<Donation | null>(null);

  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState<"donaciones" | "registro">(
    "donaciones"
  );

  // Modal de nueva donación
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Datos del formulario de nueva donación
  const [newDonation, setNewDonation] = useState<Donation>({
    product: "",
    quantity: 0,
    unit: "",
    expiration: "",
    status: "Disponible", // por defecto
    description: "",
    establishment: "", // NO se usa aquí, lo rellena el banco al reservar
    location: "",
    listedDate: new Date().toISOString().split("T")[0], // fecha de hoy
    imageUrl: "",
  });

  // Filtrados
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

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (selectedDonationIndex === null || !formData) return;
    const updatedDonations = [...donations];
    updatedDonations[selectedDonationIndex] = formData;
    setDonations(updatedDonations);
    closeModal();
  };

  const handleNewDonationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "quantity") {
    const numValue = Number(value);
    if (numValue < 0) return; // No permitir valores negativos
  }

    setNewDonation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateDonation = () => {
    setDonations((prev) => [...prev, newDonation]);

    // Cerrar modal
    setShowCreateModal(false);

    // Reset form
    setNewDonation({
      product: "",
      quantity: 0,
      unit: "",
      expiration: "",
      status: "Disponible",
      description: "",
      establishment: "",
      location: "",
      listedDate: new Date().toISOString().split("T")[0],
      imageUrl: "",
    });
  };

  const handleDeleteDonation = (index: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta donación?')) {
      const realIndex = donations.findIndex((d) => d === donationsList[index]);
      setDonations(donations.filter((_, i) => i !== realIndex));
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-10">
      {/* ENCABEZADO */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Burger King</h1>
          <p className="text-gray-600">Administra tus donaciones de comida</p>
        </div>
      </header>

      {/* BOTONES DE TABS + CREAR DONACIÓN */}
      <div className="mb-6 flex items-center justify-between">
        {/* Botones de pestañas */}
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

        {/* Botón crear donación */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-20 rounded-lg shadow-md transition whitespace-nowrap"
        >
          Crear Nueva Donación
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-1">
          {activeTab === "donaciones"
            ? "Tus Donaciones"
            : "Registro de Donaciones"}
        </h2>

        <div className="overflow-x-auto">
          {/* TABLA 1 - Tus donaciones */}
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
                    <td className="py-4 px-4 font-medium">{item.product}</td>
                    <td className="py-4 px-4">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-4 px-4">{item.expiration}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "Disponible"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
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

          {/* TABLA 2 - Registro de completadas */}
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
                    <td className="py-4 px-4 font-medium">{item.product}</td>
                    <td className="py-4 px-4">{item.quantity}</td>
                    <td className="py-4 px-4">{item.establishment || "—"}</td>
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

      {/* MODAL */}
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
              {/* Cerrar */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              {/* Imagen
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt={formData.product}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )} */}

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{formData.product}</h2>

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

                {/* FORMULARIO */}
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
                      type="text"
                      name="expiration"
                      value={formData.expiration}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  {(formData.status === "Reservado" ||
                    formData.status === "Completado") && (
                    <div>
                      <label className="font-semibold">Banco que reservó</label>
                      <p className="px-3 py-2 border rounded-md bg-gray-100 text-gray-700">
                        {formData.establishment || "—"}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="font-semibold">Fecha publicación</label>
                    <input
                      type="text"
                      name="listedDate"
                      value={formData.listedDate || ""}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

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

                <div className="flex justify-end gap-4">
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

      {/* MODAL DE NUEVA DONACIÓN */}
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
                      name="product"
                      value={newDonation.product}
                      onChange={handleNewDonationChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Cantidad</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newDonation.quantity}
                      onChange={handleNewDonationChange}
                      min="0"
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Unidades</label>
                    <select
                      name="unit"
                      value={newDonation.unit}
                      onChange={handleNewDonationChange}
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
                      name="expiration"
                      value={newDonation.expiration}
                      onChange={handleNewDonationChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="font-semibold">Descripción</label>
                    <textarea
                      name="description"
                      value={newDonation.description}
                      onChange={handleNewDonationChange}
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