import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import Modal from "../components/Modal"
import FieldError from "../components/FieldError"
import { IconPlus, IconPencil, IconTrash } from "../components/CrudIcons"
import { useUi } from "../context/useUi"
import {
  validateFechaNoFutura,
  validateMonto,
  validateRequired,
  todayISO
} from "../utils/validation"
import { getServicios } from "../services/servicioService"
import { getVehiculos } from "../services/vehiculoService"
import { getClientes } from "../services/clienteService"
import { getEgresos, createEgreso, deleteEgreso, updateEgreso } from "../services/egresoService"
import {
  getIngresosManuales,
  createIngresoManual,
  deleteIngresoManual,
  updateIngresoManual
} from "../services/ingresoManualService"
import { useSearchParams } from "react-router-dom"
import { presetPeriodo } from "../utils/dateRanges"

function montoServicio(s) {
  const n = Number(s.monto ?? s.costo_total ?? 0)
  return Number.isNaN(n) ? 0 : n
}

function fechaServicio(s) {
  return s.fecha || s.fecha_entrega || s.fecha_ingreso || ""
}

const tipoLabel = (tipo) => {
  const map = {
    conversion: "Conversión",
    revision_anual: "Revisión anual",
    recalificacion: "Recalificación",
    venta_accesorio: "Venta accesorio",
    mantenimiento: "Mantenimiento"
  }
  return map[tipo] || tipo || "Servicio"
}

function fechaEnRango(fechaStr, desde, hasta) {
  if (!fechaStr) return false
  const dIni = desde && String(desde).trim() ? fechaStr >= desde : true
  const dFin = hasta && String(hasta).trim() ? fechaStr <= hasta : true
  return dIni && dFin
}

const ITEMS_PER_PAGE = 6

const blankMovimiento = () => ({
  fecha: "",
  monto: "",
  detalle: ""
})

const initialFiltros = {
  periodoRapido: "",
  fechaDesde: "",
  fechaHasta: "",
  tipoIngreso: "",
  buscarIngreso: "",
  buscarEgreso: ""
}

export default function Caja() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast, confirm } = useUi()
  const [, bump] = useState(0)
  const [filtros, setFiltros] = useState(initialFiltros)
  const [pageIngreso, setPageIngreso] = useState(1)
  const [pageEgreso, setPageEgreso] = useState(1)

  const [openModalEgreso, setOpenModalEgreso] = useState(false)
  const [openModalIng, setOpenModalIng] = useState(false)
  const [editEgreso, setEditEgreso] = useState(null)
  const [editIng, setEditIng] = useState(null)
  const [formEg, setFormEg] = useState(blankMovimiento)
  const [formIng, setFormIng] = useState(blankMovimiento)
  const [errorsEg, setErrorsEg] = useState({})
  const [errorsIng, setErrorsIng] = useState({})

  useEffect(() => {
    if (searchParams.get("egreso") !== "1") return
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setEditEgreso(null)
      setFormEg(blankMovimiento())
      setErrorsEg({})
      setOpenModalEgreso(true)
      setSearchParams({}, { replace: true })
    })
    return () => {
      cancelled = true
    }
  }, [searchParams, setSearchParams])

  const load = () => bump((x) => x + 1)

  const rangoEfectivo = filtros.periodoRapido
    ? presetPeriodo(filtros.periodoRapido)
    : { desde: filtros.fechaDesde, hasta: filtros.fechaHasta }

  const desdeF = rangoEfectivo.desde
  const hastaF = rangoEfectivo.hasta

  const servicios = getServicios()
  const vehiculos = getVehiculos()
  const clientes = getClientes()
  const egresosRaw = getEgresos()
  const manualRaw = getIngresosManuales()

  const getVehiculo = (vid) =>
    vehiculos.find((v) => String(v.vehiculo_id) === String(vid))
  const getCliente = (cid) =>
    clientes.find((c) => Number(c.cliente_id) === Number(cid))

  const desdeServicios = servicios
    .map((s) => {
      const v = getVehiculo(s.vehiculo_id)
      const c = v ? getCliente(v.cliente_id) : null
      const clienteNombre = c ? `${c.nombre} ${c.apellido}`.trim() : "—"
      const vehTxt = v ? `${v.placa} · ${v.marca} ${v.modelo}` : "—"
      return {
        key: `in-${s.servicio_id}`,
        fecha: fechaServicio(s),
        monto: montoServicio(s),
        detalle: tipoLabel(s.tipo),
        tipoRaw: s.tipo || "",
        sub: clienteNombre ? `${clienteNombre} · ${vehTxt}` : vehTxt,
        fuente: "servicio"
      }
    })
    .filter((row) => row.fecha)

  const desdeManual = manualRaw.map((im) => ({
    key: `man-${im.ingreso_manual_id}`,
    fecha: im.fecha,
    monto: Number(im.monto) || 0,
    detalle: im.detalle,
    tipoRaw: "_manual",
    sub: "Manual",
    fuente: "manual",
    ingreso_manual_id: im.ingreso_manual_id
  }))

  const filasIngresoBase = [...desdeServicios, ...desdeManual].sort((a, b) =>
    a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0
  )

  const filasEgresoBase = [...egresosRaw]
    .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0))
    .map((e) => ({
      key: `out-${e.egreso_id}`,
      fecha: e.fecha,
      monto: Number(e.monto) || 0,
      detalle: e.detalle,
      egreso_id: e.egreso_id
    }))

  const filasIngreso = filasIngresoBase.filter((row) => {
    if (!fechaEnRango(row.fecha, desdeF, hastaF)) return false
    if (filtros.tipoIngreso && row.tipoRaw !== filtros.tipoIngreso) return false
    if (filtros.buscarIngreso.trim()) {
      const q = filtros.buscarIngreso.toLowerCase()
      if (!`${row.detalle} ${row.sub}`.toLowerCase().includes(q)) return false
    }
    return true
  })

  const filasEgreso = filasEgresoBase.filter((row) => {
    if (!fechaEnRango(row.fecha, desdeF, hastaF)) return false
    if (filtros.buscarEgreso.trim()) {
      const q = filtros.buscarEgreso.toLowerCase()
      if (!String(row.detalle).toLowerCase().includes(q)) return false
    }
    return true
  })

  const totalIngresos = filasIngreso.reduce((acc, r) => acc + r.monto, 0)
  const totalEgresos = filasEgreso.reduce((acc, r) => acc + r.monto, 0)
  const saldo = totalIngresos - totalEgresos

  const totalPagesIn = Math.max(1, Math.ceil(filasIngreso.length / ITEMS_PER_PAGE))
  const totalPagesOut = Math.max(1, Math.ceil(filasEgreso.length / ITEMS_PER_PAGE))
  const pageInSafe = Math.min(Math.max(1, pageIngreso), totalPagesIn)
  const pageOutSafe = Math.min(Math.max(1, pageEgreso), totalPagesOut)

  const sliceIn = (pageInSafe - 1) * ITEMS_PER_PAGE
  const paginaIngresos = filasIngreso.slice(sliceIn, sliceIn + ITEMS_PER_PAGE)
  const sliceOut = (pageOutSafe - 1) * ITEMS_PER_PAGE
  const paginaEgresos = filasEgreso.slice(sliceOut, sliceOut + ITEMS_PER_PAGE)

  const applyPeriodo = (tipo) => {
    const r = presetPeriodo(tipo)
    setPageIngreso(1)
    setPageEgreso(1)
    setFiltros((prev) => ({
      ...prev,
      periodoRapido: tipo,
      fechaDesde: r.desde,
      fechaHasta: r.hasta
    }))
  }

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setPageIngreso(1)
    setPageEgreso(1)
    if (name === "fechaDesde" || name === "fechaHasta") {
      setFiltros((prev) => ({
        ...prev,
        periodoRapido: "",
        [name]: value
      }))
    } else {
      setFiltros((prev) => ({ ...prev, [name]: value }))
    }
  }

  const limpiarFiltros = () => {
    setFiltros(initialFiltros)
    setPageIngreso(1)
    setPageEgreso(1)
  }

  const egresoCb = (e) => {
    const { name, value } = e.target
    setFormEg((prev) => ({ ...prev, [name]: value }))
    if (errorsEg[name]) setErrorsEg((prev) => ({ ...prev, [name]: "" }))
  }

  const ingCb = (e) => {
    const { name, value } = e.target
    setFormIng((prev) => ({ ...prev, [name]: value }))
    if (errorsIng[name]) setErrorsIng((prev) => ({ ...prev, [name]: "" }))
  }

  const validateMovimiento = (form) => {
    const next = {}
    const fechaErr = validateFechaNoFutura(form.fecha)
    if (fechaErr) next.fecha = fechaErr
    const montoErr = validateMonto(form.monto)
    if (montoErr) next.monto = montoErr
    const detalleErr = validateRequired(form.detalle, "El detalle")
    if (detalleErr) next.detalle = detalleErr
    return next
  }

  const submitEgreso = (ev) => {
    ev.preventDefault()
    const nextErrors = validateMovimiento(formEg)
    if (Object.keys(nextErrors).length) {
      setErrorsEg(nextErrors)
      return
    }

    try {
      if (editEgreso) {
        updateEgreso({
          egreso_id: editEgreso.egreso_id,
          fecha: formEg.fecha,
          monto: formEg.monto,
          detalle: formEg.detalle
        })
        toast.success("Egreso actualizado.")
      } else {
        createEgreso(formEg)
        toast.success("Egreso registrado.")
      }
      closeEgreso()
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const submitIngManual = (ev) => {
    ev.preventDefault()
    const nextErrors = validateMovimiento(formIng)
    if (Object.keys(nextErrors).length) {
      setErrorsIng(nextErrors)
      return
    }

    try {
      if (editIng) {
        updateIngresoManual({
          ingreso_manual_id: editIng.ingreso_manual_id,
          fecha: formIng.fecha,
          monto: formIng.monto,
          detalle: formIng.detalle
        })
        toast.success("Ingreso actualizado.")
      } else {
        createIngresoManual(formIng)
        toast.success("Ingreso registrado.")
      }
      closeIng()
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const openNewEgreso = () => {
    setEditEgreso(null)
    setFormEg(blankMovimiento())
    setErrorsEg({})
    setOpenModalEgreso(true)
  }

  const openEditEgreso = (row) => {
    setEditEgreso(row)
    setFormEg({
      fecha: row.fecha,
      monto: String(row.monto),
      detalle: row.detalle
    })
    setErrorsEg({})
    setOpenModalEgreso(true)
  }

  const closeEgreso = () => {
    setOpenModalEgreso(false)
    setEditEgreso(null)
    setFormEg(blankMovimiento())
    setErrorsEg({})
  }

  const openNewIng = () => {
    setEditIng(null)
    setFormIng(blankMovimiento())
    setErrorsIng({})
    setOpenModalIng(true)
  }

  const openEditIng = (row) => {
    setEditIng({
      ingreso_manual_id: row.ingreso_manual_id
    })
    setFormIng({
      fecha: row.fecha,
      monto: String(row.monto),
      detalle: row.detalle
    })
    setErrorsIng({})
    setOpenModalIng(true)
  }

  const closeIng = () => {
    setOpenModalIng(false)
    setEditIng(null)
    setFormIng(blankMovimiento())
    setErrorsIng({})
  }

  const handleDeleteEgreso = async (id) => {
    const ok = await confirm({
      title: "Eliminar egreso",
      message: "¿Eliminar este egreso?",
      confirmLabel: "Eliminar",
      variant: "danger"
    })
    if (!ok) return
    deleteEgreso(id)
    load()
    toast.success("Egreso eliminado.")
  }

  const handleDeleteIngManual = async (id) => {
    const ok = await confirm({
      title: "Eliminar ingreso",
      message: "¿Eliminar este ingreso manual?",
      confirmLabel: "Eliminar",
      variant: "danger"
    })
    if (!ok) return
    deleteIngresoManual(id)
    load()
    toast.success("Ingreso eliminado.")
  }

  return (
    <div className="entity-page caja-page">
      <div className="page-head page-head-row">
        <div>
          <h1>Caja</h1>
          <p>Ingresos y egresos</p>
        </div>
        <div className="actions actions--head">
          <button type="button" className="btn btn-primary" onClick={openNewIng}>
            <IconPlus size={17} /> Ingreso manual
          </button>
          <button type="button" className="btn btn-primary" onClick={openNewEgreso}>
            <IconPlus size={17} /> Egreso
          </button>
        </div>
      </div>

      <section className="caja-summary" aria-label="Resumen de caja">
        <article className="caja-summary__card caja-summary__card--in motion-card">
          <span className="caja-summary__label">Ingresos</span>
          <span className="caja-summary__amount caja-summary__amount--in">
            Bs {totalIngresos.toFixed(2)}
          </span>
          <span className="caja-summary__hint">{filasIngreso.length} ítems</span>
        </article>
        <article className="caja-summary__card caja-summary__card--out motion-card">
          <span className="caja-summary__label">Egresos</span>
          <span className="caja-summary__amount caja-summary__amount--out">
            Bs {totalEgresos.toFixed(2)}
          </span>
          <span className="caja-summary__hint">{filasEgreso.length} ítems</span>
        </article>
        <article className="caja-summary__card caja-summary__card--balance motion-card">
          <span className="caja-summary__label">Saldo</span>
          <span
            className={`caja-summary__amount ${
              saldo >= 0 ? "caja-summary__amount--ok" : "caja-summary__amount--neg"
            }`}
          >
            Bs {saldo.toFixed(2)}
          </span>
        </article>
      </section>

      <div className="panel caja-filters motion-card">
        <div className="caja-filters__head">
          <h2 className="caja-filters__title">Filtros</h2>
          <button type="button" className="btn btn-ghost" onClick={limpiarFiltros}>
            Limpiar
          </button>
        </div>
        <div className="caja-presets">
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
          </div>
        </div>
        <div className="form-grid caja-filters__grid">
          <div className="field">
            <label htmlFor="caja-desde">Desde</label>
            <input
              id="caja-desde"
              name="fechaDesde"
              type="date"
              value={filtros.fechaDesde}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="field">
            <label htmlFor="caja-hasta">Hasta</label>
            <input
              id="caja-hasta"
              name="fechaHasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="field">
            <label htmlFor="caja-tipo-ingreso">Tipo (ingresos)</label>
            <select
              id="caja-tipo-ingreso"
              name="tipoIngreso"
              value={filtros.tipoIngreso}
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              <option value="_manual">Ingresos manuales</option>
              <option value="conversion">Conversión</option>
              <option value="revision_anual">Revisión anual</option>
              <option value="recalificacion">Recalificación</option>
              <option value="venta_accesorio">Venta accesorio</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="caja-buscar-ingreso">Buscar en ingresos</label>
            <input
              id="caja-buscar-ingreso"
              name="buscarIngreso"
              placeholder="Cliente, placa o detalle"
              value={filtros.buscarIngreso}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="field">
            <label htmlFor="caja-buscar-egreso">Buscar en egresos</label>
            <input
              id="caja-buscar-egreso"
              name="buscarEgreso"
              placeholder="Texto del detalle"
              value={filtros.buscarEgreso}
              onChange={handleFiltroChange}
            />
          </div>
        </div>
      </div>

      <div className="caja-columns">
        <section className="caja-column caja-column--in motion-card" aria-labelledby="caja-ingresos-title">
          <header className="caja-column__head">
            <span className="caja-column__badge caja-column__badge--in" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <h2 id="caja-ingresos-title" className="caja-column__title">
                Ingresos
              </h2>
            </div>
          </header>
          <div className="table-wrap caja-table-wrap">
            <table className="caja-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th className="caja-table__num">Monto</th>
                  <th className="caja-table__actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filasIngreso.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="caja-table__empty">
                      No hay registros.
                    </td>
                  </tr>
                ) : (
                  paginaIngresos.map((row) => (
                    <tr key={row.key} className="caja-table__row">
                      <td>{row.fecha}</td>
                      <td>
                        <span className="caja-concept">{row.detalle}</span>
                        <span className="caja-concept-sub">{row.sub}</span>
                      </td>
                      <td className="caja-table__num caja-amount--in">+ {row.monto.toFixed(2)}</td>
                      <td className="caja-table__actions">
                        {row.fuente === "manual" ? (
                          <span className="btn-icon-cluster">
                            <button
                              type="button"
                              className="btn-icon btn-icon--edit"
                              title="Editar ingreso"
                              aria-label="Editar ingreso"
                              onClick={() => openEditIng(row)}
                            >
                              <IconPencil />
                            </button>
                            <button
                              type="button"
                              className="btn-icon btn-icon--danger"
                              title="Eliminar ingreso"
                              aria-label="Eliminar ingreso"
                              onClick={() => handleDeleteIngManual(row.ingreso_manual_id)}
                            >
                              <IconTrash />
                            </button>
                          </span>
                        ) : (
                          <span className="caja-table__dash" title="Servicios">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filasIngreso.length > 0 && totalPagesIn > 1 && (
            <div className="pagination caja-pagination">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pageInSafe === 1}
                onClick={() => setPageIngreso((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <span className="pagination-info">
                Página {pageInSafe} de {totalPagesIn}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pageInSafe === totalPagesIn}
                onClick={() => setPageIngreso((p) => Math.min(totalPagesIn, p + 1))}
              >
                Siguiente
              </button>
            </div>
          )}
        </section>

        <section className="caja-column caja-column--out motion-card" aria-labelledby="caja-egresos-title">
          <header className="caja-column__head">
            <span className="caja-column__badge caja-column__badge--out" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 19V5M5 12l7-7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <h2 id="caja-egresos-title" className="caja-column__title">
                Egresos
              </h2>
            </div>
          </header>
          <div className="table-wrap caja-table-wrap">
            <table className="caja-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Detalle</th>
                  <th className="caja-table__num">Monto</th>
                  <th className="caja-table__actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filasEgreso.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="caja-table__empty">
                      No hay registros.
                    </td>
                  </tr>
                ) : (
                  paginaEgresos.map((row) => (
                    <tr key={row.key} className="caja-table__row">
                      <td>{row.fecha}</td>
                      <td>{row.detalle}</td>
                      <td className="caja-table__num caja-amount--out">− {row.monto.toFixed(2)}</td>
                      <td className="caja-table__actions">
                        <span className="btn-icon-cluster">
                          <button
                            type="button"
                            className="btn-icon btn-icon--edit"
                            title="Editar egreso"
                            aria-label="Editar egreso"
                            onClick={() => openEditEgreso(row)}
                          >
                            <IconPencil />
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-icon--danger"
                            title="Eliminar egreso"
                            aria-label="Eliminar egreso"
                            onClick={() => handleDeleteEgreso(row.egreso_id)}
                          >
                            <IconTrash />
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filasEgreso.length > 0 && totalPagesOut > 1 && (
            <div className="pagination caja-pagination">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pageOutSafe === 1}
                onClick={() => setPageEgreso((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <span className="pagination-info">
                Página {pageOutSafe} de {totalPagesOut}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pageOutSafe === totalPagesOut}
                onClick={() => setPageEgreso((p) => Math.min(totalPagesOut, p + 1))}
              >
                Siguiente
              </button>
            </div>
          )}
        </section>
      </div>

      {openModalEgreso && (
        <Modal
          title={editEgreso ? "Egreso" : "Nuevo egreso"}
          onClose={closeEgreso}
        >
          <form className="form-in-modal" onSubmit={submitEgreso} noValidate>
            <div className="form-grid">
              <div className={`field${errorsEg.fecha ? " field--invalid" : ""}`}>
                <label htmlFor="egreso-fecha">Fecha</label>
                <input
                  id="egreso-fecha"
                  name="fecha"
                  type="date"
                  max={todayISO()}
                  value={formEg.fecha}
                  onChange={egresoCb}
                />
                <FieldError message={errorsEg.fecha} />
              </div>
              <div className={`field${errorsEg.monto ? " field--invalid" : ""}`}>
                <label htmlFor="egreso-monto">Monto (Bs)</label>
                <input
                  id="egreso-monto"
                  name="monto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formEg.monto}
                  onChange={egresoCb}
                />
                <FieldError message={errorsEg.monto} />
              </div>
              <div
                className={`field${errorsEg.detalle ? " field--invalid" : ""}`}
                style={{ gridColumn: "1 / -1" }}
              >
                <label htmlFor="egreso-detalle">Detalle</label>
                <textarea
                  id="egreso-detalle"
                  name="detalle"
                  rows={3}
                  value={formEg.detalle}
                  onChange={egresoCb}
                />
                <FieldError message={errorsEg.detalle} />
              </div>
            </div>
            <div className="actions" style={{ marginTop: "18px", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary">
                {editEgreso ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {openModalIng && (
        <Modal title={editIng ? "Ingreso manual" : "Nuevo ingreso"} onClose={closeIng}>
          <form className="form-in-modal" onSubmit={submitIngManual} noValidate>
            <div className="form-grid">
              <div className={`field${errorsIng.fecha ? " field--invalid" : ""}`}>
                <label htmlFor="ing-fecha">Fecha</label>
                <input
                  id="ing-fecha"
                  name="fecha"
                  type="date"
                  max={todayISO()}
                  value={formIng.fecha}
                  onChange={ingCb}
                />
                <FieldError message={errorsIng.fecha} />
              </div>
              <div className={`field${errorsIng.monto ? " field--invalid" : ""}`}>
                <label htmlFor="ing-monto">Monto (Bs)</label>
                <input
                  id="ing-monto"
                  name="monto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formIng.monto}
                  onChange={ingCb}
                />
                <FieldError message={errorsIng.monto} />
              </div>
              <div
                className={`field${errorsIng.detalle ? " field--invalid" : ""}`}
                style={{ gridColumn: "1 / -1" }}
              >
                <label htmlFor="ing-detalle">Detalle</label>
                <textarea
                  id="ing-detalle"
                  name="detalle"
                  rows={3}
                  value={formIng.detalle}
                  onChange={ingCb}
                />
                <FieldError message={errorsIng.detalle} />
              </div>
            </div>
            <div className="actions" style={{ marginTop: "18px", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary">
                {editIng ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
