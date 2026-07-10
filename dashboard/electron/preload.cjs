const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("tallerApi", {
  clientes: {
    getAll: () => ipcRenderer.invoke("clientes:getAll"),
    create: (payload) => ipcRenderer.invoke("clientes:create", payload),
    update: (payload) => ipcRenderer.invoke("clientes:update", payload),
    delete: (id) => ipcRenderer.invoke("clientes:delete", id)
  },
  vehiculos: {
    getAll: () => ipcRenderer.invoke("vehiculos:getAll"),
    getById: (id) => ipcRenderer.invoke("vehiculos:getById", id),
    create: (payload) => ipcRenderer.invoke("vehiculos:create", payload),
    update: (payload) => ipcRenderer.invoke("vehiculos:update", payload),
    delete: (id) => ipcRenderer.invoke("vehiculos:delete", id)
  },
  servicios: {
    getAll: () => ipcRenderer.invoke("servicios:getAll"),
    create: (payload) => ipcRenderer.invoke("servicios:create", payload),
    update: (payload) => ipcRenderer.invoke("servicios:update", payload),
    delete: (id) => ipcRenderer.invoke("servicios:delete", id)
  },
  egresos: {
    getAll: () => ipcRenderer.invoke("egresos:getAll"),
    create: (payload) => ipcRenderer.invoke("egresos:create", payload),
    update: (payload) => ipcRenderer.invoke("egresos:update", payload),
    delete: (id) => ipcRenderer.invoke("egresos:delete", id)
  },
  ingresosManuales: {
    getAll: () => ipcRenderer.invoke("ingresosManuales:getAll"),
    create: (payload) => ipcRenderer.invoke("ingresosManuales:create", payload),
    update: (payload) => ipcRenderer.invoke("ingresosManuales:update", payload),
    delete: (id) => ipcRenderer.invoke("ingresosManuales:delete", id)
  }
})
