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
      SELECT egreso_id, fecha, monto, detalle, created_at, updated_at
      FROM egresos
      ORDER BY fecha DESC, egreso_id DESC
    `)
    .all()
}

function getById(id) {
  return getDb()
    .prepare(`
      SELECT egreso_id, fecha, monto, detalle, created_at, updated_at
      FROM egresos
      WHERE egreso_id = ?
    `)
    .get(Number(id))
}

function create(payload) {
  const row = normalizeMovimiento(payload)
  validate(row)
  const result = getDb()
    .prepare("INSERT INTO egresos (fecha, monto, detalle) VALUES (@fecha, @monto, @detalle)")
    .run(row)
  return getById(result.lastInsertRowid)
}

function update(payload) {
  const egresoId = Number(payload.egreso_id)
  const row = normalizeMovimiento(payload)
  if (!egresoId) throw new Error("No se encontro el egreso.")
  validate(row)

  const result = getDb()
    .prepare(`
      UPDATE egresos
      SET fecha = @fecha,
          monto = @monto,
          detalle = @detalle,
          updated_at = CURRENT_TIMESTAMP
      WHERE egreso_id = @egreso_id
    `)
    .run({ ...row, egreso_id: egresoId })

  if (result.changes === 0) throw new Error("No se encontro el egreso.")
  return getById(egresoId)
}

function remove(id) {
  const result = getDb().prepare("DELETE FROM egresos WHERE egreso_id = ?").run(Number(id))
  if (result.changes === 0) throw new Error("No se encontro el egreso.")
  return { ok: true }
}

module.exports = {
  getAll,
  create,
  update,
  remove
}
