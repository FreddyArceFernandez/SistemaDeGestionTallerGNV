import { useState, useMemo } from "react"
import FieldError from "./FieldError"
import { validatePlaca, validateRequired } from "../utils/validation"

export default function VehiculoForm({
  onSave,
  clientes,
  editingVehiculo = null,
  initialClienteId = "",
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
      : {
          ...empty,
          cliente_id: initialClienteId ? String(initialClienteId) : ""
        }
  )

  const [errors, setErrors] = useState({})

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
    const clienteErr = validateRequired(form.cliente_id, "El cliente")
    if (clienteErr) nextErrors.cliente_id = clienteErr

    const placaErr = validatePlaca(form.placa)
    if (placaErr) nextErrors.placa = placaErr

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
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
    setErrors({})
  }

  return (
    <form className={inModal ? "form-in-modal" : "panel"} onSubmit={handleSubmit} noValidate>
      {!inModal && (
        <div className="page-head form-section-head">
          <h2>{editingVehiculo ? "Editar vehículo" : "Registrar vehículo"}</h2>
        </div>
      )}
      <div className="form-grid">
        <div className={`field${errors.cliente_id ? " field--invalid" : ""}`}>
          <label htmlFor="vehiculo-cliente">Cliente</label>
          <select
            id="vehiculo-cliente"
            name="cliente_id"
            value={form.cliente_id}
            onChange={handleChange}
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.cliente_id} value={cliente.cliente_id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
          <FieldError message={errors.cliente_id} />
        </div>
        <div className={`field${errors.placa ? " field--invalid" : ""}`}>
          <label htmlFor="vehiculo-placa">Placa</label>
          <input
            id="vehiculo-placa"
            name="placa"
            placeholder="Ej. 1234ABC"
            value={form.placa}
            onChange={handleChange}
          />
          <FieldError message={errors.placa} />
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
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Guardar
        </button>
      </div>
    </form>
  )
}
