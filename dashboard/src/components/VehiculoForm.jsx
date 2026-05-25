import { useState, useMemo } from "react"

export default function VehiculoForm({
  onSave,
  clientes,
  editingVehiculo = null,
  inModal = false
}) {
  const empty = useMemo(
    () => ({
      cliente_id: "",
      placa: "",
      marca: "",
      modelo: "",
      anio: ""
    }),
    []
  )

  const [form, setForm] = useState(() =>
    editingVehiculo
      ? {
          cliente_id: String(editingVehiculo.cliente_id ?? ""),
          placa: editingVehiculo.placa ?? "",
          marca: editingVehiculo.marca ?? "",
          modelo: editingVehiculo.modelo ?? "",
          anio: String(editingVehiculo.anio ?? ""),
          vehiculo_id: editingVehiculo.vehiculo_id
        }
      : { ...empty }
  )

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.cliente_id || !form.placa) {
      alert("Cliente y placa son obligatorios")
      return
    }

    const payload = {
      cliente_id: Number(form.cliente_id),
      placa: form.placa.trim(),
      marca: form.marca,
      modelo: form.modelo,
      anio: form.anio
    }

    if (editingVehiculo?.vehiculo_id != null) {
      payload.vehiculo_id = editingVehiculo.vehiculo_id
    }

    onSave(payload)

    setForm(editingVehiculo ? { ...form } : { ...empty })
  }

  return (
    <form className={inModal ? "form-in-modal" : "panel"} onSubmit={handleSubmit}>
      {!inModal && (
        <div className="page-head" style={{ marginBottom: "16px" }}>
          <h2>{editingVehiculo ? "Editar vehículo" : "Registrar vehículo"}</h2>
        </div>
      )}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="vehiculo-cliente">Cliente</label>
          <select
            id="vehiculo-cliente"
            name="cliente_id"
            value={form.cliente_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.cliente_id} value={cliente.cliente_id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="vehiculo-placa">Placa</label>
          <input
            id="vehiculo-placa"
            name="placa"
            placeholder="Placa"
            value={form.placa}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="vehiculo-marca">Marca</label>
          <input
            id="vehiculo-marca"
            name="marca"
            placeholder="Marca"
            value={form.marca}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="vehiculo-modelo">Modelo</label>
          <input
            id="vehiculo-modelo"
            name="modelo"
            placeholder="Modelo"
            value={form.modelo}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="vehiculo-anio">Año</label>
          <input
            id="vehiculo-anio"
            name="anio"
            placeholder="Año"
            value={form.anio}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="actions" style={{ marginTop: "16px", justifyContent: "flex-end" }}>
        <button className="btn btn-primary" type="submit">
          Guardar
        </button>
      </div>
    </form>
  )
}
