import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import VehiculoForm from "../components/VehiculoForm"
import Modal from "../components/Modal"
import { IconPlus, IconPencil, IconTrash, IconWrench } from "../components/CrudIcons"
import { useUi } from "../context/useUi"

import {
  getVehiculos,
  getVehiculosAsync,
  createVehiculo,
  deleteVehiculo,
  updateVehiculo
} from "../services/vehiculoService"

import { getClientes, getClientesAsync } from "../services/clienteService"

const Vehiculos = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast, confirm } = useUi()

  const [vehiculos, setVehiculos] = useState(() => getVehiculos())
  const [clientes, setClientes] = useState(() => getClientes())
  const [query, setQuery] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [initialClienteId, setInitialClienteId] = useState("")
  const [editingVehiculo, setEditingVehiculo] = useState(null)

  useEffect(() => {
    const clienteId = searchParams.get("cliente_id")
    if (!clienteId) return

    queueMicrotask(() => {
      setEditingVehiculo(null)
      setInitialClienteId(clienteId)
      setFormKey((k) => k + 1)
      setOpenModal(true)
      setSearchParams({}, { replace: true })
    })
  }, [searchParams, setSearchParams])

  const loadData = useCallback(async () => {
    try {
      const [vehiculosData, clientesData] = await Promise.all([
        getVehiculosAsync(),
        getClientesAsync()
      ])
      setVehiculos(vehiculosData)
      setClientes(clientesData)
    } catch (error) {
      toast.error(error.message)
    }
  }, [toast])

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) loadData()
    })
    return () => {
      cancelled = true
    }
  }, [loadData])

  const handleSave = async (vehiculoPayload) => {
    try {
      if (editingVehiculo) {
        await updateVehiculo(vehiculoPayload)
        toast.success("Vehículo actualizado.")
      } else {
        await createVehiculo(vehiculoPayload)
        toast.success("Vehículo registrado.")
      }
      await loadData()
      setOpenModal(false)
      setEditingVehiculo(null)
      setInitialClienteId("")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar vehículo",
      message: "¿Eliminar este vehículo? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger"
    })
    if (!ok) return

    try {
      await deleteVehiculo(id)
      await loadData()
      toast.success("Vehículo eliminado.")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openNuevoVehiculo = () => {
    setEditingVehiculo(null)
    setInitialClienteId("")
    setFormKey((k) => k + 1)
    setOpenModal(true)
  }

  const openEdit = (vehiculo) => {
    setEditingVehiculo(vehiculo)
    setInitialClienteId("")
    setFormKey((k) => k + 1)
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setEditingVehiculo(null)
    setInitialClienteId("")
  }

  const clienteNombre = (cliente_id) => {
    const c = clientes.find((x) => Number(x.cliente_id) === Number(cliente_id))
    return c ? `${c.nombre} ${c.apellido}`.trim() : "—"
  }

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${clienteNombre(vehiculo.cliente_id)} ${vehiculo.placa || ""} ${vehiculo.marca || ""} ${vehiculo.modelo || ""} ${vehiculo.anio || ""}`
      .toLowerCase()
      .includes(q)
  })

  return (
    <div className="entity-page">
      <div className="page-head page-head-row">
        <div>
          <h1>Vehículos</h1>
          <p>{vehiculos.length} registrados</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNuevoVehiculo}>
          <IconPlus size={17} /> Nuevo vehículo
        </button>
      </div>

      {openModal && (
        <Modal
          title={editingVehiculo ? "Editar" : "Nuevo"}
          onClose={closeModal}
        >
          <VehiculoForm
            key={`${formKey}-${editingVehiculo?.vehiculo_id || initialClienteId || "nuevo"}`}
            onSave={handleSave}
            clientes={clientes}
            editingVehiculo={editingVehiculo}
            initialClienteId={initialClienteId}
            inModal
          />
        </Modal>
      )}

      <div className="page-toolbar">
        <div className="field page-toolbar__search">
          <label htmlFor="buscar-vehiculo">Buscar vehículo</label>
          <input
            id="buscar-vehiculo"
            placeholder="Cliente, placa, marca, modelo o año"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <span className="entity-count">
          {vehiculosFiltrados.length} resultado{vehiculosFiltrados.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="table-wrap">
        <table className="data-table">
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
            {vehiculosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  No hay vehículos registrados.
                </td>
              </tr>
            ) : (
              vehiculosFiltrados.map((v) => (
                <tr key={v.vehiculo_id}>
                  <td>{clienteNombre(v.cliente_id)}</td>
                  <td>{v.placa}</td>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.anio}</td>
                  <td>
                    <div className="btn-icon-cluster">
                      <Link
                        to={`/servicios?vehiculo_id=${v.vehiculo_id}`}
                        className="btn-icon btn-icon--accent"
                        title="Nuevo servicio"
                        aria-label="Nuevo servicio"
                      >
                        <IconWrench />
                      </Link>
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
