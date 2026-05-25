import { useState } from "react"
import Table from "../components/Table"
import Modal from "../components/Modal"
import { IconPlus } from "../components/CrudIcons"

import {
  getClientes,
  createCliente,
  deleteCliente,
  updateCliente
} from "../services/clienteService"

function Clientes() {

  const [clientes, setClientes] = useState(() => getClientes());

  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    celular: ""
  });

  const [editing, setEditing] = useState(false);

  const loadClientes = () => {
    const data = getClientes();
    setClientes(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    try {
      if (editing) {
        updateCliente(form);
      } else {
        createCliente(form);
      }
    } catch (error) {
      alert(error.message);
      return;
    }

    setForm({
      nombre: "",
      apellido: "",
      celular: ""
    });

    setEditing(false);

    setOpenModal(false);

    loadClientes();
  };

  const handleDelete = (id) => {
    if (confirm("¿Eliminar cliente?")) {
      try {
        deleteCliente(id);
        loadClientes();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEdit = (cliente) => {
    setForm(cliente)
    setEditing(true)
    setOpenModal(true)
  }

  const openNuevoCliente = () => {
    setEditing(false)
    setForm({
      nombre: "",
      apellido: "",
      celular: ""
    })
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setEditing(false)
  }

  return (
    <div className="entity-page">
      <div className="page-head page-head-row">
        <div>
          <h1>Clientes</h1>
          <p>Directorio</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNuevoCliente}>
          <IconPlus size={17} /> Nuevo cliente
        </button>
      </div>

      <Table
        data={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {openModal && (

        <Modal
          title={editing ? "Editar" : "Nuevo"}
          onClose={closeModal}
        >
          <div className="form-grid">
            <div className="field">
              <label htmlFor="cliente-nombre">Nombre</label>
              <input
                id="cliente-nombre"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="cliente-apellido">Apellido</label>
              <input
                id="cliente-apellido"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="cliente-celular">Celular</label>
              <input
                id="cliente-celular"
                name="celular"
                placeholder="Celular"
                value={form.celular}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="actions" style={{ marginTop: "14px", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </Modal>

      )}

    </div>
  );
}

export default Clientes;