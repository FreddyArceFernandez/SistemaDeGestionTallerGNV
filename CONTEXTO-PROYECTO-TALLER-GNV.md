# CONTEXTO DEL PROYECTO — Sistema de Gestión Taller GNV

> Pega este documento completo al inicio de cada chat nuevo en Cursor.
> No escanees el proyecto para "entenderlo" — toda la info que necesitas está acá.
> Trabaja SOLO en los archivos que te indique en cada tarea. No toques nada fuera de ese alcance.

## 1. Qué es el proyecto

Sistema de gestión interno para un taller de conversión/mantenimiento de vehículos a GNV
(Gas Natural Vehicular) en Bolivia. Lo usa el dueño/operador del taller para llevar control de
clientes, vehículos, servicios realizados, pagos y vencimientos de recalificación de cilindros GNV.

- **No es un producto público**, es una herramienta interna de un solo taller.
- **Uso real en producción**, no es un prototipo — hay que tratar los datos con cuidado.

## 2. Stack técnico

- React + Vite
- Sin backend: todos los datos se guardan en **localStorage del navegador**
- Sin base de datos externa, sin autenticación de usuarios
- CSS propio + Bootstrap (`public/css/bootstrap.min.css`) + Font Awesome

## 3. Estructura del proyecto

```
dashboard/
├─ src/
│  ├─ App.jsx / App.css / main.jsx / index.css
│  ├─ assets/            → imágenes (hero.png, etc.)
│  ├─ components/
│  │  ├─ CilindroForm.jsx
│  │  ├─ ClienteForm.jsx
│  │  ├─ Modal.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ PagoForm.jsx
│  │  ├─ ProximosServicios.jsx
│  │  ├─ ServicioForm.jsx
│  │  ├─ Sidebar.jsx
│  │  ├─ StatCard.jsx        ← posible código muerto, verificar uso real
│  │  ├─ Table.jsx
│  │  └─ VehiculoForm.jsx
│  ├─ data/
│  │  └─ storage.js          ← capa CENTRAL de acceso a localStorage (ver sección 5)
│  ├─ layouts/
│  │  ├─ DashboardLayout.jsx ← posible duplicado/código muerto, verificar cuál se usa
│  │  └─ MainLayout.jsx
│  ├─ pages/
│  │  ├─ Cilindros.jsx
│  │  ├─ Clientes.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ Pagos.jsx           ← este es el módulo de caja/ingresos-egresos
│  │  ├─ Servicios.jsx
│  │  └─ Vehiculos.jsx
│  ├─ services/
│  │  ├─ alertService.js     ← lógica de alertas/vencimientos GNV
│  │  ├─ cilindroService.js
│  │  ├─ clienteService.js
│  │  ├─ pagoService.js
│  │  ├─ servicioService.js
│  │  └─ vehiculoService.js
│  └─ styles/dashboard.css
```

**Nota de nomenclatura:** en conversaciones previas nos referimos al módulo de ingresos/egresos
como "Caja". En el código real, ese módulo es `pages/Pagos.jsx` + `services/pagoService.js`.
Cuando se hable de "Caja", es este módulo.

**Módulo Cilindros:** no documentado antes en detalle. Se asume que gestiona el control y
vencimiento de recalificación de cilindros GNV por vehículo. Verificar con el código real antes
de asumir su estructura interna.

## 4. Claves de localStorage

| Clave | Contenido |
|---|---|
| `taller_clientes` | Clientes |
| `taller_vehiculos` | Vehículos |
| `taller_servicios` | Servicios |
| `taller_egresos` | Egresos de caja |
| `taller_ingresos_manuales` | Ingresos manuales |

Los datos viven por navegador/PC, no se sincronizan entre dispositivos.

## 5. Convenciones de código YA establecidas (respetarlas, no reinventar)

- **Acceso a localStorage:** todo pasa por `data/storage.js`. Cualquier función nueva de
  export/import/backup debe agregarse ahí, no acceder a `localStorage` directo desde componentes.
- **Avisos al usuario:** existe un sistema global de toasts y confirmaciones
  (`context/UiProvider`, `context/useUi.js`, `context/ui-store.js`). **Nunca usar `alert()` ni
  `confirm()` nativos** — usar este sistema.
- **Validaciones:** centralizadas en `utils/validation.js`, con componente `FieldError.jsx`
  para mostrar errores debajo del campo (no popups). Reglas ya definidas:
  - Celular: 8 dígitos, empieza en 6 o 7 (acepta prefijo 591)
  - Placa: obligatoria, 3–10 caracteres, única en el sistema
  - Fechas: no futuras en servicios, egresos e ingresos
  - Montos: obligatorios y ≥ 0

## 6. Estado actual del proyecto (ya implementado)

- Reset inicial de datos (versión controlada, ejecuta una sola vez)
- Toasts y modales de confirmación reemplazando `alert()`/`confirm()`
- Validaciones de formularios con errores inline
- Atajos de flujo rápido: botones en Dashboard (nuevo cliente / servicio / egreso), navegación
  rápida Cliente→Vehículo y Vehículo→Servicio con datos precargados

`npm run lint` y `npm run build` pasan sin errores a la fecha del último cambio.

## 7. Pendientes, en orden de prioridad

1. **Backup y restauración de datos** (urgente — hoy no hay forma de recuperar datos si se
   pierde el localStorage). Pantalla de Ajustes: exportar JSON, importar JSON, vaciar datos con
   confirmación.
2. Estado "cobrado / pendiente" en servicios + cola de pagos pendientes en Pagos (Caja)
3. Pantalla de cobro con QR (QR del banco + monto + código de referencia)
4. Ficha por vehículo (historial completo) + botón WhatsApp/llamar en próximos servicios
5. Recibo/comprobante imprimible + exportar CSV de Pagos (Caja)
6. Limpiar código muerto: revisar `ClienteForm.jsx` (posibles restos de llamadas a
   `axios`/API en `127.0.0.1:8000` sin uso), `DashboardLayout.jsx` vs `MainLayout.jsx`,
   `StatCard.jsx`, `App.css`, README desactualizado
7. Detección de pagos por correo (opcional, a futuro)
8. Instalar como PWA para uso local en la PC del taller

## 8. Reglas de trabajo para Cursor

- Antes de escribir código, confirmar en qué archivo(s) exactos se va a trabajar (te los
  indicaré en cada prompt).
- No re-escanear ni "entender" el proyecto completo — usa este documento como fuente de verdad.
- No modificar archivos fuera del alcance indicado en la tarea.
- Mantener el estilo ya existente: toasts vía `useUi`, validaciones vía `utils/validation.js` +
  `FieldError`, acceso a datos vía `data/storage.js`.
- Un chat nuevo por cada tarea/funcionalidad — no acumular tareas distintas en el mismo hilo.
- Si algo del código real no coincide con lo descrito acá (por ejemplo, la estructura interna de
  `Cilindros`), avisar antes de asumir y seguir.
