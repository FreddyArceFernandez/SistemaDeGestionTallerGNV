## 📋 Descripción

Esta aplicación centraliza la administración de clientes, vehículos, órdenes de servicio y flujo de caja del taller, reemplazando el registro manual en papel/Excel por un sistema digital con seguimiento en tiempo real.

## ✨ Funcionalidades principales
<img width="1908" height="963" alt="image" src="https://github.com/user-attachments/assets/8256c29e-6f81-40ab-a6fc-09b7cacff02d" />

- **Gestión de clientes**: registro y consulta de datos de clientes.
- **Gestión de vehículos**: vinculación de vehículos a cada cliente, con historial de servicios.
- **Órdenes de servicio**: creación y seguimiento del estado de las órdenes en tiempo real.
- **Gestión de cilindros GNV**: control específico de los cilindros instalados por vehículo.
- **Módulo de pagos**: registro de pagos y control de flujo de caja del taller.
- **Próximos servicios**: identificación de clientes con mantenimiento próximo, generando una fuente de ingreso recurrente.
- **Dashboard**: panel con estadísticas clave del negocio (StatCard, tablas resumen).

## 🛠️ Stack tecnológico

**Frontend**
- React
- Vite
- CSS personalizado + Bootstrap

**Backend**
- Node.js
- PHP
- MySQL (base de datos normalizada a 3FN)

**Herramientas**
- Git / GitHub
- VS Code

## 📁 Estructura del proyecto
sistemaTaller
└─ dashboard
├─ src
│  ├─ components/       # Formularios y componentes reutilizables
│  ├─ pages/             # Vistas principales (Clientes, Vehículos, Pagos, etc.)
│  ├─ services/          # Lógica de conexión a la API
│  ├─ layouts/           # Estructura general del dashboard
│  └─ data/              # Manejo de almacenamiento local
└─ public/                # Recursos estáticos

## 🚀 Cómo ejecutar el proyecto localmente

```bash
# Clonar el repositorio
git clone https://github.com/FreddyArceFernandez/SistemaDeGestionTallerGNV.git

# Entrar a la carpeta del dashboard
cd SistemaDeGestionTallerGNV/dashboard

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El proyecto quedará disponible en `http://localhost:5173` (puerto por defecto de Vite).

## 📊 Resultados en producción

- Más de 100 órdenes de servicio activas gestionadas actualmente por el cliente.
- Sistema de seguimiento de próximos servicios que ha generado una fuente de ingreso recurrente para el negocio.
- 0 interrupciones operativas desde su puesta en marcha.

## 👤 Autor

**Freddy Arce Fernandez**
Ingeniero de Sistemas — Full-Stack & IA Aplicada
[LinkedIn](https://www.linkedin.com/in/freddyarcef) · [GitHub](https://github.com/FreddyArceFernandez)

## 📝 Notas

Proyecto desarrollado de forma independiente para un cliente real (taller de conversión GNV). Por motivos de confidencialidad, algunos datos de configuración/producción no están incluidos en este repositorio.
