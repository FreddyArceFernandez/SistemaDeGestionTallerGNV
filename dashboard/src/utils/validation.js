import { toISODate } from "./dateRanges"

export function todayISO() {
  return toISODate(new Date())
}

export function normalizePlaca(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
}

export function validateRequired(value, label) {
  if (!String(value || "").trim()) return label + " es obligatorio."
  return ""
}

export function validateCelular(value, options = {}) {
  const required = options.required === true
  const trimmed = String(value || "").trim()
  if (!trimmed) return required ? "El celular es obligatorio." : ""

  let digits = trimmed.replace(/\D/g, "")
  if (digits.startsWith("591") && digits.length > 8) {
    digits = digits.slice(-8)
  }

  if (digits.length !== 8 || !/^[67]/.test(digits)) {
    return "Use 8 dígitos válidos (ej. 71234567)."
  }

  return ""
}

export function validatePlaca(value) {
  const placa = normalizePlaca(value)
  if (!placa) return "La placa es obligatoria."
  if (placa.length < 3 || placa.length > 10) {
    return "Placa inválida (3–10 caracteres)."
  }
  if (!/^[A-Z0-9-]+$/.test(placa)) {
    return "Solo letras, números y guiones."
  }
  return ""
}

export function validateFechaNoFutura(value, label) {
  const fieldLabel = label || "La fecha"
  if (!String(value || "").trim()) return fieldLabel + " es obligatoria."

  const d = new Date(String(value) + "T00:00:00")
  if (Number.isNaN(d.getTime())) return fieldLabel + " no es válida."

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  if (d > hoy) return fieldLabel + " no puede ser futura."

  return ""
}

export function validateMonto(value) {
  if (value === "" || value == null) return "Indique un monto válido."
  const n = Number(value)
  if (Number.isNaN(n) || n < 0) return "Indique un monto válido."
  return ""
}
