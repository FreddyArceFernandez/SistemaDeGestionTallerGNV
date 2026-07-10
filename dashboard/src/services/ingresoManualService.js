const KEY = "taller_ingresos_manuales"
const electronIngresosManuales = () => window.tallerApi?.ingresosManuales

export const isIngresoManualDbAvailable = () => Boolean(electronIngresosManuales())

export const getIngresosManuales = () => {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export const getIngresosManualesAsync = async () => {
  if (isIngresoManualDbAvailable()) return electronIngresosManuales().getAll()
  return getIngresosManuales()
}

export const saveIngresosManuales = (rows) => {
  localStorage.setItem(KEY, JSON.stringify(rows))
}

export const createIngresoManual = async (payload) => {
  if (isIngresoManualDbAvailable()) return electronIngresosManuales().create(payload)

  const fecha = String(payload.fecha || "").trim()
  if (!fecha) throw new Error("La fecha es obligatoria.")

  const monto = Number(payload.monto)
  if (Number.isNaN(monto) || monto < 0) throw new Error("El monto debe ser válido.")

  const detalle = String(payload.detalle || "").trim()
  if (!detalle) throw new Error("El detalle es obligatorio.")

  const rows = getIngresosManuales()
  const nuevo = {
    ingreso_manual_id: Date.now(),
    fecha,
    monto,
    detalle
  }
  rows.push(nuevo)
  saveIngresosManuales(rows)
  return nuevo
}

export const updateIngresoManual = async (payload) => {
  if (isIngresoManualDbAvailable()) return electronIngresosManuales().update(payload)

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

export const deleteIngresoManual = async (id) => {
  if (isIngresoManualDbAvailable()) return electronIngresosManuales().delete(id)

  const rid = Number(id)
  const rows = getIngresosManuales().filter((r) => Number(r.ingreso_manual_id) !== rid)
  saveIngresosManuales(rows)
}
