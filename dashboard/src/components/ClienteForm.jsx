import { useState } from "react"
import axios from "axios"

function ClienteForm({ cerrar }) {

  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")

  const guardarCliente = async (e) => {
    e.preventDefault()

    const nuevoCliente = {
      nombre: nombre,
      telefono: telefono,
      email: email
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/clientes/", nuevoCliente)
      cerrar()
    } catch (error) {
      console.error(error)
      alert("Error al guardar el cliente")
    }
  }

  return (
    <form onSubmit={guardarCliente}>

      <h2>Nuevo Cliente</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Guardar</button>

      <button type="button" onClick={cerrar}>
        Cancelar
      </button>

    </form>
  )
}

export default ClienteForm