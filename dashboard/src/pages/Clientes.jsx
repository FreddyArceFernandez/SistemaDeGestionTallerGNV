import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Table from "../components/Table"
import Modal from "../components/Modal"
import FieldError from "../components/FieldError"
import { IconPlus } from "../components/CrudIcons"
import { useUi } from "../context/useUi"
import { validateCelular, validateRequired } from "../utils/validation"

import {
  getClientes,
  createCliente,
  deleteCliente,
  updateCliente
} from "../services/clienteService"

function Clientes() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast, confirm } = useUi()

  const [clientes, setClientes] = useState(() => getClientes())
  const [openModal, setOpenModal] = useState(false)
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    celular: ""
  })
  const [errors, setErrors] = useState({})
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (searchParams.get("nuevo") !== "1") return
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setEditing(false)
      setForm({ nombre: "", apellido: "", celular: "" })
      setErrors({})
      setOpenModal(true)
      setSearchParams({}, { replace: true })
    })
    return () => {
      cancelled = true
    }
  }, [searchParams, setSearchParams])

  const loadClientes = () => {
    setClientes(getClientes())
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const nextErrors = {}
    const nombreErr = validateRequired(form.nombre, "El nombre")
    if (nombreErr) nextErrors.nombre = nombreErr

    const celErr = validateCelular(form.celular)
    if (celErr) nextErrors.celular = celErr

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    try {
      if (editing) {
        updateCliente(form)
        toast.success("Cliente actualizado.")
      } else {
        createCliente(form)
        toast.success("Cliente registrado.")
      }
    } catch (error) {
      toast.error(error.message)
      return
    }

    setForm({ nombre: "", apellido: "", celular: "" })
    setErrors({})
    setEditing(false)
    setOpenModal(false)
    loadClientes()
  }

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar cliente",
      message: "¿Eliminar este cliente? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger"
    })
    if (!ok) return

    try {
      deleteCliente(id)
      loadClientes()
      toast.success("Cliente eliminado.")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (cliente) => {
    setForm(cliente)
    setErrors({})
    setEditing(true)
    setOpenModal(true)
  }

  const openNuevoCliente = () => {
    setEditing(false)
    setForm({ nombre: "", apellido: "", celular: "" })
    setErrors({})
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setEditing(false)
    setErrors({})
  }

  const handleAddVehicle = (clienteId) => {
    navigate(`/vehiculos?cliente_id=${clienteId}`)
  }

  return (
    <div className="entity-page">
      <div className="page-head page-head-row">
        <div>
          <h1>Clientes</h1>
          <p>Directorio</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNuevoCliente}>
          <IconPlus size={17} /> Nuevo cliente
        </button>
      </div>

      <Table
        data={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddVehicle={handleAddVehicle}
      />

      {openModal && (
        <Modal title={editing ? "Editar" : "Nuevo"} onClose={closeModal}>
          <div className="form-grid">
            <div className={`field${errors.nombre ? " field--invalid" : ""}`}>
              <label htmlFor="cliente-nombre">Nombre</label>
              <input
                id="cliente-nombre"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
              />
              <FieldError message={errors.nombre} />
            </div>
            <div className="field">
              <label htmlFor="cliente-apellido">Apellido</label>
              <input
                id="cliente-apellido"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>
            <div
              className={`field${errors.celular ? " field--invalid" : ""}`}
              style={{ gridColumn: "1 / -1" }}
            >
              <label htmlFor="cliente-celular">Celular</label>
              <input
                id="cliente-celular"
                name="celular"
                placeholder="71234567"
                inputMode="numeric"
                value={form.celular}
                onChange={handleChange}
              />
              <FieldError message={errors.celular} />
            </div>
          </div>
          <div className="actions" style={{ marginTop: "14px", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Clientes
