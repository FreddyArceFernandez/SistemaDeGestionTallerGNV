function pad(n) {
  return String(n).padStart(2, "0")
}

export function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function addDays(d, n) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() + n)
  return x
}

export function startOfWeekMonday(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const w = x.getDay()
  const monOffset = w === 0 ? -6 : 1 - w
  x.setDate(x.getDate() + monOffset)
  return x
}



export function presetPeriodo(tipo, ref = new Date()) {
  if (!tipo) return { desde: "", hasta: "" }

  const hoy = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate())

  if (tipo === "dia") {
    const iso = toISODate(hoy)
    return { desde: iso, hasta: iso }
  }

  if (tipo === "semana") {
    const start = startOfWeekMonday(hoy)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return { desde: toISODate(start), hasta: toISODate(end) }
  }

  if (tipo === "mes") {
    const start = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const end = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
    return { desde: toISODate(start), hasta: toISODate(end) }
  }

  return { desde: "", hasta: "" }
}
