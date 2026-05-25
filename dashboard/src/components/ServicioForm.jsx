import { useMemo, useState } from "react"

const TIPOS = [
  { value: "conversion", label: "Conversión" },
  { value: "recalificacion", label: "Recalificación" },
  { value: "revision_anual", label: "Revisión anual" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "venta_accesorio", label: "Venta de accesorio" }
]

export default function ServicioForm({
  vehiculos = [],
  onSave,
  initialVehiculoId = "",
  editingServicio = null,
  inModal = false
}) {
  const empty = useMemo(
    () => ({
      vehiculo_id: "",
      tipo: "",
      descripcion: "",
      fecha: "",
      monto: ""
    }),
    []
  )

  const [form, setForm] = useState(() => {
    if (editingServicio) {
      return {
        vehiculo_id: String(editingServicio.vehiculo_id ?? ""),
        tipo: editingServicio.tipo ?? "",
        descripcion: editingServicio.descripcion ?? "",
        fecha:
          editingServicio.fecha ||
          editingServicio.fecha_entrega ||
          editingServicio.fecha_ingreso ||
          "",
        monto: String(editingServicio.monto ?? editingServicio.costo_total ?? "")
      }
    }
    return {
      ...empty,
      vehiculo_id: initialVehiculoId ? String(initialVehiculoId) : ""
    }
  })

  const selectedVehiculo = useMemo(
    () => vehiculos.find((v) => String(v.vehiculo_id) === String(form.vehiculo_id)),
    [vehiculos, form.vehiculo_id]
  )

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.vehiculo_id || !form.tipo) {
      alert("Vehículo y tipo de servicio son obligatorios")
      return
    }
    if (!form.fecha) {
      alert("La fecha es obligatoria")
      return
    }
    if (form.monto === "" || Number(form.monto) < 0) {
      alert("Indique un monto válido")
      return
    }

    const payload = {
      ...form,
      monto: Number(form.monto)
    }
    if (editingServicio?.servicio_id != null) {
      payload.servicio_id = editingServicio.servicio_id
    }

    onSave(payload)

    if (!editingServicio) {
      setForm({ ...empty, vehiculo_id: initialVehiculoId ? String(initialVehiculoId) : "" })
    }
  }

  return (
    <form
      className={`service-form ${inModal ? "form-in-modal" : "panel"}`}
      onSubmit={handleSubmit}
    >
      {!inModal && (
        <div className="page-head" style={{ marginBottom: "18px" }}>
          <h2>{editingServicio ? "Editar trabajo" : "Registrar trabajo"}</h2>
        </div>
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="vehiculo_id">Vehículo</label>
          <select
            id="vehiculo_id"
            name="vehiculo_id"
            value={form.vehiculo_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.vehiculo_id} value={vehiculo.vehiculo_id}>
                {vehiculo.placa} — {vehiculo.marca} {vehiculo.modelo}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="tipo">Tipo de servicio</label>
          <select
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione el tipo</option>
            {TIPOS.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="fecha">Fecha del trabajo</label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="monto">Monto (Bs)</label>
          <input
            id="monto"
            type="number"
            name="monto"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.monto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="descripcion">Descripción (opcional)</label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Detalle u observaciones del trabajo"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>
      </div>

      {selectedVehiculo && (
        <div className="service-info">
          <strong>Vehículo seleccionado:</strong>{" "}
          {selectedVehiculo.placa} — {selectedVehiculo.marca} {selectedVehiculo.modelo}
        </div>
      )}

      <div className="actions" style={{ marginTop: "18px", justifyContent: "flex-end" }}>
        <button className="btn btn-primary" type="submit">
          Guardar
        </button>
      </div>
    </form>
  )
}
