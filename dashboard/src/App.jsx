import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Vehiculos from "./pages/Vehiculos";
import Servicios from "./pages/Servicios";
import Caja from "./pages/Caja";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/caja" element={<Caja />} />
      </Routes>
    </MainLayout>
  );
}

export default App;