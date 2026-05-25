import { IconPencil, IconTrash } from "./CrudIcons"

function Table({ data, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Celular</th>
            <th className="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>
                No hay clientes registrados.
              </td>
            </tr>
          ) : (
            data.map((cliente) => (
              <tr key={cliente.cliente_id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.celular}</td>
                <td>
                  <div className="btn-icon-cluster">
                    <button
                      type="button"
                      className="btn-icon btn-icon--edit"
                      title="Editar"
                      aria-label="Editar cliente"
                      onClick={() => onEdit(cliente)}
                    >
                      <IconPencil />
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon--danger"
                      title="Eliminar"
                      aria-label="Eliminar cliente"
                      onClick={() => onDelete(cliente.cliente_id)}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
