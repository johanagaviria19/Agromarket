# 🌿 AgroMarket — Marketplace Agrícola de Nariño

**Proyecto final — Electiva Angular**

AgroMarket es una aplicación web que conecta agricultores y compradores de la región de Nariño, Colombia. Permite explorar productos del campo, gestionar solicitudes de compra y administrar el catálogo de cada productor, todo sin necesidad de un backend gracias al uso de Local Storage.

---

## Integrantes del equipo

| Nombre | Rol principal |
|--------|--------------|
| Pedro | Componentes de catálogo y detalle |
| Johan | Dashboards y sistema de autenticación |
| Esteban | Landing page y diseño del sistema |
| Catalina | Base del proyecto y estructura inicial |

---

## Funcionalidades principales

### Para compradores
- Explorar el catálogo completo de productos agrícolas
- Filtrar por categoría, municipio, búsqueda y ordenamiento
- Ver el detalle de cada producto con galería e información del productor
- Enviar solicitudes de compra con cantidad y notas
- Marcar productos como favoritos (persisten entre sesiones)
- Ver el perfil público de cada productor con sus productos activos

### Para agricultores
- Publicar nuevos productos con imagen, precio, categoría y cantidad
- Editar la información de sus productos
- Activar o desactivar productos del catálogo
- Gestionar solicitudes recibidas (aceptar / rechazar)
- Ver resumen con estadísticas de su actividad

### Sistema de autenticación
- Inicio de sesión y registro con roles diferenciados (`agricultor` / `comprador`)
- Rutas protegidas por guards según el rol
- Sesión persistente con Local Storage
- Redirección automática al dashboard correspondiente tras el login

---

## Conceptos de Angular aplicados

| Concepto | Dónde se aplica |
|----------|----------------|
| Standalone Components | Todos los componentes del proyecto |
| Signals (`signal`, `computed`) | Estado reactivo en todos los componentes y servicios |
| `@if` / `@for` | Control de flujo en todos los templates |
| `@Input` / `@Output` | Comunicación entre `ProductoCard` y sus componentes padre |
| Formularios reactivos (`FormBuilder`, `Validators`) | Login, registro, solicitud de compra, publicar/editar producto |
| `inject()` | Inyección de dependencias en todos los componentes |
| `RouterLink` / `ActivatedRoute` / Guards | Navegación, lectura de parámetros de ruta y protección por rol |
| Servicios con Local Storage | `ProductosService`, `FavoritosService`, `SolicitudesService`, `AuthService` |
| CSS Variables | Sistema de diseño global coherente en toda la aplicación |
| Lazy loading | Cada ruta carga su componente de forma diferida con `loadComponent` |

---

## Estructura del proyecto

```
src/app/
├── data/                      # Mock data (productos, productores, usuarios, solicitudes)
├── models/                    # Interfaces TypeScript (Producto, Productor, Solicitud, Usuario)
├── services/                  # Servicios con signals y localStorage
│   ├── auth.service.ts
│   ├── productos.service.ts
│   ├── favoritos.service.ts
│   └── solicitudes.service.ts
├── guards/                    # AuthGuard y RolGuard
├── shared/                    # Componentes reutilizables
│   ├── navbar/
│   ├── footer/
│   ├── producto-card/
│   └── login-modal/
├── home/                      # Landing page
├── catalogo/                  # Catálogo con filtros
├── producto-detalle/          # Detalle del producto + formulario de solicitud
├── productor-perfil/          # Perfil público del productor
├── dashboard-agricultor/      # Panel de gestión para agricultores
└── dashboard-comprador/       # Panel de solicitudes y favoritos para compradores
```

---

## Cómo ejecutar el proyecto

### Requisitos previos
- Node.js 18 o superior
- Angular CLI instalado globalmente

```bash
npm install -g @angular/cli
```

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/johanagaviria19/Agromarket.git
cd Agromarket

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
ng serve
```

Abrir el navegador en **http://localhost:4200**

### Build de producción

```bash
ng build
```

Los archivos compilados quedan en `dist/Agromarket/`.

---

## Usuarios de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `hernando@agro.co` | cualquiera | Agricultor |
| `maria@comprador.co` | cualquiera | Comprador |

También es posible registrar un nuevo usuario desde el modal de inicio de sesión.

---

## Decisiones técnicas

- **Sin backend:** toda la información se gestiona con Local Storage y datos mock. Esto permite demostrar el funcionamiento completo de Angular sin infraestructura adicional.
- **Signals en lugar de RxJS:** se usó la API de signals de Angular para el estado reactivo, que es la forma moderna y recomendada desde Angular 17+.
- **CSS Variables:** el sistema de diseño se basa en variables CSS globales definidas en `styles.scss`, lo que garantiza consistencia visual y facilita el mantenimiento.
- **Lazy loading:** cada ruta usa `loadComponent` para cargar los módulos solo cuando se necesitan, mejorando el tiempo de carga inicial.

---

## Capturas de pantalla

| Vista | Descripción |
|-------|-------------|
| Landing page | Hero, categorías, productos destacados, productores y beneficios |
| Catálogo | Grid de productos con sidebar de filtros reactivos |
| Detalle | Información completa del producto y formulario de solicitud |
| Dashboard agricultor | Gestión de productos y solicitudes recibidas |
| Dashboard comprador | Favoritos y solicitudes enviadas |

---

*Desarrollado con Angular — Electiva de profundización, 2025*
