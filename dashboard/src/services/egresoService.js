const KEY = "taller_egresos"

export const getEgresos = () => {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export const saveEgresos = (egresos) => {
  localStorage.setItem(KEY, JSON.stringify(egresos))
}

export const createEgreso = (payload) => {
  const fecha = String(payload.fecha || "").trim()
  if (!fecha) {
    throw new Error("La fecha es obligatoria.")
  }

  const monto = Number(payload.monto)
  if (Number.isNaN(monto) || monto < 0) {
    throw new Error("El monto debe ser un número válido.")
  }

  const detalle = String(payload.detalle || "").trim()
  if (!detalle) {
    throw new Error("El detalle es obligatorio.")
  }

  const egresos = getEgresos()
  egresos.push({
    egreso_id: Date.now(),
    fecha,
    monto,
    detalle
  })
  saveEgresos(egresos)
}

export const deleteEgreso = (id) => {
  const egresoId = Number(id)
  const egresos = getEgresos().filter((e) => Number(e.egreso_id) !== egresoId)
  saveEgresos(egresos)
}

export const updateEgreso = (payload) => {
  const id = Number(payload.egreso_id)
  const fecha = String(payload.fecha || "").trim()
  if (!fecha) throw new Error("La fecha es obligatoria.")

  const monto = Number(payload.monto)
  if (Number.isNaN(monto) || monto < 0) throw new Error("El monto debe ser válido.")

  const detalle = String(payload.detalle || "").trim()
  if (!detalle) throw new Error("El detalle es obligatorio.")

  const egresos = getEgresos().map((e) =>
    Number(e.egreso_id) === id ? { ...e, fecha, monto, detalle } : e
  )
  if (!egresos.some((e) => Number(e.egreso_id) === id)) {
    throw new Error("No se encontró el egreso.")
  }
  saveEgresos(egresos)
}
