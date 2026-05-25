export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="page-head">
          <h2>{title}</h2>
        </div>

        {children}

        <div className="actions" style={{ justifyContent: "flex-end", marginTop: "18px" }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}