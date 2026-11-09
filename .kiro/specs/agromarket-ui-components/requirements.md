# Requirements Document

## Introduction

AgroMarket es un marketplace agrícola construido en Angular 22 que conecta agricultores y compradores en la región de Nariño, Colombia. Este documento describe los requisitos para los cuatro componentes standalone de la interfaz de usuario: **ProductoCard**, **Catalogo**, **ProductoDetalle** y **ProductorPerfil**. Todos los componentes utilizan la API de Signals de Angular, la sintaxis de flujo de control `@if/@for` y variables CSS del sistema de diseño global definido en `styles.scss`.

Los servicios (`ProductosService`, `FavoritosService`, `SolicitudesService`), los modelos (`Producto`, `Productor`, `Solicitud`) y los datos mock (`PRODUCTOS_MOCK`, `PRODUCTORES_MOCK`, `SOLICITUDES_MOCK`) ya existen en el proyecto y no deben ser modificados por estos componentes.

---

## Glossary

- **ProductoCard**: Componente standalone de tarjeta reutilizable que representa un producto agrícola en listas y grillas.
- **Catalogo**: Componente standalone de página que lista todos los productos con filtros, búsqueda y ordenamiento.
- **ProductoDetalle**: Componente standalone de página que muestra el detalle de un producto y permite enviar una solicitud de compra.
- **ProductorPerfil**: Componente standalone de página que muestra el perfil público de un productor y sus productos.
- **Producto**: Modelo de datos que representa un producto agrícola (definido en `producto.model.ts`).
- **Productor**: Modelo de datos que representa un productor agrícola (definido en `productor.model.ts`).
- **Solicitud**: Modelo de datos que representa una solicitud de compra (definido en `solicitud.model.ts`).
- **ProductosService**: Servicio Angular que gestiona el estado reactivo de los productos usando signals.
- **FavoritosService**: Servicio Angular que gestiona la lista de productos favoritos del comprador usando signals.
- **SolicitudesService**: Servicio Angular que gestiona el estado reactivo de las solicitudes de compra usando signals.
- **Signal**: Primitiva reactiva de Angular 22 (`signal()`, `computed()`) para gestión de estado local.
- **Standalone Component**: Componente Angular que no pertenece a un NgModule y declara sus dependencias en su propio decorador `@Component`.
- **CSS Variable**: Variable de diseño definida en `:root` de `styles.scss` (p.ej. `var(--primary)`, `var(--surface-white)`).
- **Favorito**: Producto marcado por el comprador para seguimiento posterior, identificado por su `id` numérico.
- **Subtotal**: Valor calculado como `precio × cantidad` para una solicitud en curso.
- **EstadoSolicitud**: Tipo union `'pendiente' | 'aceptada' | 'rechazada' | 'finalizada'` que representa el ciclo de vida de una solicitud.

---

## Requirements

### Requirement 1: Componente ProductoCard

**User Story:** As a comprador, I want to see a visual card for each product with key information and a favorite toggle, so that I can quickly evaluate products and save the ones I'm interested in.

#### Acceptance Criteria

1. THE ProductoCard SHALL accept a `producto` input of type `Producto` marked as required via `@Input({ required: true })`, and SHALL initialize the local `esFavorito` boolean signal to `false` by default.
2. THE ProductoCard SHALL emit a `toggleFavorito` event of type `number` (the product id) via `@Output()` when the user interacts with the favorite button.
3a. WHEN the user clicks the favorite button, THE ProductoCard SHALL call `event.preventDefault()` to suppress default browser behavior.
3b. WHEN the user clicks the favorite button, THE ProductoCard SHALL toggle the `esFavorito` boolean to its opposite value.
3c. WHEN the user clicks the favorite button, THE ProductoCard SHALL emit the `producto.id` value through the `toggleFavorito` output.
4. THE ProductoCard SHALL display the product image in a 4:3 width-to-height ratio.
5. THE ProductoCard SHALL display a category badge using the `categoria` field of the `Producto`.
6. THE ProductoCard SHALL display the formatted price using `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.
7. THE ProductoCard SHALL display the available quantity (`cantidadDisponible`) and unit (`unidad`) of the product.
8. THE ProductoCard SHALL display the `municipio` of the product.
9. THE ProductoCard SHALL include a "Ver producto" link that navigates to `/producto/:id` using `RouterLink`.
10. THE ProductoCard SHALL apply the CSS class `activo` to the favorite button using `[class.activo]="esFavorito"`.
11. THE ProductoCard SHALL use only CSS variables for all color (`var(--primary)`, `var(--text-dark)`, `var(--surface-white)`), border-radius (`var(--radius-lg)`), and shadow (`var(--shadow-sm)`, `var(--shadow-md)`) values — never hardcoded hex, rgb, or named color values.
12. WHEN the user hovers over the card, THE ProductoCard SHALL transition the box-shadow to `var(--shadow-md)` within 200ms.

---

### Requirement 2: Componente Catalogo

**User Story:** As a comprador, I want to browse, filter, search, and sort products from a catalog page, so that I can find the products that best match my needs.

#### Acceptance Criteria

1. THE Catalogo SHALL inject `ProductosService` and `FavoritosService` using the `inject()` function.
2. THE Catalogo SHALL maintain four reactive filter signals: `busqueda` (string), `categoriaSeleccionada` (string), `municipioSeleccionado` (string), and `ordenamiento` (`'precio-asc' | 'precio-desc' | 'nombre'`) initialized to `'nombre'`.
3. THE Catalogo SHALL expose a `computed` signal `productosFiltrados` that filters `ProductosService.disponibles` by the active `busqueda`, `categoriaSeleccionada`, and `municipioSeleccionado` values, then sorts by `ordenamiento`.
4. THE Catalogo SHALL expose a `computed` signal `totalResultados` that returns the count of `productosFiltrados`.
5. WHEN `busqueda` is non-empty, THE Catalogo SHALL include only products whose `nombre` or `descripcion` contains the search string (case-insensitive).
6. WHEN `categoriaSeleccionada` is non-empty, THE Catalogo SHALL include only products whose `categoria` exactly matches the selected value.
7. WHEN `municipioSeleccionado` is non-empty, THE Catalogo SHALL include only products whose `municipio` exactly matches the selected value.
8. WHEN `ordenamiento` is `'precio-asc'`, THE Catalogo SHALL sort `productosFiltrados` by `precio` ascending.
9. WHEN `ordenamiento` is `'precio-desc'`, THE Catalogo SHALL sort `productosFiltrados` by `precio` descending.
10. WHEN `ordenamiento` is `'nombre'`, THE Catalogo SHALL sort `productosFiltrados` in ascending alphabetical order (A–Z) by `nombre`.
11. THE Catalogo SHALL provide a `limpiarFiltros()` method that resets `busqueda` to `''`, `categoriaSeleccionada` to `''`, `municipioSeleccionado` to `''`, and `ordenamiento` to `'nombre'`.
12. THE Catalogo SHALL provide an `onToggleFavorito(id: number)` method that delegates to `FavoritosService.toggle(id)`.
13. THE Catalogo SHALL render the product grid using `app-producto-card` for each item in `productosFiltrados` via `@for`.
14. WHEN `productosFiltrados` is empty, THE Catalogo SHALL display an empty-state message using `@if`.
15. THE Catalogo SHALL include a municipal filter with the fixed options: Pasto, Túquerres, Ipiales, La Florida, Sandoná, and Buesaco.
16. THE Catalogo SHALL use a sidebar layout of 260px width alongside a 3-column product grid on viewports ≥768px.
17. WHEN the viewport is <768px, THE Catalogo SHALL display the filter controls above the product grid in a single-column stacked layout.

---

### Requirement 3: Componente ProductoDetalle

**User Story:** As a comprador, I want to view the full details of a product and submit a purchase request, so that I can initiate a transaction with the farmer.

#### Acceptance Criteria

1. THE ProductoDetalle SHALL inject `ActivatedRoute`, `Router`, `FormBuilder`, `ProductosService`, and `SolicitudesService` using Angular's dependency injection.
2. WHEN `ngOnInit` executes, THE ProductoDetalle SHALL parse the `id` route parameter as a number using `Number(id)`, look up the product via `ProductosService.getById(id)`, and store the result in the `producto` signal.
3. IF the `id` route parameter is absent, non-numeric, or no product is found for the parsed id, THEN THE ProductoDetalle SHALL navigate to `/catalogo` using `Router.navigate()`.
4. THE ProductoDetalle SHALL maintain a `cantidad` signal (number) representing the requested quantity, initialized to `1`.
5. THE ProductoDetalle SHALL expose a `computed` signal `subtotal` that returns `producto().precio * cantidad()`.
6. THE ProductoDetalle SHALL build a reactive form `solicitudForm` with controls `cantidad` (initial value `1`, validators: `required` and `min(1)`) and `notas` (initial value `''`).
7. WHEN the `cantidad` input changes, THE ProductoDetalle SHALL update the `cantidad` signal to keep it synchronized with the form control value.
8. WHEN `enviarSolicitud()` is called and `solicitudForm` is valid, THE ProductoDetalle SHALL create a `Solicitud` object with `id: Date.now()`, the current `productoId`, `productorId`, `compradorId: 1`, `cantidad`, `subtotal`, `estado: 'pendiente'`, `notas` from the form control value, and `fecha` as today's ISO date string.
9. WHEN `enviarSolicitud()` is called and `solicitudForm` is valid, THE ProductoDetalle SHALL persist the new `Solicitud` via `SolicitudesService.agregar()` and set the `mensajeExito` signal to a non-empty success message string.
10. IF `solicitudForm` is invalid when `enviarSolicitud()` is called, THEN THE ProductoDetalle SHALL mark all form controls as touched to trigger validation display without submitting.
11. THE ProductoDetalle SHALL display the dynamically computed `subtotal` formatted using `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.
12. THE ProductoDetalle SHALL include a "Volver" button that navigates back to `/catalogo`.
13. THE ProductoDetalle SHALL display the `productorId`, `municipio`, and `descripcion` fields from the loaded `Producto` in a dedicated producer/origin section.

---

### Requirement 4: Componente ProductorPerfil

**User Story:** As a comprador, I want to view a producer's public profile including their information and listed products, so that I can learn about who grows the food I'm buying.

#### Acceptance Criteria

1. THE ProductorPerfil SHALL display producer profile data sourced from `PRODUCTORES_MOCK` matching the route `id`.
2. WHEN the route `id` matches a producer in `PRODUCTORES_MOCK`, THE ProductorPerfil SHALL display that producer's profile data.
3. WHEN the route `id` matches a producer, THE ProductorPerfil SHALL display only active products (`activo: true`) associated with that `productorId`.
4. IF the route `id` does not match any producer in `PRODUCTORES_MOCK`, THEN THE ProductorPerfil SHALL display a not-found message.
5. THE ProductorPerfil SHALL display a cover photo (`fotoPortada`) as a banner with a minimum height of 200px.
6. THE ProductorPerfil SHALL display a circular profile photo (`fotoPerfil`) of 100×100px overlaid on the cover photo banner.
7. THE ProductorPerfil SHALL display the producer's `nombre`, `tipo`, `municipio`, `departamento`, and `descripcion`.
8. THE ProductorPerfil SHALL display the list of products the producer grows (`productos` string array) as a bulleted list.
9. THE ProductorPerfil SHALL display the `lotesEntregados` counter.
10. WHEN the user clicks the 'Contactar' button, THE ProductorPerfil SHALL call `alert()` with a message indicating the contact feature is coming soon.
11. THE ProductorPerfil SHALL render only active products (`activo: true`) using `app-producto-card` via `@for`.

---

### Requirement 5: Restricciones Transversales del Sistema

**User Story:** As a developer, I want all UI components to follow consistent technical and design standards, so that the codebase remains maintainable and the visual language stays coherent.

#### Acceptance Criteria

1. THE ProductoCard, Catalogo, ProductoDetalle, and ProductorPerfil SHALL each be declared as Angular standalone components (`standalone: true` in the `@Component` decorator).
2. THE components SHALL use Angular's `signal()` and `computed()` APIs for all local reactive state — not `BehaviorSubject` or `Subject`.
3. THE ProductoCard, Catalogo, ProductoDetalle, and ProductorPerfil SHALL use Angular's `@if` and `@for` built-in control flow syntax — not the structural directives `*ngIf` or `*ngFor`.
4. THE ProductoCard, Catalogo, ProductoDetalle, and ProductorPerfil SHALL use only CSS variables defined in `styles.scss` for all color, shadow, border-radius, and typography values — never hardcoded hex, rgb, or named color values.
5. THE components SHALL render in a single-column layout on viewports <768px, a minimum 2-column layout on viewports ≥768px, and SHALL NOT produce horizontal overflow at any viewport width.
