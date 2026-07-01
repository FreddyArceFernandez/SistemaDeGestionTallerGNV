# 🚗 Sistema de Gestión — Taller Rixsiy GNV

Sistema web integral para la administración operativa de un taller de conversión **GNV (Gas Natural Vehicular)** en Bolivia.

La plataforma permite centralizar la gestión de clientes, vehículos, órdenes de servicio, control financiero y seguimiento de mantenimientos, reemplazando procesos manuales realizados mediante registros físicos o archivos Excel.

![Dashboard del sistema](https://github.com/user-attachments/assets/8256c29e-6f81-40ab-a6fc-09b7cacff02d)

---

# 📌 Descripción del proyecto
![Uploading image.png…]()

Este proyecto fue desarrollado como una solución personalizada para un **cliente real: Taller Rixsiy GNV**.

El sistema fue diseñado para optimizar los procesos administrativos y operativos del taller, permitiendo gestionar:

- Registro de clientes.
- Administración de vehículos.
- Control de órdenes de servicio.
- Gestión de ingresos y egresos.
- Seguimiento de mantenimientos futuros.

La aplicación se encuentra orientada a escenarios reales de operación, soportando actualmente la gestión de más de **100 órdenes de servicio activas**.

> **Nota:** Este repositorio contiene la versión pública del frontend preparada para ejecución local. Los servicios backend, configuraciones privadas y datos reales del cliente no se incluyen por confidencialidad.

---

# ✨ Características principales

## 📊 Dashboard administrativo

Panel general con información relevante del negocio:

- Cantidad de clientes registrados.
- Vehículos asociados.
- Servicios realizados.
- Resumen financiero.
- Próximos mantenimientos.

---

## 👥 Gestión de clientes

Permite administrar la información de los clientes:

- Crear nuevos registros.
- Actualizar información.
- Validación de números telefónicos bolivianos.
- Asociación con múltiples vehículos.

---

## 🚘 Gestión de vehículos

Administración completa de vehículos asociados:

- Registro de placa, marca, modelo y año.
- Control de relación cliente-vehículo.
- Acceso rápido a nuevos servicios.
- Validación de registros duplicados.

---

## 🔧 Gestión de servicios GNV

Control de órdenes relacionadas con:

- Conversión e instalación GNV.
- Recalificación.
- Revisión anual.
- Mantenimiento.
- Venta de accesorios.

Cada servicio almacena:

- Tipo de trabajo realizado.
- Fecha.
- Vehículo asociado.
- Monto generado.

---

## 💰 Control de caja

Módulo financiero para seguimiento económico:

- Registro de ingresos por servicios.
- Ingresos manuales.
- Registro de egresos.
- Cálculo de saldo.
- Filtros por rango de fechas.

---

## 🔔 Sistema de próximos servicios

Generación de alertas según ciclos de mantenimiento:

| Servicio | Periodo configurado |
|----------|--------------------|
| Conversión / Instalación GNV | 365 días |
| Revisión anual | 365 días |
| Recalificación | 5 años |

Permite identificar clientes próximos a requerir mantenimiento.

---

# 🧠 Reglas de negocio implementadas

## Integridad de información

- Un cliente no puede eliminarse si posee vehículos registrados.
- Un vehículo no puede eliminarse si tiene servicios asociados.

## Gestión de ciclos GNV

El sistema calcula automáticamente fechas futuras de mantenimiento según el tipo de servicio realizado.

## Navegación inteligente

Implementación de flujos cruzados entre módulos mediante parámetros dinámicos:


?nuevo=1
?vehiculo_id=


---

# 🏗️ Arquitectura del sistema

La aplicación está organizada bajo una arquitectura modular basada en componentes.


Frontend
│
├── Components
│ └── Componentes UI reutilizables
│
├── Pages
│ └── Módulos principales del sistema
│
├── Services
│ └── Lógica de negocio y operaciones CRUD
│
├── Context
│ └── Estados globales y notificaciones
│
├── Data
│ └── Capa de persistencia
│
└── Utils
└── Validaciones y utilidades


La separación de responsabilidades facilita una futura migración hacia una arquitectura con API REST y base de datos empresarial.

---

# 🛠️ Tecnologías utilizadas

## Frontend

| Tecnología | Uso |
|---|---|
| React 19 | Construcción de interfaz |
| Vite 8 | Herramienta de desarrollo y compilación |
| React Router 7 | Navegación SPA |
| CSS personalizado | Diseño visual y componentes |

---

## Persistencia

| Tecnología | Uso |
|---|---|
| LocalStorage | Persistencia de datos en versión demo |
| Service Layer | Abstracción de acceso a datos |

---

## Herramientas

| Tecnología | Uso |
|---|---|
| Git | Control de versiones |
| GitHub | Gestión del código |
| ESLint | Calidad y análisis estático |

---

# 📂 Estructura del proyecto


SistemaDeGestionTallerGNV/

├── README.md

└── dashboard/

├── public/

└── src/

    ├── components/
    │   └── Componentes reutilizables

    ├── config/
    │   └── Configuración del sistema

    ├── context/
    │   └── Estados globales

    ├── data/
    │   └── Persistencia local

    ├── layouts/
    │   └── Estructura principal

    ├── pages/
    │   └── Dashboard, Clientes,
    │       Vehículos, Servicios y Caja

    ├── services/
    │   └── Lógica de negocio

    ├── styles/
    │   └── Estilos globales

    └── utils/
        └── Validaciones

---

# ⚙️ Instalación y ejecución

## Requisitos

- Node.js 18+
- npm 9+

---

## Clonar repositorio

```bash
git clone https://github.com/FreddyArceFernandez/SistemaDeGestionTallerGNV.git
Acceder al proyecto
cd SistemaDeGestionTallerGNV/dashboard
Instalar dependencias
npm install
Ejecutar entorno de desarrollo
npm run dev

Aplicación disponible en:

http://localhost:5173
📜 Scripts disponibles
Comando	Descripción
npm run dev	Ejecuta servidor local
npm run build	Genera versión producción
npm run preview	Previsualiza compilación
npm run lint	Analiza calidad del código
🗄️ Modelo de datos

La versión pública utiliza almacenamiento local mediante localStorage.

Clave	Entidad
taller_clientes	Clientes
taller_vehiculos	Vehículos
taller_servicios	Órdenes de servicio
taller_egresos	Egresos
taller_ingresos_manuales	Ingresos

La capa:

src/services/

permite desacoplar la lógica del almacenamiento, facilitando la migración futura hacia:

API REST.
Base de datos SQL.
Sistema multiusuario.
🚀 Roadmap
 Backend con FastAPI / Node.js.
 Base de datos PostgreSQL/MySQL.
 Autenticación y autorización por roles.
 Gestión avanzada de cilindros GNV.
 Estados de órdenes de trabajo.
 Reportes PDF y Excel.
 Notificaciones automáticas mediante WhatsApp API.
📸 Capturas del sistema

(Agregar imágenes adicionales)

Dashboard principal.
Gestión de clientes.
Gestión de vehículos.
Órdenes de servicio.
Control de caja.
👨‍💻 Autor
Freddy Arce Fernandez

Ingeniero de Sistemas
Full-Stack Developer | Applied AI

Especializado en:

Desarrollo de aplicaciones web.
Inteligencia Artificial aplicada.
Sistemas inteligentes.
Infraestructura tecnológica.

GitHub:
https://github.com/FreddyArceFernandez

LinkedIn:
https://linkedin.com/in/freddyarcef


### Cambios frente al original:
- Subí el nivel de "proyecto de taller" → **producto software empresarial**.
- Destaco que fue usado por un cliente real.
- Agregué arquitectura y decisiones técnicas.
- La parte de limitaciones ahora no perjudica la imagen; la convierte en una explicación profesional.
- El README ahora vende tu capacidad como **Full-Stack Engineer**, no solo el código.
