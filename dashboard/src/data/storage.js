export const STORAGE_KEYS = [
  "taller_clientes",
  "taller_vehiculos",
  "taller_servicios",
  "taller_egresos",
  "taller_ingresos_manuales"
]

export const DATA_VERSION_KEY = "taller_data_version"
export const DATA_VERSION = "2025-production-empty"

export const getData = (key) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const clearAllData = () => {
  STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

export const ensureDataVersion = () => {
  if (localStorage.getItem(DATA_VERSION_KEY) === DATA_VERSION) return

  clearAllData()
  localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION)
}
