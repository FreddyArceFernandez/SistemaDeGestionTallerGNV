import { getClientes } from "../services/clienteService"
import { getVehiculos } from "../services/vehiculoService"
import { getServicios } from "../services/servicioService"
import { getUpcomingServices } from "../services/alertService"
import ProximosServicios from "../components/ProximosServicios"
import MetricWidget from "../components/dashboard/MetricWidget"
import OperationsWidget from "../components/dashboard/OperationsWidget"
import FinanceWidget from "../components/dashboard/FinanceWidget"

function montoServicio(s) {
  return Number(s.monto ?? s.costo_total ?? 0) || 0
}

export default function Dashboard() {
  const clientes = getClientes()
  const vehiculos = getVehiculos()
  const servicios = getServicios()
  const proximos = getUpcomingServices(7)

  const totalServicios = servicios.length
  const ingresos = servicios.reduce((acc, s) => acc + montoServicio(s), 0)
  const promedioTicket = totalServicios ? ingresos / totalServicios : 0
  const upcomingHoy = proximos.filter((item) => item.dias_restantes === 0).length

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__intro">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general</p>
        </div>
      </header>

      <ProximosServicios items={proximos.slice(0, 5)} />

      <section className="dashboard-metrics-row" aria-label="Métricas">
        <MetricWidget
          label="Clientes"
          value={clientes.length}
          hint="Total"
          accent="navy"
        >
          <span className="dw-metric__glyph" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </MetricWidget>
        <MetricWidget
          label="Vehículos"
          value={vehiculos.length}
          hint="Total"
          accent="blue"
        >
          <span className="dw-metric__glyph" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 17h14v-5l-3-4H8L5 12v5zM7 17v2M17 17v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </MetricWidget>
        <MetricWidget
          label="Trabajos"
          value={totalServicios}
          hint="Total"
          accent="amber"
        >
          <span className="dw-metric__glyph" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </MetricWidget>
        <MetricWidget
          label="Próximos 7 días"
          value={proximos.length}
          hint="Vencimientos"
          accent="green"
        >
          <span className="dw-metric__glyph" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 3v4M16 3v4M4 11h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </MetricWidget>
      </section>

      <section className="dashboard-widgets-row" aria-label="Resumen financiero">
        <OperationsWidget
          totalServicios={totalServicios}
          ingresosTotales={ingresos}
          montoPromedio={promedioTicket}
        />
        <FinanceWidget
          ingresos={ingresos}
          numServicios={totalServicios}
          ticketPromedio={promedioTicket}
          alertasHoy={upcomingHoy}
        />
      </section>
    </div>
  )
}
