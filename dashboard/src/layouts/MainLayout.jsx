import { useLocation } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

export default function MainLayout({ children }) {
  const { pathname } = useLocation()

  return (
    <div className="dashboard-layout">
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
