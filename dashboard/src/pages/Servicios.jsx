import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import ServicioForm from "../components/ServicioForm"
import Modal from "../components/Modal"
import { IconPlus, IconPencil, IconTrash } from "../components/CrudIcons"
import { useUi } from "../context/useUi"

import { getClientes } from "../services/clienteService"

import {
  getServicios,
  createServicio,
  deleteServicio,
  updateServicio
} from "../services/servicioService"

import {
  getVehiculos
} from "../services/vehiculoService"

import { presetPeriodo } from "../utils/dateRanges"

const tipoLabel = (tipo) => {
  const map = {
    conversion: "Conversión",
    revision_anual: "Revisión anual",
    recalificacion: "Recalificación",
    venta_accesorio: "Venta accesorio",
    mantenimiento: "Mantenimiento"
  }
  return map[tipo] || tipo || "—"
}

const initialFiltros = {
  placa: "",
  cliente: "",
  tipo: "",
  periodoRapido: "",
  fechaDesde: "",
  fechaHasta: ""
}

export default function Servicios() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast, confirm } = useUi()
  const [servicios, setServicios] = useState(() => getServicios())
  const [vehiculos, setVehiculos] = useState(() => getVehiculos())
  const [clientes, setClientes] = useState(() => getClientes())
  const [filtros, setFiltros] = useState(initialFiltros)

  const [openModal, setOpenModal] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [initialVehiculoId, setInitialVehiculoId] = useState("")
  const [editingServicio, setEditingServicio] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const vid = searchParams.get("vehiculo_id")
    const nuevo = searchParams.get("nuevo") === "1"
    if (!vid && !nuevo) return

    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setInitialVehiculoId(vid || "")
      setEditingServicio(null)
      setFormKey((k) => k + 1)
      setOpenModal(true)
      setSearchParams({}, { replace: true })
    })
    return () => {
      cancelled = true
    }
  }, [searchParams, setSearchParams])

  const loadData = () => {
    setServicios(getServicios())
    setVehiculos(getVehiculos())
    setClientes(getClientes())
  }

  const closeModal = () => {
    setOpenModal(false)
    setEditingServicio(null)
    setInitialVehiculoId("")
  }

  const handleSave = (servicioPayload) => {
    try {
      if (servicioPayload.servicio_id != null) {
        updateServicio(servicioPayload)
        toast.success("Servicio actualizado.")
      } else {
        createServicio(servicioPayload)
        toast.success("Servicio registrado.")
      }
      loadData()
      closeModal()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar servicio",
      message: "¿Eliminar este servicio? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger"
    })
    if (!ok) return

    try {
      deleteServicio(id)
      loadData()
      toast.success("Servicio eliminado.")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEditServicio = (servicio) => {
    setInitialVehiculoId("")
    setEditingServicio(servicio)
    setFormKey((k) => k + 1)
    setOpenModal(true)
  }

  const getVehiculoInfo = (vehiculo_id) => {
    return vehiculos.find(v => String(v.vehiculo_id) === String(vehiculo_id))
  }

  const getClienteInfo = (cliente_id) => {
    return clientes.find(c => Number(c.cliente_id) === Number(cliente_id))
  }

  const montoDisplay = (servicio) => {
    const n = Number(servicio.monto ?? servicio.costo_total ?? 0)
    return Number.isNaN(n) ? "0" : n.toFixed(2)
  }

  const fechaDisplay = (servicio) =>
    servicio.fecha || servicio.fecha_entrega || servicio.fecha_ingreso || ""

  const desdeFiltro = filtros.periodoRapido
    ? presetPeriodo(filtros.periodoRapido).desde
    : filtros.fechaDesde
  const hastaFiltro = filtros.periodoRapido
    ? presetPeriodo(filtros.periodoRapido).hasta
    : filtros.fechaHasta

  const serviciosFiltrados = servicios.filter((servicio) => {
    const vehiculo = getVehiculoInfo(servicio.vehiculo_id)
    const cliente = vehiculo ? getClienteInfo(vehiculo.cliente_id) : null

    const placaText = (vehiculo?.placa || "").toLowerCase()
    const clienteText = `${cliente?.nombre || ""} ${cliente?.apellido || ""}`.toLowerCase()
    const tipoText = String(servicio.tipo || "").toLowerCase()

    const byPlaca = !filtros.placa || placaText.includes(filtros.placa.toLowerCase())
    const byCliente = !filtros.cliente || clienteText.includes(filtros.cliente.toLowerCase())
    const byTipo = !filtros.tipo || tipoText === filtros.tipo.toLowerCase()

    const fs = fechaDisplay(servicio)
    let byFecha = true
    if (desdeFiltro || hastaFiltro) {
      if (!fs) {
        byFecha = false
      } else {
        if (desdeFiltro && fs < desdeFiltro) byFecha = false
        if (hastaFiltro && fs > hastaFiltro) byFecha = false
      }
    }

    return byPlaca && byCliente && byTipo && byFecha
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentServicios = serviciosFiltrados.slice(startIndex, endIndex)
  const totalPages = Math.max(1, Math.ceil(serviciosFiltrados.length / itemsPerPage))

  const applyPeriodo = (tipo) => {
    const r = presetPeriodo(tipo)
    setCurrentPage(1)
    setFiltros((prev) => ({
      ...prev,
      periodoRapido: tipo,
      fechaDesde: r.desde,
      fechaHasta: r.hasta
    }))
  }

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setCurrentPage(1)
    if (name === "fechaDesde" || name === "fechaHasta") {
      setFiltros((prev) => ({ ...prev, periodoRapido: "", [name]: value }))
    } else {
      setFiltros((prev) => ({ ...prev, [name]: value }))
    }
  }

  const limpiarFiltrosServ = () => {
    setFiltros(initialFiltros)
    setCurrentPage(1)
  }

  const openNuevoServicio = () => {
    setInitialVehiculoId("")
    setEditingServicio(null)
    setFormKey((k) => k + 1)
    setOpenModal(true)
  }

  return (
    <div className="entity-page">
      <div className="page-head page-head-row">
        <div>
          <h1>Servicios</h1>
          <p>Por vehículo</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNuevoServicio}>
          <IconPlus size={17} /> Nuevo servicio
        </button>
      </div>

      {openModal && (
        <Modal
          title={editingServicio ? "Editar" : "Nuevo"}
          onClose={closeModal}
        >
          <ServicioForm
            key={`${formKey}-${editingServicio?.servicio_id || "n"}-${initialVehiculoId}`}
            vehiculos={vehiculos}
            onSave={handleSave}
            initialVehiculoId={initialVehiculoId}
            editingServicio={editingServicio}
            inModal
          />
        </Modal>
      )}

      <div className="panel" style={{ marginBottom: "16px" }}>
        <div className="caja-presets caja-presets--inline">
          <div className="caja-presets__btns" role="group" aria-label="Intervalo">
            {[
              { k: "dia", l: "Hoy" },
              { k: "semana", l: "Semana" },
              { k: "mes", l: "Mes" }
            ].map(({ k, l }) => (
              <button
                key={k}
                type="button"
                className={`caja-period-pill${filtros.periodoRapido === k ? " is-active" : ""}`}
                onClick={() => applyPeriodo(k)}
              >
                {l}
              </button>
            ))}
            <button type="button" className="btn btn-ghost btn-sm-reset" onClick={limpiarFiltrosServ}>
              Borrar filtros
            </button>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="filtro-placa">Filtrar por placa</label>
            <input
              id="filtro-placa"
              name="placa"
              placeholder="Ej: 1234-ABC"
              value={filtros.placa}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="field">
            <label htmlFor="filtro-cliente">Filtrar por cliente</label>
            <input
              id="filtro-cliente"
              name="cliente"
              placeholder="Nombre o apellido"
              value={filtros.cliente}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="field">
            <label htmlFor="filtro-tipo">Filtrar por tipo</label>
            <select id="filtro-tipo" name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
              <option value="">Todos</option>
              <option value="conversion">Conversión</option>
              <option value="revision_anual">Revisión anual</option>
              <option value="recalificacion">Recalificación</option>
              <option value="venta_accesorio">Venta accesorio</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="srv-desde">Desde</label>
            <input
              id="srv-desde"
              name="fechaDesde"
              type="date"
              value={filtros.fechaDesde}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="field">
            <label htmlFor="srv-hasta">Hasta</label>
            <input
              id="srv-hasta"
              name="fechaHasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={handleFiltroChange}
            />
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Vehículo</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Monto (Bs)</th>
              <th className="th-actions">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {currentServicios.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>
                  No hay servicios registrados.
                </td>
              </tr>
            ) : (
              currentServicios.map((servicio) => {
                const vehiculo = getVehiculoInfo(servicio.vehiculo_id)
                const cliente = vehiculo
                  ? getClienteInfo(vehiculo.cliente_id)
                  : null

                return (
                  <tr key={servicio.servicio_id}>
                    <td>
                      {cliente
                        ? `${cliente.nombre} ${cliente.apellido}`
                        : "Sin cliente"}
                    </td>

                    <td>
                      {vehiculo
                        ? `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`
                        : "Sin vehículo"}
                    </td>

                    <td>{tipoLabel(servicio.tipo)}</td>
                    <td>{servicio.descripcion || "—"}</td>
                    <td>{fechaDisplay(servicio) || "—"}</td>
                    <td>{montoDisplay(servicio)}</td>

                    <td>
                      <div className="btn-icon-cluster">
                        <button
                          type="button"
                          className="btn-icon btn-icon--edit"
                          title="Editar"
                          aria-label="Editar servicio"
                          onClick={() => handleEditServicio(servicio)}
                        >
                          <IconPencil />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon--danger"
                          title="Eliminar"
                          aria-label="Eliminar servicio"
                          onClick={() => handleDelete(servicio.servicio_id)}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="btn btn-ghost"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>

        <span className="pagination-info">
          Página {currentPage} de {totalPages}
        </span>

        <button
          className="btn btn-ghost"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
