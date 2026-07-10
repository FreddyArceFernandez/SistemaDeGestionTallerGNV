# Dashboard Taller GNV

Aplicación React + Electron del sistema de gestión local para Taller GNV.

La documentación completa del proyecto está en el archivo principal:

```txt
../README.md
```

## Comandos

```bash
npm install
npm run dev
npm run electron:dev
npm run build
npm run electron:build
npm run lint
```

## Notas técnicas

- Frontend: React, Vite y React Router.
- Escritorio: Electron.
- Base local: SQLite mediante `better-sqlite3`.
- Build Windows: Electron Builder.

Si se reinstalan dependencias o cambia la versión de Electron/Node, reconstruir módulos nativos:

```bash
npx electron-rebuild
```
