const { getDb } = require("../database.cjs")

function normalizePlaca(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "")
}

function normalizeVehiculo(payload = {}) {
  return {
    cliente_id: Number(payload.cliente_id),
    placa: normalizePlaca(payload.placa),
    marca: String(payload.marca || "").trim(),
    modelo: String(payload.modelo || "").trim(),
    anio: String(payload.anio || "").trim()
  }
}

function clienteExists(clienteId) {
  const row = getDb().prepare("SELECT 1 FROM clientes WHERE cliente_id = ?").get(Number(clienteId))
  return Boolean(row)
}

function placaTaken(placa, excludeId = null) {
  const row = getDb()
    .prepare(`
      SELECT vehiculo_id
      FROM vehiculos
      WHERE placa = ?
        AND (? IS NULL OR vehiculo_id <> ?)
      LIMIT 1
    `)
    .get(placa, excludeId, excludeId)
  return Boolean(row)
}

function getAll() {
  return getDb()
    .prepare(`
      SELECT vehiculo_id, cliente_id, placa, marca, modelo, anio, created_at, updated_at
      FROM vehiculos
      ORDER BY vehiculo_id DESC
    `)
    .all()
}

function getById(id) {
  return getDb()
    .prepare(`
      SELECT vehiculo_id, cliente_id, placa, marca, modelo, anio, created_at, updated_at
      FROM vehiculos
      WHERE vehiculo_id = ?
    `)
    .get(Number(id))
}

function create(payload) {
  const vehiculo = normalizeVehiculo(payload)
  if (!clienteExists(vehiculo.cliente_id)) {
    throw new Error("No se puede crear el vehiculo porque el cliente no existe.")
  }
  if (!vehiculo.placa) throw new Error("La placa es obligatoria.")
  if (placaTaken(vehiculo.placa)) throw new Error("Esta placa ya esta registrada.")

  const result = getDb()
    .prepare(`
      INSERT INTO vehiculos (cliente_id, placa, marca, modelo, anio)
      VALUES (@cliente_id, @placa, @marca, @modelo, @anio)
    `)
    .run(vehiculo)

  return getById(result.lastInsertRowid)
}

function update(payload) {
  const vehiculoId = Number(payload.vehiculo_id)
  const vehiculo = normalizeVehiculo(payload)
  if (!vehiculoId) throw new Error("Vehiculo no encontrado.")
  if (!clienteExists(vehiculo.cliente_id)) {
    throw new Error("No se puede actualizar porque el cliente no existe.")
  }
  if (!vehiculo.placa) throw new Error("La placa es obligatoria.")
  if (placaTaken(vehiculo.placa, vehiculoId)) throw new Error("Esta placa ya esta registrada.")

  const result = getDb()
    .prepare(`
      UPDATE vehiculos
      SET cliente_id = @cliente_id,
          placa = @placa,
          marca = @marca,
          modelo = @modelo,
          anio = @anio,
          updated_at = CURRENT_TIMESTAMP
      WHERE vehiculo_id = @vehiculo_id
    `)
    .run({ ...vehiculo, vehiculo_id: vehiculoId })

  if (result.changes === 0) throw new Error("Vehiculo no encontrado.")
  return getById(vehiculoId)
}

function remove(id) {
  const vehiculoId = Number(id)
  const relatedServices = getDb()
    .prepare("SELECT COUNT(*) AS total FROM servicios WHERE vehiculo_id = ?")
    .get(vehiculoId)

  if (relatedServices.total > 0) {
    throw new Error("No se puede eliminar el vehiculo porque tiene servicios asociados.")
  }

  const result = getDb().prepare("DELETE FROM vehiculos WHERE vehiculo_id = ?").run(vehiculoId)
  if (result.changes === 0) throw new Error("Vehiculo no encontrado.")
  return { ok: true }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
}
