import { getData, saveData } from "../data/storage";
import { getVehiculos } from "./vehiculoService";

const KEY = "taller_clientes";
const electronClientes = () => window.tallerApi?.clientes;

export const isClienteDbAvailable = () => Boolean(electronClientes());

export const getClientes = () => {
  return getData(KEY);
};

export const getClientesAsync = async () => {
  if (isClienteDbAvailable()) return electronClientes().getAll();
  return getClientes();
};

export const createCliente = async (cliente) => {
  if (isClienteDbAvailable()) return electronClientes().create(cliente);

  const clientes = getData(KEY);

  cliente.cliente_id = Date.now();

  clientes.push(cliente);

  saveData(KEY, clientes);
};

export const deleteCliente = async (id) => {
  if (isClienteDbAvailable()) return electronClientes().delete(id);

  const clienteId = Number(id);
  const vehiculos = getVehiculos().filter(
    (v) => Number(v.cliente_id) === clienteId
  );

  if (vehiculos.length > 0) {
    throw new Error("No se puede eliminar el cliente porque tiene vehiculos asociados.");
  }

  const clientes = getData(KEY);

  const nuevos = clientes.filter(c => Number(c.cliente_id) !== clienteId);

  saveData(KEY, nuevos);
};

export const updateCliente = async (clienteActualizado) => {
  if (isClienteDbAvailable()) return electronClientes().update(clienteActualizado);

  const clientes = getData(KEY)
  const id = Number(clienteActualizado.cliente_id)

  const nuevos = clientes.map((c) =>
    Number(c.cliente_id) === id ? clienteActualizado : c
  )

  saveData(KEY, nuevos)
}
