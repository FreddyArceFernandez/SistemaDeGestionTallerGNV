# Sistema de Gestión Taller GNV

Sistema local de gestión operativa para un taller de conversión y mantenimiento GNV. Está pensado para el trabajo diario de secretaría: registrar clientes, vehículos, servicios, movimientos de caja y próximos mantenimientos desde una interfaz de escritorio clara y rápida.

El proyecto funciona como aplicación React y está preparado para distribución en Windows mediante Electron.

![Dashboard del sistema](https://github.com/user-attachments/assets/8256c29e-6f81-40ab-a6fc-09b7cacff02d)

## Objetivo

Centralizar la gestión básica del taller sin depender de archivos Excel, registros físicos o conexión permanente a internet.

El sistema permite:

- Registrar y consultar clientes.
- Asociar vehículos a cada cliente.
- Registrar servicios GNV realizados.
- Controlar ingresos, otros ingresos y egresos.
- Revisar próximos mantenimientos.
- Ejecutar la aplicación localmente como sistema de escritorio.

## Enfoque de uso

El sistema está diseñado para ser usado principalmente por una secretaria o persona encargada de la administración del taller.

Por esa razón:

- No se implementa un sistema complejo de roles.
- La prioridad es rapidez de registro y búsqueda.
- La interfaz está orientada a tareas administrativas repetitivas.
- La persistencia está pensada para uso local.
- La aplicación puede entregarse como instalador de Windows.

## Características principales

### Dashboard

Panel inicial con indicadores generales:

- Total de clientes.
- Total de vehículos.
- Total de trabajos registrados.
- Próximos servicios o mantenimientos.
- Resumen financiero.

### Clientes

Módulo para administrar el directorio de clientes:

- Crear clientes.
- Editar datos.
- Eliminar clientes sin vehículos asociados.
- Buscar por nombre, apellido o celular.
- Acceder rápidamente al registro de vehículos.
- Validar teléfonos bolivianos.

### Vehículos

Módulo para administrar vehículos asociados a clientes:

- Registrar placa, marca, modelo y año.
- Evitar placas duplicadas.
- Buscar por cliente, placa, marca, modelo o año.
- Crear servicios directamente desde el vehículo.
- Bloquear eliminación cuando existen servicios asociados.

### Servicios

Módulo para registrar trabajos realizados:

- Conversión o instalación GNV.
- Revisión anual.
- Recalificación.
- Mantenimiento.
- Venta de accesorios.

Cada servicio registra:

- Vehículo.
- Tipo de servicio.
- Fecha.
- Descripción u observaciones.
- Monto cobrado.

### Caja

Módulo financiero simplificado para gestión diaria:

- Los servicios con monto se suman automáticamente como ingresos.
- Los movimientos externos se registran como `Otros ingresos`.
- Los egresos se registran por separado.
- El saldo se calcula automáticamente.
- Se puede filtrar por día, semana, mes o rango de fechas.

Regla importante:

```txt
Saldo = ingresos por servicios + otros ingresos - egresos
```

Para evitar duplicaciones, la interfaz aclara que no se debe registrar como `Otro ingreso` un dinero que ya proviene de un servicio registrado.

### Próximos servicios

El sistema calcula mantenimientos futuros según ciclos GNV:

| Servicio | Periodo configurado |
|---|---:|
| Conversión / instalación GNV | 365 días |
| Revisión anual | 365 días |
| Recalificación | 5 años |

## Reglas de negocio

- Un cliente no puede eliminarse si tiene vehículos registrados.
- Un vehículo no puede eliminarse si tiene servicios registrados.
- Una placa no puede repetirse.
- Un servicio solo puede registrarse sobre un vehículo existente.
- Los servicios con monto alimentan automáticamente la caja.
- Los próximos mantenimientos se calculan según el tipo de servicio.

## Arquitectura

```txt
SistemaDeGestionTallerGNV/
├── README.md
└── dashboard/
    ├── electron/
    │   ├── main.cjs
    │   ├── preload.cjs
    │   ├── database.cjs
    │   └── repositories/
    ├── public/
    └── src/
        ├── components/
        ├── config/
        ├── context/
        ├── data/
        ├── layouts/
        ├── pages/
        ├── services/
        ├── styles/
        └── utils/
```

## Tecnologías

| Tecnología | Uso |
|---|---|
| React 19 | Interfaz de usuario |
| Vite 8 | Desarrollo y compilación |
| React Router 7 | Navegación SPA |
| Electron 43 | Aplicación de escritorio |
| better-sqlite3 | Base de datos local SQLite |
| Electron Builder | Instalador para Windows |
| ESLint | Revisión estática |
| CSS personalizado | Diseño visual |

## Persistencia de datos

El proyecto utiliza SQLite local cuando se ejecuta como aplicación de escritorio con Electron.

Estado actual:

- `Clientes` trabaja con SQLite local dentro de Electron.
- `Vehículos` trabaja con SQLite local dentro de Electron.
- `Servicios` trabaja con SQLite local dentro de Electron.
- `Caja`, egresos y otros ingresos trabajan con SQLite local dentro de Electron.
- Al abrir la app solo en navegador, se conserva un respaldo basado en `localStorage` para desarrollo.

La base SQLite se crea en el directorio de datos de usuario de Electron, no dentro del repositorio.

En Windows, la ruta es similar a:

```txt
C:\Users\Usuario\AppData\Roaming\Taller GNV\data\taller_gnv.db
```

## Instalación

Requisitos recomendados:

- Node.js 18 o superior.
- npm.
- Windows para generar instalador con Electron Builder.

Clonar el repositorio:

```bash
git clone https://github.com/FreddyArceFernandez/SistemaDeGestionTallerGNV.git
cd SistemaDeGestionTallerGNV/dashboard
npm install
```

Si se usa `better-sqlite3` con Electron, reconstruir módulos nativos cuando sea necesario:

```bash
npx electron-rebuild
```

Este paso solo suele ser necesario si se reinstala `node_modules`, cambia Electron, cambia Node o se actualiza `better-sqlite3`.

## Ejecución en desarrollo

Modo web:

```bash
npm run dev
```

Aplicación disponible en:

```txt
http://localhost:5173
```

Modo escritorio con Electron:

```bash
npm run electron:dev
```

## Generar versión de producción

Compilar frontend:

```bash
npm run build
```

Generar instalador de Windows:

```bash
npm run electron:build
```

La salida del instalador se genera en:

```txt
dashboard/dist_electron/
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta Vite en modo desarrollo |
| `npm run build` | Genera la versión web de producción |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | Ejecuta ESLint |
| `npm run electron:dev` | Ejecuta Vite y abre Electron |
| `npm run electron:build` | Genera build e instalador Electron |

## Validaciones

Últimas verificaciones realizadas:

```bash
npm run lint
npm run build
```

Ambas tareas compilan correctamente en el estado actual del proyecto.

## Roadmap

Próximas mejoras recomendadas:

- Agregar backups locales automáticos.
- Agregar restauración de backups.
- Implementar cierre diario de caja.
- Generar reportes PDF y Excel.
- Crear orden de servicio imprimible.
- Agregar protección simple por PIN o contraseña local.
- Mejorar instalador final con ícono, nombre e información del taller.

## Autor

Freddy Arce Fernandez

Ingeniero de Sistemas  
Full-Stack Developer | Applied AI

GitHub: [FreddyArceFernandez](https://github.com/FreddyArceFernandez)  
LinkedIn: [freddyarcef](https://linkedin.com/in/freddyarcef)
