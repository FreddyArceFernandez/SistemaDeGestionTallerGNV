import { useLocation } from "react-router-dom"
import BrandLogo from "./BrandLogo"
import { BRAND_NAME } from "../config/brand"

const pageTitles = {
  "/": "Dashboard",
  "/clientes": "Clientes",
  "/vehiculos": "Vehículos",
  "/servicios": "Servicios",
  "/caja": "Caja"
}

export default function Navbar() {
  const { pathname } = useLocation()
  const pageTitle = pageTitles[pathname] ?? "Panel"

  return (
    <header className="navbar">
      <div className="navbar-title">
        <BrandLogo variant="navbar" />
        <div>
          <p className="navbar-eyebrow">{BRAND_NAME}</p>
          <h1>{pageTitle}</h1>
        </div>
      </div>
      <div className="navbar-pill">Secretaría</div>
    </header>
  )
}
