const { getDb } = require("../database.cjs")

function normalizeMovimiento(payload = {}) {
  return {
    fecha: String(payload.fecha || "").trim(),
    monto: Number(payload.monto),
    detalle: String(payload.detalle || "").trim()
  }
}

function validate(row) {
  if (!row.fecha) throw new Error("La fecha es obligatoria.")
  if (Number.isNaN(row.monto) || row.monto < 0) throw new Error("El monto debe ser valido.")
  if (!row.detalle) throw new Error("El detalle es obligatorio.")
}

function getAll() {
  return getDb()
    .prepare(`
      SELECT ingreso_manual_id, fecha, monto, detalle, created_at, updated_at
      FROM ingresos_manuales
      ORDER BY fecha DESC, ingreso_manual_id DESC
    `)
    .all()
}

function getById(id) {
  return getDb()
    .prepare(`
      SELECT ingreso_manual_id, fecha, monto, detalle, created_at, updated_at
      FROM ingresos_manuales
      WHERE ingreso_manual_id = ?
    `)
    .get(Number(id))
}

function create(payload) {
  const row = normalizeMovimiento(payload)
  validate(row)
  const result = getDb()
    .prepare("INSERT INTO ingresos_manuales (fecha, monto, detalle) VALUES (@fecha, @monto, @detalle)")
    .run(row)
  return getById(result.lastInsertRowid)
}

function update(payload) {
  const ingresoId = Number(payload.ingreso_manual_id)
  const row = normalizeMovimiento(payload)
  if (!ingresoId) throw new Error("No se encontro el ingreso.")
  validate(row)

  const result = getDb()
    .prepare(`
      UPDATE ingresos_manuales
      SET fecha = @fecha,
          monto = @monto,
          detalle = @detalle,
          updated_at = CURRENT_TIMESTAMP
      WHERE ingreso_manual_id = @ingreso_manual_id
    `)
    .run({ ...row, ingreso_manual_id: ingresoId })

  if (result.changes === 0) throw new Error("No se encontro el ingreso.")
  return getById(ingresoId)
}

function remove(id) {
  const result = getDb().prepare("DELETE FROM ingresos_manuales WHERE ingreso_manual_id = ?").run(Number(id))
  if (result.changes === 0) throw new Error("No se encontro el ingreso.")
  return { ok: true }
}

module.exports = {
  getAll,
  create,
  update,
  remove
}
