const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { closeDb } = require('./database.cjs');
const clientesRepository = require('./repositories/clientesRepository.cjs');
const vehiculosRepository = require('./repositories/vehiculosRepository.cjs');
const serviciosRepository = require('./repositories/serviciosRepository.cjs');
const egresosRepository = require('./repositories/egresosRepository.cjs');
const ingresosManualesRepository = require('./repositories/ingresosManualesRepository.cjs');

function registerIpcHandlers() {
  ipcMain.handle('clientes:getAll', () => clientesRepository.getAll());
  ipcMain.handle('clientes:create', (_event, payload) => clientesRepository.create(payload));
  ipcMain.handle('clientes:update', (_event, payload) => clientesRepository.update(payload));
  ipcMain.handle('clientes:delete', (_event, id) => clientesRepository.remove(id));

  ipcMain.handle('vehiculos:getAll', () => vehiculosRepository.getAll());
  ipcMain.handle('vehiculos:getById', (_event, id) => vehiculosRepository.getById(id));
  ipcMain.handle('vehiculos:create', (_event, payload) => vehiculosRepository.create(payload));
  ipcMain.handle('vehiculos:update', (_event, payload) => vehiculosRepository.update(payload));
  ipcMain.handle('vehiculos:delete', (_event, id) => vehiculosRepository.remove(id));

  ipcMain.handle('servicios:getAll', () => serviciosRepository.getAll());
  ipcMain.handle('servicios:create', (_event, payload) => serviciosRepository.create(payload));
  ipcMain.handle('servicios:update', (_event, payload) => serviciosRepository.update(payload));
  ipcMain.handle('servicios:delete', (_event, id) => serviciosRepository.remove(id));

  ipcMain.handle('egresos:getAll', () => egresosRepository.getAll());
  ipcMain.handle('egresos:create', (_event, payload) => egresosRepository.create(payload));
  ipcMain.handle('egresos:update', (_event, payload) => egresosRepository.update(payload));
  ipcMain.handle('egresos:delete', (_event, id) => egresosRepository.remove(id));

  ipcMain.handle('ingresosManuales:getAll', () => ingresosManualesRepository.getAll());
  ipcMain.handle('ingresosManuales:create', (_event, payload) => ingresosManualesRepository.create(payload));
  ipcMain.handle('ingresosManuales:update', (_event, payload) => ingresosManualesRepository.update(payload));
  ipcMain.handle('ingresosManuales:delete', (_event, id) => ingresosManualesRepository.remove(id));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  closeDb();
});
