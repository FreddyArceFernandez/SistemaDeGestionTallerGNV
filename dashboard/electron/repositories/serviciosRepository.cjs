const { getDb } = require("../database.cjs")

function vehiculoExists(vehiculoId) {
  const row = getDb().prepare("SELECT 1 FROM vehiculos WHERE vehiculo_id = ?").get(Number(vehiculoId))
  return Boolean(row)
}

function normalizeServicio(payload = {}) {
  const vehiculoId = Number(payload.vehiculo_id)
  const monto = Number(payload.monto ?? payload.costo_total ?? 0)
  return {
    vehiculo_id: vehiculoId,
    tipo: String(payload.tipo || "").trim(),
    descripcion: String(payload.descripcion || "").trim(),
    monto,
    fecha: String(payload.fecha || payload.fecha_entrega || payload.fecha_ingreso || "").trim()
  }
}

function validate(servicio) {
  if (!vehiculoExists(servicio.vehiculo_id)) {
    throw new Error("No se puede registrar el servicio porque el vehiculo no existe.")
  }
  if (!servicio.tipo) throw new Error("El tipo de servicio es obligatorio.")
  if (!servicio.fecha) throw new Error("La fecha del trabajo es obligatoria.")
  if (Number.isNaN(servicio.monto) || servicio.monto < 0) {
    throw new Error("El monto debe ser un numero valido.")
  }
}

function getAll() {
  return getDb()
    .prepare(`
      SELECT servicio_id, vehiculo_id, tipo, descripcion, monto, fecha, created_at, updated_at
      FROM servicios
      ORDER BY fecha DESC, servicio_id DESC
    `)
    .all()
}

function getById(id) {
  return getDb()
    .prepare(`
      SELECT servicio_id, vehiculo_id, tipo, descripcion, monto, fecha, created_at, updated_at
      FROM servicios
      WHERE servicio_id = ?
    `)
    .get(Number(id))
}

function create(payload) {
  const servicio = normalizeServicio(payload)
  validate(servicio)

  const result = getDb()
    .prepare(`
      INSERT INTO servicios (vehiculo_id, tipo, descripcion, monto, fecha)
      VALUES (@vehiculo_id, @tipo, @descripcion, @monto, @fecha)
    `)
    .run(servicio)

  return getById(result.lastInsertRowid)
}

function update(payload) {
  const servicioId = Number(payload.servicio_id)
  const servicio = normalizeServicio(payload)
  if (!servicioId) throw new Error("Servicio no encontrado.")
  validate(servicio)

  const result = getDb()
    .prepare(`
      UPDATE servicios
      SET vehiculo_id = @vehiculo_id,
          tipo = @tipo,
          descripcion = @descripcion,
          monto = @monto,
          fecha = @fecha,
          updated_at = CURRENT_TIMESTAMP
      WHERE servicio_id = @servicio_id
    `)
    .run({ ...servicio, servicio_id: servicioId })

  if (result.changes === 0) throw new Error("Servicio no encontrado.")
  return getById(servicioId)
}

function remove(id) {
  const result = getDb().prepare("DELETE FROM servicios WHERE servicio_id = ?").run(Number(id))
  if (result.changes === 0) throw new Error("Servicio no encontrado.")
  return { ok: true }
}

module.exports = {
  getAll,
  create,
  update,
  remove
}
