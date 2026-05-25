import { useState } from "react"
import VehiculoForm from "../components/VehiculoForm"
import Modal from "../components/Modal"
import { IconPlus, IconPencil, IconTrash } from "../components/CrudIcons"

import {
  getVehiculos,
  createVehiculo,
  deleteVehiculo,
  updateVehiculo
} from "../services/vehiculoService"

import { getClientes } from "../services/clienteService"

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState(() => getVehiculos())
  const [clientes, setClientes] = useState(() => getClientes())
  const [openModal, setOpenModal] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editingVehiculo, setEditingVehiculo] = useState(null)

  const loadData = () => {
    setVehiculos(getVehiculos())
    setClientes(getClientes())
  }

  const handleSave = (vehiculoPayload) => {
    try {
      if (editingVehiculo) {
        updateVehiculo(vehiculoPayload)
      } else {
        createVehiculo(vehiculoPayload)
      }
      loadData()
      setOpenModal(false)
      setEditingVehiculo(null)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleDelete = (id) => {
    if (confirm("Eliminar vehículo?")) {
      try {
        deleteVehiculo(id)
        loadData()
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const openNuevoVehiculo = () => {
    setEditingVehiculo(null)
    setFormKey((k) => k + 1)
    setOpenModal(true)
  }

  const openEdit = (vehiculo) => {
    setEditingVehiculo(vehiculo)
    setFormKey((k) => k + 1)
    setOpenModal(true)
  }

  const clienteNombre = (cliente_id) => {
    const c = clientes.find((x) => Number(x.cliente_id) === Number(cliente_id))
    return c ? `${c.nombre} ${c.apellido}` : "—"
  }

  return (
    <div className="entity-page">
      <div className="page-head page-head-row">
        <div>
          <h1>Vehículos</h1>
          <p>Por cliente</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNuevoVehiculo}>
          <IconPlus size={17} /> Nuevo vehículo
        </button>
      </div>

      {openModal && (
        <Modal
          title={editingVehiculo ? "Editar" : "Nuevo"}
          onClose={() => {
            setOpenModal(false)
            setEditingVehiculo(null)
          }}
        >
          <VehiculoForm
            key={`${formKey}-${editingVehiculo?.vehiculo_id || "nuevo"}`}
            onSave={handleSave}
            clientes={clientes}
            editingVehiculo={editingVehiculo}
            inModal
          />
        </Modal>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th className="th-actions">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {vehiculos.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "24px" }}>
                  No hay vehículos registrados.
                </td>
              </tr>
            ) : (
              vehiculos.map((v) => (
                <tr key={v.vehiculo_id}>
                  <td>{clienteNombre(v.cliente_id)}</td>
                  <td>{v.placa}</td>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.anio}</td>
                  <td>
                    <div className="btn-icon-cluster">
                      <button
                        type="button"
                        className="btn-icon btn-icon--edit"
                        title="Editar"
                        aria-label="Editar vehículo"
                        onClick={() => openEdit(v)}
                      >
                        <IconPencil />
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-icon--danger"
                        title="Eliminar"
                        aria-label="Eliminar vehículo"
                        onClick={() => handleDelete(v.vehiculo_id)}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Vehiculos
