import { useState, useMemo } from "react"
import FieldError from "./FieldError"
import {
  validateFechaNoFutura,
  validateMonto,
  todayISO
} from "../utils/validation"

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

  const [errors, setErrors] = useState({})

  const selectedVehiculo = useMemo(
    () => vehiculos.find((v) => String(v.vehiculo_id) === String(form.vehiculo_id)),
    [vehiculos, form.vehiculo_id]
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = {}
    if (!form.vehiculo_id) nextErrors.vehiculo_id = "Seleccione un vehículo."
    if (!form.tipo) nextErrors.tipo = "Seleccione el tipo de servicio."

    const fechaErr = validateFechaNoFutura(form.fecha, "La fecha del trabajo")
    if (fechaErr) nextErrors.fecha = fechaErr

    const montoErr = validateMonto(form.monto)
    if (montoErr) nextErrors.monto = montoErr

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
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
    setErrors({})
  }

  return (
    <form
      className={`service-form ${inModal ? "form-in-modal" : "panel"}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {!inModal && (
        <div className="page-head form-section-head">
          <h2>{editingServicio ? "Editar trabajo" : "Registrar trabajo"}</h2>
        </div>
      )}

      <div className="form-grid">
        <div className={`field${errors.vehiculo_id ? " field--invalid" : ""}`}>
          <label htmlFor="vehiculo_id">Vehículo</label>
          <select
            id="vehiculo_id"
            name="vehiculo_id"
            value={form.vehiculo_id}
            onChange={handleChange}
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.vehiculo_id} value={vehiculo.vehiculo_id}>
                {vehiculo.placa} — {vehiculo.marca} {vehiculo.modelo}
              </option>
            ))}
          </select>
          <FieldError message={errors.vehiculo_id} />
        </div>

        <div className={`field${errors.tipo ? " field--invalid" : ""}`}>
          <label htmlFor="tipo">Tipo de servicio</label>
          <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="">Seleccione el tipo</option>
            {TIPOS.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.tipo} />
        </div>

        <div className={`field${errors.fecha ? " field--invalid" : ""}`}>
          <label htmlFor="fecha">Fecha del trabajo</label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            value={form.fecha}
            max={todayISO()}
            onChange={handleChange}
          />
          <FieldError message={errors.fecha} />
        </div>

        <div className={`field${errors.monto ? " field--invalid" : ""}`}>
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
          />
          <FieldError message={errors.monto} />
        </div>

        <div className="field field--full">
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

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Guardar
        </button>
      </div>
    </form>
  )
}
