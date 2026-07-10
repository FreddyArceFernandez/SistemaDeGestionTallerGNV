import { normalizePlaca } from "../utils/validation"
import { getServicios } from "./servicioService"

const KEY = "taller_vehiculos"
const electronVehiculos = () => window.tallerApi?.vehiculos

export const isVehiculoDbAvailable = () => Boolean(electronVehiculos())

export const getVehiculos = () => {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export const getVehiculosAsync = async () => {
  if (isVehiculoDbAvailable()) return electronVehiculos().getAll()
  return getVehiculos()
}

export const saveVehiculos = (vehiculos) => {
  localStorage.setItem(KEY, JSON.stringify(vehiculos))
}

const placaTaken = (placa, excludeId = null) => {
  const normalized = normalizePlaca(placa)
  return getVehiculos().some(
    (v) =>
      normalizePlaca(v.placa) === normalized &&
      Number(v.vehiculo_id) !== Number(excludeId)
  )
}

export const createVehiculo = async (vehiculo) => {
  if (isVehiculoDbAvailable()) return electronVehiculos().create(vehiculo)

  const placa = normalizePlaca(vehiculo.placa)
  if (!placa) throw new Error("La placa es obligatoria.")
  if (placaTaken(placa)) throw new Error("Esta placa ya está registrada.")

  const vehiculos = getVehiculos()
  const nuevo = {
    ...vehiculo,
    placa,
    cliente_id: Number(vehiculo.cliente_id),
    vehiculo_id: Date.now()
  }
  vehiculos.push(nuevo)
  saveVehiculos(vehiculos)
  return nuevo
}

export const updateVehiculo = async (payload) => {
  if (isVehiculoDbAvailable()) return electronVehiculos().update(payload)

  const vid = Number(payload.vehiculo_id)
  const placa = normalizePlaca(payload.placa)
  if (!placa) throw new Error("La placa es obligatoria.")
  if (placaTaken(placa, vid)) throw new Error("Esta placa ya está registrada.")

  const vehiculos = getVehiculos().map((v) =>
    Number(v.vehiculo_id) === vid
      ? {
          ...v,
          cliente_id: Number(payload.cliente_id),
          placa,
          marca: payload.marca ?? "",
          modelo: payload.modelo ?? "",
          anio: payload.anio ?? ""
        }
      : v
  )
  if (!vehiculos.some((v) => Number(v.vehiculo_id) === vid)) {
    throw new Error("Vehículo no encontrado.")
  }
  saveVehiculos(vehiculos)
}

export const deleteVehiculo = async (id) => {
  if (isVehiculoDbAvailable()) return electronVehiculos().delete(id)

  const vehiculoId = Number(id)
  const servicios = getServicios().filter(
    (s) => Number(s.vehiculo_id) === vehiculoId
  )

  if (servicios.length > 0) {
    throw new Error("No se puede eliminar el vehiculo porque tiene servicios asociados.")
  }

  const vehiculos = getVehiculos().filter(v => Number(v.vehiculo_id) !== vehiculoId)
  saveVehiculos(vehiculos)
}

export const getVehiculoById = (id) => {
  const vehiculos = getVehiculos()
  return vehiculos.find(v => String(v.vehiculo_id) === String(id))
}

export const getVehiculoByIdAsync = async (id) => {
  if (isVehiculoDbAvailable()) return electronVehiculos().getById(id)
  return getVehiculoById(id)
}
