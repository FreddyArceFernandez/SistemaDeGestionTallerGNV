export default function OperationsWidget({ totalServicios, ingresosTotales, montoPromedio }) {
  return (
    <article className="dw-panel dw-panel--ops">
      <header className="dw-panel__head">
        <span className="dw-panel__icon" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 19V5M4 19h16M8 16V9m4 7V6m4 10v-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <h2 className="dw-panel__title">Trabajos</h2>
      </header>

      <div className="dw-ops__body">
        <div className="dw-ring-wrap">
          <div className="dw-ring" style={{ background: "conic-gradient(var(--blue) 100%, #e2e8f0 0)" }}>
            <div className="dw-ring__inner">
              <span className="dw-ring__pct">{totalServicios}</span>
              <span className="dw-ring__lbl">Total</span>
            </div>
          </div>
        </div>

        <div className="dw-ops__stats">
          <div className="dw-stat-chip">
            <span className="dw-stat-chip__n">Bs {ingresosTotales.toFixed(2)}</span>
            <span className="dw-stat-chip__t">Ingresos</span>
          </div>
          <div className="dw-stat-chip dw-stat-chip--ok">
            <span className="dw-stat-chip__n">Bs {montoPromedio.toFixed(2)}</span>
            <span className="dw-stat-chip__t">Promedio</span>
          </div>
        </div>
      </div>
    </article>
  )
}
