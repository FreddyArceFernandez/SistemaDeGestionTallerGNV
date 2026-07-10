const { getDb } = require("../database.cjs")

function normalizeCliente(payload = {}) {
  return {
    nombre: String(payload.nombre || "").trim(),
    apellido: String(payload.apellido || "").trim(),
    celular: String(payload.celular || "").trim()
  }
}

function getAll() {
  return getDb()
    .prepare(`
      SELECT cliente_id, nombre, apellido, celular, created_at, updated_at
      FROM clientes
      ORDER BY cliente_id DESC
    `)
    .all()
}

function getById(id) {
  return getDb()
    .prepare(`
      SELECT cliente_id, nombre, apellido, celular, created_at, updated_at
      FROM clientes
      WHERE cliente_id = ?
    `)
    .get(Number(id))
}

function create(payload) {
  const cliente = normalizeCliente(payload)
  if (!cliente.nombre) {
    throw new Error("El nombre es obligatorio.")
  }

  const result = getDb()
    .prepare(`
      INSERT INTO clientes (nombre, apellido, celular)
      VALUES (@nombre, @apellido, @celular)
    `)
    .run(cliente)

  return getById(result.lastInsertRowid)
}

function update(payload) {
  const clienteId = Number(payload.cliente_id)
  const cliente = normalizeCliente(payload)
  if (!clienteId) {
    throw new Error("Cliente no encontrado.")
  }
  if (!cliente.nombre) {
    throw new Error("El nombre es obligatorio.")
  }

  const result = getDb()
    .prepare(`
      UPDATE clientes
      SET nombre = @nombre,
          apellido = @apellido,
          celular = @celular,
          updated_at = CURRENT_TIMESTAMP
      WHERE cliente_id = @cliente_id
    `)
    .run({ ...cliente, cliente_id: clienteId })

  if (result.changes === 0) {
    throw new Error("Cliente no encontrado.")
  }

  return getById(clienteId)
}

function remove(id) {
  const clienteId = Number(id)
  const relatedVehicles = getDb()
    .prepare("SELECT COUNT(*) AS total FROM vehiculos WHERE cliente_id = ?")
    .get(clienteId)

  if (relatedVehicles.total > 0) {
    throw new Error("No se puede eliminar el cliente porque tiene vehiculos asociados.")
  }

  const result = getDb()
    .prepare("DELETE FROM clientes WHERE cliente_id = ?")
    .run(clienteId)

  if (result.changes === 0) {
    throw new Error("Cliente no encontrado.")
  }

  return { ok: true }
}

module.exports = {
  getAll,
  create,
  update,
  remove
}
