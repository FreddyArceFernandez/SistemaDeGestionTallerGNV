export default function FinanceWidget({ ingresos, numServicios, ticketPromedio, alertasHoy }) {
  return (
    <article className="dw-panel dw-panel--finance">
      <header className="dw-panel__head">
        <span className="dw-panel__icon dw-panel__icon--gold" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v10M9.5 10h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <h2 className="dw-panel__title">Finanzas</h2>
      </header>

      <div className="dw-finance__hero">
        <span className="dw-finance__currency">Bs</span>
        <span className="dw-finance__amount">{ingresos.toFixed(2)}</span>
      </div>

      <div className="dw-finance__grid">
        <div className="dw-mini-card">
          <span className="dw-mini-card__icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="dw-mini-card__val">{numServicios}</span>
          <span className="dw-mini-card__lbl">Trabajos</span>
        </div>
        <div className="dw-mini-card">
          <span className="dw-mini-card__icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 14l3-3 4 4 3-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <span className="dw-mini-card__val">Bs {ticketPromedio.toFixed(2)}</span>
          <span className="dw-mini-card__lbl">Ticket prom.</span>
        </div>
        <div className="dw-mini-card dw-mini-card--alert">
          <span className="dw-mini-card__icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v5M12 17h.01M10.3 3.2L2.6 18c-.5 1 .1 2.2 1.3 2.2h16.2c1.2 0 1.8-1.2 1.3-2.2L13.7 3.2c-.6-1-2-1-2.4 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="dw-mini-card__val">{alertasHoy}</span>
          <span className="dw-mini-card__lbl">Alertas</span>
        </div>
      </div>
    </article>
  )
}
