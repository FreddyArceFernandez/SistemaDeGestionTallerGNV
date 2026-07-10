const KEY = "taller_servicios"
const VEHICULOS_KEY = "taller_vehiculos"
const electronServicios = () => window.tallerApi?.servicios

export const isServicioDbAvailable = () => Boolean(electronServicios())

const existsVehiculo = (vehiculoId) => {
  const data = localStorage.getItem(VEHICULOS_KEY)
  const vehiculos = data ? JSON.parse(data) : []
  return vehiculos.some((v) => Number(v.vehiculo_id) === Number(vehiculoId))
}

export const getServicios = () => {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export const getServiciosAsync = async () => {
  if (isServicioDbAvailable()) return electronServicios().getAll()
  return getServicios()
}

export const saveServicios = (servicios) => {
  localStorage.setItem(KEY, JSON.stringify(servicios))
}

export const createServicio = async (servicio) => {
  if (isServicioDbAvailable()) return electronServicios().create(servicio)

  const vehiculoId = Number(servicio.vehiculo_id)

  if (!existsVehiculo(vehiculoId)) {
    throw new Error("No se puede crear el servicio porque el vehiculo no existe.")
  }

  const monto = Number(servicio.monto ?? servicio.costo_total ?? 0)
  if (Number.isNaN(monto) || monto < 0) {
    throw new Error("El monto debe ser un número válido.")
  }

  const fecha = String(servicio.fecha || "").trim()
  if (!fecha) {
    throw new Error("La fecha del trabajo es obligatoria.")
  }

  const servicios = getServicios()

  const nuevo = {
    servicio_id: Date.now(),
    vehiculo_id: vehiculoId,
    tipo: servicio.tipo,
    descripcion: servicio.descripcion || "",
    monto,
    fecha
  }

  servicios.push(nuevo)
  saveServicios(servicios)
  return nuevo
}

export const deleteServicio = async (id) => {
  if (isServicioDbAvailable()) return electronServicios().delete(id)

  const servicioId = Number(id)
  const servicios = getServicios().filter(s => Number(s.servicio_id) !== servicioId)
  saveServicios(servicios)
}

export const updateServicio = async (payload) => {
  if (isServicioDbAvailable()) return electronServicios().update(payload)

  const sid = Number(payload.servicio_id)
  const vehiculoId = Number(payload.vehiculo_id)

  if (!existsVehiculo(vehiculoId)) {
    throw new Error("No se puede actualizar porque el vehiculo no existe.")
  }

  const monto = Number(payload.monto ?? payload.costo_total ?? 0)
  if (Number.isNaN(monto) || monto < 0) {
    throw new Error("El monto debe ser un número válido.")
  }

  const fecha = String(payload.fecha || "").trim()
  if (!fecha) {
    throw new Error("La fecha del trabajo es obligatoria.")
  }

  const servicios = getServicios().map((s) =>
    Number(s.servicio_id) === sid
      ? {
          servicio_id: sid,
          vehiculo_id: vehiculoId,
          tipo: payload.tipo,
          descripcion: payload.descripcion || "",
          monto,
          fecha
        }
      : s
  )

  if (!servicios.some((s) => Number(s.servicio_id) === sid)) {
    throw new Error("Servicio no encontrado.")
  }

  saveServicios(servicios)
}
