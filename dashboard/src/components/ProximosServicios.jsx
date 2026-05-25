import { Link } from "react-router-dom"

export default function ProximosServicios({ items = [] }) {
  return (
    <section className="dw-notifications" aria-label="Próximos servicios">
      <header className="dw-notifications__head">
        <span className="dw-notifications__bell" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.7 21a2 2 0 01-3.4 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <h2 className="dw-notifications__title">Próximos servicios (7 días)</h2>
      </header>

      {items.length === 0 ? (
        <div className="dw-notifications__empty">Sin vencimientos en este período.</div>
      ) : (
        <div className="dw-notifications__list">
          {items.map((item, index) => (
            <div className="dw-notification-card" key={`${item.servicio_id}-${index}`}>
              <div className="dw-notification-card__main">
                <strong className="dw-notification-card__client">{item.cliente_nombre}</strong>
                <p className="dw-notification-card__vehicle">
                  {item.vehiculo_placa} — {item.vehiculo_descripcion}
                </p>
              </div>
              <div className="dw-notification-card__aside">
                <span className="dw-notification-card__badge">{item.proximo_tipo}</span>
                <p className="dw-notification-card__date">{item.proxima_fecha}</p>
                <p className="dw-notification-card__urgency">
                  {item.dias_restantes === 0 ? "Hoy" : `En ${item.dias_restantes} día(s)`}
                </p>
                <Link
                  to={`/servicios?vehiculo_id=${item.vehiculo_id}`}
                  className="btn btn-ghost dw-notification-card__cta"
                >
                  Nuevo servicio
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
