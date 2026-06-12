import { useLocation } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

export default function MainLayout({ children }) {
  const { pathname } = useLocation()

  return (
    <div className="dashboard-layout">
      <div className="dashboard-layout__bg" aria-hidden>
        <span className="dashboard-blob dashboard-blob--1" />
        <span className="dashboard-blob dashboard-blob--2" />
        <span className="dashboard-blob dashboard-blob--3" />
      </div>

      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <main className="dashboard-main__content view-transition" key={pathname}>
          {children}
        </main>
      </div>
    </div>
  )
}
