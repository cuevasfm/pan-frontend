# Frontend - Sistema de Gestión de Pedidos para Panadería Artesanal

Aplicación web moderna desarrollada con React para gestionar pedidos, productos, insumos y generar reportes de producción para una panadería artesanal.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Material UI (MUI)** - Componentes de UI
- **Tailwind CSS** - Estilos adicionales
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Context API** - Gestión de estado

## 📋 Requisitos Previos

- Node.js 16 o superior
- npm o yarn
- Backend corriendo en `http://localhost:5000`

## ⚙️ Instalación

1. **Instalar dependencias:**
```bash
cd frontend
npm install
```

2. **Configurar conexión al backend:**

El proyecto está configurado para usar un proxy en `vite.config.js` que redirige `/api` a `http://localhost:5000`. Si tu backend está en otra URL, modifica el archivo `vite.config.js`:

```javascript
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://tu-backend-url:puerto',
        changeOrigin: true
      }
    }
  }
})
```

## 🏃‍♂️ Ejecución

**Modo desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

**Compilar para producción:**
```bash
npm run build
```

**Previsualizar build de producción:**
```bash
npm run preview
```

## 📱 Características

### 🔐 Autenticación
- Login con teléfono y contraseña
- Gestión de sesión con JWT
- Roles: Administrador y Cliente

### 📊 Dashboard
- Resumen de estadísticas
- Tarjetas con métricas principales
- Accesos rápidos a funcionalidades

### 👥 Gestión de Clientes (Admin)
- Listado de clientes
- Búsqueda por nombre o teléfono
- Crear, editar y eliminar clientes
- Campos: teléfono, nombre, domicilio

### 🍞 Gestión de Productos (Admin)
- Catálogo de productos en tarjetas
- Crear, editar y eliminar productos
- Ver receta de cada producto
- Precio y descripción

### 📦 Gestión de Insumos (Admin)
- Listado de insumos con unidades
- Precio por unidad base
- Control de stock
- Crear, editar y eliminar insumos

### 📅 Fechas de Producción (Admin)
- Crear fechas de horneado
- Definir fecha límite de pedidos
- Abrir/cerrar fechas
- Notas adicionales

### 🛒 Gestión de Pedidos
- Crear pedidos para clientes
- Seleccionar fecha de producción
- Agregar múltiples productos
- Ver detalle de pedidos
- Estados: pendiente, confirmado, en preparación, entregado, cancelado

### 📈 Reportes (Admin)
- Reporte completo por fecha de producción
- Cálculo automático de insumos necesarios
- Lista de compras
- Análisis financiero:
  - Costo de insumos
  - Total de ventas
  - Margen de ganancia
  - Porcentaje de margen
- Resumen de productos a hornear
- Lista de pedidos por cliente
- Opción de imprimir

## 🎨 Diseño

### Tema de Colores
- **Principal:** Naranja (#d97706) - Color panadería
- **Secundario:** Marrón (#78350f) - Color pan
- **Fondo:** Crema (#fef3c7)
- **Papel:** Blanco (#ffffff)

### Componentes Material UI
- AppBar con menú lateral responsivo
- Cards con elevación y bordes redondeados
- Tablas con paginación
- Dialogs para formularios
- Chips para estados
- Botones con iconos

### Responsividad
- Menú lateral se colapsa en móvil
- Grids adaptables
- Tablas con scroll horizontal
- Breakpoints de MUI

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Layout principal con sidebar
│   │   └── PrivateRoute.jsx     # Protección de rutas
│   ├── context/
│   │   └── AuthContext.jsx      # Context de autenticación
│   ├── pages/
│   │   ├── Login.jsx            # Página de login
│   │   ├── Dashboard.jsx        # Dashboard principal
│   │   ├── Clientes.jsx         # Gestión de clientes
│   │   ├── Productos.jsx        # Gestión de productos
│   │   ├── Insumos.jsx          # Gestión de insumos
│   │   ├── Pedidos.jsx          # Gestión de pedidos
│   │   ├── FechasProduccion.jsx # Gestión de fechas
│   │   └── Reportes.jsx         # Reportes de producción
│   ├── services/
│   │   └── api.js               # Servicios de API
│   ├── utils/
│   │   └── formatters.js        # Funciones de formato
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔒 Roles y Permisos

### Administrador
Acceso completo a:
- Dashboard
- Gestión de clientes
- Gestión de productos e insumos
- Gestión de pedidos
- Fechas de producción
- Reportes completos

### Cliente (Futuro)
Acceso a:
- Dashboard
- Sus propios pedidos
- Crear pedidos (fechas abiertas)

## 🛠️ Servicios de API

El archivo `services/api.js` contiene todos los servicios para comunicarse con el backend:

- **clienteService** - CRUD de clientes
- **productoService** - CRUD de productos y recetas
- **insumoService** - CRUD de insumos
- **unidadService** - Gestión de unidades y conversiones
- **fechaProduccionService** - CRUD de fechas
- **pedidoService** - CRUD de pedidos
- **reporteService** - Generación de reportes

## 🎯 Funcionalidades Principales

### 1. Sistema de Autenticación
- Login con JWT
- Context API para gestión de estado de usuario
- Protección de rutas por rol
- Persistencia de sesión en localStorage

### 2. Gestión de Pedidos
- Interfaz intuitiva para crear pedidos
- Validación de fechas abiertas
- Cálculo automático de totales
- Gestión de estados de pedidos

### 3. Reportes de Producción
- Selección de fecha de producción
- Cálculo automático de insumos necesarios
- Conversión de unidades automática
- Análisis de costos y márgenes
- Lista de compras imprimible

### 4. Interfaz Responsiva
- Diseño adaptable a móviles y tablets
- Menú lateral colapsable
- Tablas con scroll en móviles
- Formularios optimizados

## 🐛 Solución de Problemas

**Error de conexión con el backend:**
- Verifica que el backend esté corriendo en `http://localhost:5000`
- Revisa la configuración del proxy en `vite.config.js`

**Error 401 (No autorizado):**
- El token puede haber expirado, vuelve a iniciar sesión
- Verifica que el backend acepte el token JWT

**No se cargan los datos:**
- Abre la consola del navegador (F12) para ver errores
- Verifica que el backend tenga datos de seed

**Error al compilar:**
- Elimina `node_modules` y ejecuta `npm install` nuevamente
- Limpia el caché de Vite: `npm run dev -- --force`

## 📝 Buenas Prácticas

1. **Componentes reutilizables:** Los componentes están diseñados para ser reutilizables
2. **Gestión de estado:** Context API para estado global, useState para local
3. **Manejo de errores:** Try-catch en todas las llamadas API
4. **Feedback al usuario:** Alertas de éxito/error en todas las operaciones
5. **Loading states:** Indicadores de carga en operaciones asíncronas
6. **Validación:** Validación de formularios antes de enviar

## 🚀 Próximas Mejoras

- [ ] Panel de cliente para hacer sus propios pedidos
- [ ] Notificaciones en tiempo real
- [ ] Historial de pedidos con filtros avanzados
- [ ] Exportar reportes a PDF
- [ ] Dashboard con gráficas
- [ ] Modo oscuro
- [ ] PWA para uso offline

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ para panaderías artesanales**

