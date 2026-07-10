import { getClientes, getClientesAsync } from "./clienteService"
import { getVehiculos, getVehiculosAsync } from "./vehiculoService"
import { getServicios, getServiciosAsync } from "./servicioService"

const MS_PER_DAY = 1000 * 60 * 60 * 24

const SERVICE_CYCLES_DAYS = {
  instalacion: 365,
  conversion: 365,
  revision_anual: 365,
  recalificacion: 365 * 5
}

const normalizeTipo = (tipo = "") => String(tipo).trim().toLowerCase()

const parseDateOnly = (value) => {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

const addDays = (date, days) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

const formatISODate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const humanTipo = (tipo) => {
  const value = normalizeTipo(tipo)
  if (value === "revision_anual") return "Revisión anual"
  if (value === "recalificacion") return "Recalificación"
  if (value === "conversion" || value === "instalacion") return "Instalación / Conversión"
  return tipo || "Servicio"
}

export function getUpcomingServices(dias = 7) {
  const clientes = getClientes()
  const vehiculos = getVehiculos()
  const servicios = getServicios()
  return buildUpcomingServices({ clientes, vehiculos, servicios, dias })
}

export async function getUpcomingServicesAsync(dias = 7) {
  const [clientes, vehiculos, servicios] = await Promise.all([
    getClientesAsync(),
    getVehiculosAsync(),
    getServiciosAsync()
  ])
  return buildUpcomingServices({ clientes, vehiculos, servicios, dias })
}

function buildUpcomingServices({ clientes, vehiculos, servicios, dias }) {
  const today = new Date()
  const hoy = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const resultados = servicios
    .map((servicio) => {
      const tipoNormalizado = normalizeTipo(servicio.tipo)
      const cycleDays = SERVICE_CYCLES_DAYS[tipoNormalizado]
      if (!cycleDays) return null

      const fechaRef = servicio.fecha || servicio.fecha_entrega || servicio.fecha_ingreso
      const fechaEntrega = parseDateOnly(fechaRef)
      if (!fechaEntrega) return null

      const proximaFecha = addDays(fechaEntrega, cycleDays)
      const diasRestantes = Math.ceil((proximaFecha - hoy) / MS_PER_DAY)
      if (diasRestantes < 0 || diasRestantes > dias) return null

      const vehiculo = vehiculos.find(
        (v) => Number(v.vehiculo_id) === Number(servicio.vehiculo_id)
      )
      if (!vehiculo) return null

      const cliente = clientes.find(
        (c) => Number(c.cliente_id) === Number(vehiculo.cliente_id)
      )

      return {
        servicio_id: servicio.servicio_id,
        vehiculo_id: vehiculo.vehiculo_id,
        cliente_nombre: cliente
          ? `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim()
          : "Cliente no encontrado",
        vehiculo_placa: vehiculo.placa || "Sin placa",
        vehiculo_descripcion: `${vehiculo.marca || ""} ${vehiculo.modelo || ""}`.trim(),
        proximo_tipo: humanTipo(servicio.tipo),
        proxima_fecha: formatISODate(proximaFecha),
        dias_restantes: diasRestantes
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.dias_restantes - b.dias_restantes)

  return resultados
}
