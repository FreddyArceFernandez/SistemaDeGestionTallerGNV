const KEY = "taller_ingresos_manuales"

export const getIngresosManuales = () => {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export const saveIngresosManuales = (rows) => {
  localStorage.setItem(KEY, JSON.stringify(rows))
}

export const createIngresoManual = (payload) => {
  const fecha = String(payload.fecha || "").trim()
  if (!fecha) throw new Error("La fecha es obligatoria.")

  const monto = Number(payload.monto)
  if (Number.isNaN(monto) || monto < 0) throw new Error("El monto debe ser válido.")

  const detalle = String(payload.detalle || "").trim()
  if (!detalle) throw new Error("El detalle es obligatorio.")

  const rows = getIngresosManuales()
  rows.push({
    ingreso_manual_id: Date.now(),
    fecha,
    monto,
    detalle
  })
  saveIngresosManuales(rows)
}

export const updateIngresoManual = (payload) => {
  const id = Number(payload.ingreso_manual_id)
  const fecha = String(payload.fecha || "").trim()
  if (!fecha) throw new Error("La fecha es obligatoria.")

  const monto = Number(payload.monto)
  if (Number.isNaN(monto) || monto < 0) throw new Error("El monto debe ser válido.")

  const detalle = String(payload.detalle || "").trim()
  if (!detalle) throw new Error("El detalle es obligatorio.")

  const rows = getIngresosManuales()
  const idx = rows.findIndex((r) => Number(r.ingreso_manual_id) === id)
  if (idx === -1) throw new Error("No se encontró el ingreso manual.")
  rows[idx] = { ...rows[idx], fecha, monto, detalle }
  saveIngresosManuales(rows)
}

export const deleteIngresoManual = (id) => {
  const rid = Number(id)
  const rows = getIngresosManuales().filter((r) => Number(r.ingreso_manual_id) !== rid)
  saveIngresosManuales(rows)
}
