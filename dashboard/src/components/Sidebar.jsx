import { NavLink } from "react-router-dom"
import BrandLogo from "./BrandLogo"
import { BRAND_NAME, BRAND_SHORT } from "../config/brand"

const links = [
  {
    to: "/",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    to: "/clientes",
    label: "Clientes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    to: "/vehiculos",
    label: "Vehículos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 17h14v-5l-3-4H8L5 12v5zM7 17v2M17 17v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    to: "/servicios",
    label: "Servicios",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    to: "/caja",
    label: "Caja",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 10h18M8 14h.01M12 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BrandLogo variant="sidebar" />
        <div className="brand-text">
          <h2>{BRAND_NAME}</h2>
          <span className="brand-text__tag">{BRAND_SHORT}</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Menú principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-link__icon">{link.icon}</span>
            <span className="sidebar-link__label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
