const { app } = require("electron")
const Database = require("better-sqlite3")
const fs = require("fs")
const path = require("path")

let db

function getDatabasePath() {
  const dataDir = path.join(app.getPath("userData"), "data")
  fs.mkdirSync(dataDir, { recursive: true })
  return path.join(dataDir, "taller_gnv.db")
}

function migrate(database) {
  database.pragma("foreign_keys = ON")

  database.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT DEFAULT '',
      celular TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS vehiculos (
      vehiculo_id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      placa TEXT NOT NULL UNIQUE,
      marca TEXT DEFAULT '',
      modelo TEXT DEFAULT '',
      anio TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT,
      FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
    );

    CREATE TABLE IF NOT EXISTS servicios (
      servicio_id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehiculo_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      descripcion TEXT DEFAULT '',
      monto REAL NOT NULL DEFAULT 0,
      fecha TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT,
      FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(vehiculo_id)
    );

    CREATE TABLE IF NOT EXISTS egresos (
      egreso_id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL,
      monto REAL NOT NULL,
      detalle TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS ingresos_manuales (
      ingreso_manual_id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL,
      monto REAL NOT NULL,
      detalle TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );
  `)
}

function getDb() {
  if (!db) {
    db = new Database(getDatabasePath())
    migrate(db)
  }
  return db
}

function closeDb() {
  if (!db) return
  db.close()
  db = null
}

module.exports = {
  getDb,
  closeDb,
  getDatabasePath
}
