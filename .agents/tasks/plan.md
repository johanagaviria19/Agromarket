# Implementation Plan — AgroMarket UI Components

## Project context (discovered during exploration)

- Angular 21 (package.json shows `^21.2.0`), Standalone Components, Signals, `@if`/`@for` control-flow syntax.
- TypeScript strict mode + `strictTemplates: true` — every template binding is type-checked.
- Build command: `npx ng build --configuration development` (from project root).
- No unit-test framework wired up (vitest is a devDependency but no `ng test` runner configured for it).
- Global CSS variables are defined in `src/styles.scss` — all components must use `var(--...)` only.
- Existing stubs for `Catalogo`, `ProductoDetalle`, `ProductorPerfil` use inline `template` — they must be replaced with `templateUrl`/`styleUrl` versions.
- The `shared/producto-card/` folder does **not** exist yet; create it from scratch.
- Routes already reference the correct class names (`Catalogo`, `ProductoDetalle`, `ProductorPerfil`) so no route changes are needed.
- `ProductosService.disponibles()` filters `activo && cantidadDisponible > 0`. `ProductosService.productos()` is the full unfiltered list.
- `SolicitudesService.agregar()` accepts a full `Solicitud` object (id, productoId, productorId, compradorId, cantidad, subtotal, estado, fecha, notas?).
- `FavoritosService.toggle(id)` is the only write method needed.
- `PRODUCTORES_MOCK` is exported from `src/app/data/mock-data.ts` — import it directly.

---

## Potential issues to watch for

1. **`strictTemplates`**: Every `producto()!` access in `ProductoDetalle` must be guarded inside `@if (producto())`. Inside that block Angular still types the signal result as `Producto | null`, so `!` non-null assertions are required on each property access. This is valid TypeScript inside `@if`.
2. **`esFavorito` is a plain property, NOT a signal**: Access it as `esFavorito` in templates, not `esFavorito()`.
3. **`notas?` is optional** on `Solicitud` — use `form.value.notas ?? ''` when constructing the object to satisfy the model.
4. **`compradorId` hardcoded to `1`** in `enviarSolicitud()` — this is intentional per spec (no auth system yet).
5. **`categoriasFiltradas` in Catalogo**: The `categoria` field on `Producto` is typed as a union (`'frutas' | 'hortalizas' | 'tuberculos' | 'granos' | 'campesinos'`). Comparing against a `signal('')` (empty string) requires a cast or an empty-string check before the strict-equality filter. Use: `if (!cat) return true; return p.categoria === cat as Producto['categoria']`.
6. **`ProductorPerfil` — filter by `activo`**: The spec says `activo && productorId === id`. Use `productosService.productos()` (full list, filter ourselves) not `disponibles()` which also hides zero-stock items.
7. **Angular component file naming**: Angular 21 uses the convention `component-name.ts` (no `.component` segment) as seen in all existing files. Follow the same pattern: `producto-card.ts`, `catalogo.ts`, etc.
8. **`templateUrl`/`styleUrl` paths**: Use relative paths — `./producto-card.html`, `./producto-card.scss`.
9. **`@Input({ required: true })`**: Angular strict input checking requires the property to be declared as `producto!: Producto` (definite assignment assertion) because it's set by the parent, not the constructor.
10. **Budget warning in `angular.json`**: `anyComponentStyle` budget is 4kB warning / 8kB error. Keep SCSS lean; avoid duplicating global styles.

---

## Files to create or replace

| # | Action | Path |
|---|--------|------|
| 1 | **CREATE** | `src/app/shared/producto-card/producto-card.ts` |
| 2 | **CREATE** | `src/app/shared/producto-card/producto-card.html` |
| 3 | **CREATE** | `src/app/shared/producto-card/producto-card.scss` |
| 4 | **REPLACE** | `src/app/catalogo/catalogo.ts` |
| 5 | **CREATE** | `src/app/catalogo/catalogo.html` |
| 6 | **CREATE** | `src/app/catalogo/catalogo.scss` |
| 7 | **REPLACE** | `src/app/producto-detalle/producto-detalle.ts` |
| 8 | **CREATE** | `src/app/producto-detalle/producto-detalle.html` |
| 9 | **CREATE** | `src/app/producto-detalle/producto-detalle.scss` |
| 10 | **REPLACE** | `src/app/productor-perfil/productor-perfil.ts` |
| 11 | **CREATE** | `src/app/productor-perfil/productor-perfil.html` |
| 12 | **CREATE** | `src/app/productor-perfil/productor-perfil.scss` |

No changes to: routes, services, models, mock-data, styles.scss, app.config.ts.

---

## Step-by-step implementation plan

- [ ] 1. **Create `src/app/shared/producto-card/` folder and its three files**

  Create the `producto-card` component from scratch — this folder does not exist yet.

  **`producto-card.ts`**
  ```
  imports: [RouterLink, CommonModule]
  selector: app-producto-card
  standalone: true
  templateUrl: ./producto-card.html
  styleUrl: ./producto-card.scss

  @Input({ required: true }) producto!: Producto
  @Output() toggleFavorito = new EventEmitter<number>()
  esFavorito = false  // plain property, NOT signal

  formatearPrecio(precio: number): string
    → new Intl.NumberFormat('es-CO', {style:'currency',currency:'COP',maximumFractionDigits:0}).format(precio)

  onToggleFavorito(event: Event): void
    → event.preventDefault(); this.esFavorito = !this.esFavorito; this.toggleFavorito.emit(this.producto.id)
  ```

  **`producto-card.html`** must contain:
  - `<div class="card">` wrapping everything
  - `<div class="card__img-wrap">` containing:
    - `<img [src]="producto.imagen" [alt]="producto.nombre">`
    - `<span class="badge">{{producto.categoria}}</span>`
    - `<button class="btn-fav" (click)="onToggleFavorito($event)" [class.activo]="esFavorito">♥</button>`
  - `<div class="card__body">` containing:
    - `<h3>{{producto.nombre}}</h3>`
    - `<p class="precio">{{formatearPrecio(producto.precio)}}</p>`
    - `<p class="muted">{{producto.cantidadDisponible}} {{producto.unidad}} disponibles</p>`
    - `<p class="muted">📍 {{producto.municipio}}</p>`
    - `<a [routerLink]="['/producto', producto.id]" class="btn-primary">Ver producto</a>`

  **`producto-card.scss`** rules:
  - `.card`: `background: var(--surface-white)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-sm)`, `overflow: hidden`, `transition: box-shadow 200ms ease, transform 200ms ease`, `border: 1px solid var(--border)`
  - `.card:hover`: `box-shadow: var(--shadow-md)`, `transform: translateY(-2px)`
  - `.card__img-wrap`: `position: relative`, `aspect-ratio: 4/3`, `overflow: hidden`
  - `.card__img-wrap img`: `width: 100%`, `height: 100%`, `object-fit: cover`, `display: block`
  - `.badge` (inside card): `position: absolute`, `bottom: 8px`, `left: 8px`, `background: var(--primary)`, `color: white`
  - `.btn-fav`: `position: absolute`, `top: 8px`, `right: 8px`, `background: var(--surface-white)`, `border: none`, `border-radius: 50%`, `width: 32px`, `height: 32px`, `cursor: pointer`, `color: var(--muted)`, `font-size: 1.1rem`
  - `.btn-fav.activo`: `color: var(--danger)`
  - `.card__body`: `padding: 1rem`
  - `.precio`: `font-size: 1.25rem`, `font-weight: 700`, `color: var(--primary)`
  - `.muted`: `color: var(--muted)`, `font-size: 0.875rem`, `margin-top: 0.25rem`
  - `.btn-primary` (link): `display: block`, `text-align: center`, `margin-top: 0.75rem`

  Files: `src/app/shared/producto-card/producto-card.ts`, `producto-card.html`, `producto-card.scss`

  Verify: `cd 'c:\Users\pedro\OneDrive\Desktop\ElectivaFIN\Agromarket' ; npx ng build --configuration development 2>&1` — no TypeScript errors for the new component.

---

- [ ] 2. **Replace `src/app/catalogo/catalogo.ts` and create `catalogo.html` + `catalogo.scss`**

  Replace the inline-template stub completely.

  **`catalogo.ts`**
  ```
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ProductoCard]
  selector: app-catalogo
  standalone: true
  templateUrl: ./catalogo.html
  styleUrl: ./catalogo.scss

  inject ProductosService as productosService
  inject FavoritosService as favoritosService

  busqueda = signal('')
  categoriaSeleccionada = signal('')
  municipioSeleccionado = signal('')
  ordenamiento = signal<'precio-asc'|'precio-desc'|'nombre'>('nombre')

  readonly municipios = ['Pasto','Túquerres','Ipiales','La Florida','Sandoná','Buesaco']
  readonly categorias = ['frutas','hortalizas','tuberculos','granos','campesinos']

  productosFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase();
    const cat = this.categoriaSeleccionada();
    const mun = this.municipioSeleccionado();
    const ord = this.ordenamiento();

    let lista = this.productosService.disponibles().filter(p => {
      const matchQ   = !q   || p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
      const matchCat = !cat || p.categoria === cat;
      const matchMun = !mun || p.municipio === mun;
      return matchQ && matchCat && matchMun;
    });

    if (ord === 'precio-asc')  lista = [...lista].sort((a,b) => a.precio - b.precio);
    if (ord === 'precio-desc') lista = [...lista].sort((a,b) => b.precio - a.precio);
    if (ord === 'nombre')      lista = [...lista].sort((a,b) => a.nombre.localeCompare(b.nombre));

    return lista;
  })

  totalResultados = computed(() => this.productosFiltrados().length)

  limpiarFiltros(): void
    → busqueda.set(''); categoriaSeleccionada.set(''); municipioSeleccionado.set(''); ordenamiento.set('nombre')

  onToggleFavorito(id: number): void
    → this.favoritosService.toggle(id)
  ```

  **`catalogo.html`** structure:
  ```html
  <div class="catalogo-page">
    <header class="catalogo-header">
      <h1>Catálogo de Productos</h1>
    </header>
    <div class="catalogo-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <h2 class="sidebar__title">Filtros</h2>

        <div class="filter-group">
          <label>Buscar</label>
          <input type="text" [value]="busqueda()" (input)="busqueda.set($any($event.target).value)" placeholder="Nombre o descripción...">
        </div>

        <div class="filter-group">
          <label>Categoría</label>
          <select [value]="categoriaSeleccionada()" (change)="categoriaSeleccionada.set($any($event.target).value)">
            <option value="">Todas las categorías</option>
            @for (cat of categorias; track cat) {
              <option [value]="cat">{{cat}}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Municipio</label>
          <select [value]="municipioSeleccionado()" (change)="municipioSeleccionado.set($any($event.target).value)">
            <option value="">Todos los municipios</option>
            @for (mun of municipios; track mun) {
              <option [value]="mun">{{mun}}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Ordenar por</label>
          <select [value]="ordenamiento()" (change)="ordenamiento.set($any($event.target).value)">
            <option value="nombre">Nombre</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>

        <button class="btn-outline" (click)="limpiarFiltros()">Limpiar filtros</button>
      </aside>

      <!-- PRODUCTS AREA -->
      <main class="productos-area">
        <p class="resultados-count">{{totalResultados()}} productos encontrados</p>

        @if (totalResultados() === 0) {
          <div class="empty-state">
            <p>No se encontraron productos con estos filtros.</p>
            <button class="btn-outline" (click)="limpiarFiltros()">Limpiar filtros</button>
            <a routerLink="/" class="btn-outline">Volver al inicio</a>
          </div>
        } @else {
          <div class="productos-grid">
            @for (producto of productosFiltrados(); track producto.id) {
              <app-producto-card
                [producto]="producto"
                (toggleFavorito)="onToggleFavorito($event)">
              </app-producto-card>
            }
          </div>
        }
      </main>
    </div>
  </div>
  ```

  **`catalogo.scss`** rules:
  - `.catalogo-page`: `max-width: 1200px`, `margin: 0 auto`, `padding: 2rem 1.5rem`
  - `.catalogo-header h1`: `font-family: var(--font-heading)`, `color: var(--primary-dark)`, `margin-bottom: 1.5rem`
  - `.catalogo-layout`: `display: flex`, `gap: 2rem`, `align-items: flex-start`
  - `.sidebar`: `width: 260px`, `flex-shrink: 0`, `position: sticky`, `top: 80px`, `background: var(--surface-white)`, `border: 1px solid var(--border)`, `border-radius: var(--radius-lg)`, `padding: 1.25rem`
  - `.sidebar__title`: `font-size: 1rem`, `font-weight: 700`, `color: var(--primary-dark)`, `margin-bottom: 1rem`
  - `.filter-group`: `margin-bottom: 1rem`, `display: flex`, `flex-direction: column`, `gap: 0.35rem`
  - `.filter-group label`: `font-size: 0.8rem`, `font-weight: 600`, `color: var(--muted)`
  - `.filter-group input, .filter-group select`: `width: 100%`, `padding: 0.5rem 0.75rem`, `border: 1px solid var(--border)`, `border-radius: var(--radius-sm)`, `font-family: var(--font-body)`, `background: var(--background)`, `color: var(--text)`
  - `.productos-area`: `flex: 1`
  - `.resultados-count`: `font-size: 0.875rem`, `color: var(--muted)`, `margin-bottom: 1rem`
  - `.productos-grid`: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 1.5rem`
  - `.empty-state`: `text-align: center`, `padding: 3rem`, `color: var(--muted)`, `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 1rem`
  - `@media (max-width: 1024px)`: `.productos-grid { grid-template-columns: repeat(2, 1fr) }`
  - `@media (max-width: 768px)`: `.catalogo-layout { flex-direction: column }`, `.sidebar { width: 100%; position: static }`, `.productos-grid { grid-template-columns: repeat(2, 1fr) }`
  - `@media (max-width: 480px)`: `.productos-grid { grid-template-columns: 1fr }`

  Files: `src/app/catalogo/catalogo.ts`, `catalogo.html`, `catalogo.scss`

  Verify: `npx ng build --configuration development 2>&1` — no errors; Catalogo component builds without warnings.

---

- [ ] 3. **Replace `src/app/producto-detalle/producto-detalle.ts` and create `producto-detalle.html` + `producto-detalle.scss`**

  Replace the inline-template stub completely.

  **`producto-detalle.ts`**
  ```
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ProductoCard]
  selector: app-producto-detalle
  standalone: true
  templateUrl: ./producto-detalle.html
  styleUrl: ./producto-detalle.scss

  inject ActivatedRoute as route
  inject Router as router
  inject FormBuilder as fb
  inject ProductosService as productosService
  inject SolicitudesService as solicitudesService

  producto = signal<Producto | null>(null)
  cantidad = signal(1)
  mensajeExito = signal('')

  subtotal = computed(() => {
    const p = this.producto();
    return p ? p.precio * this.cantidad() : 0;
  })

  solicitudForm = this.fb.group({
    cantidad: [1, [Validators.required, Validators.min(1)]],
    notas: ['']
  })

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = Number(raw);
    if (!raw || isNaN(id)) { this.router.navigate(['/catalogo']); return; }
    const p = this.productosService.getById(id);
    if (!p) { this.router.navigate(['/catalogo']); return; }
    this.producto.set(p);
  }

  formatearPrecio(precio: number): string
    → new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(precio)

  onCantidadChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.cantidad.set(val);
    this.solicitudForm.patchValue({ cantidad: val });
  }

  enviarSolicitud(): void {
    if (this.solicitudForm.invalid) { this.solicitudForm.markAllAsTouched(); return; }
    const p = this.producto();
    if (!p) return;
    const cant = this.solicitudForm.value.cantidad as number;
    if (cant > p.cantidadDisponible) {
      this.mensajeExito.set('');
      return;  // quantity exceeds stock — do not submit
    }
    this.solicitudesService.agregar({
      id: Date.now(),
      productoId: p.id,
      productorId: p.productorId,
      compradorId: 1,
      cantidad: cant,
      subtotal: this.subtotal(),
      estado: 'pendiente',
      fecha: new Date().toISOString().split('T')[0],
      notas: this.solicitudForm.value.notas ?? ''
    });
    this.mensajeExito.set('¡Solicitud enviada con éxito! El productor se pondrá en contacto contigo.');
  }
  ```

  **`producto-detalle.html`** structure:
  ```html
  <div class="detalle-page">
    <a routerLink="/catalogo" class="btn-outline back-link">← Volver al catálogo</a>

    @if (producto()) {
      <div class="detalle-layout">
        <!-- LEFT: image -->
        <div class="detalle-imagen">
          <img [src]="producto()!.imagen" [alt]="producto()!.nombre">
        </div>

        <!-- RIGHT: info + form -->
        <div class="detalle-info">
          <span class="badge">{{producto()!.categoria}}</span>
          <h1>{{producto()!.nombre}}</h1>
          <p class="descripcion">{{producto()!.descripcion}}</p>
          <p class="muted">📍 {{producto()!.municipio}}, {{producto()!.departamento}}</p>
          <p class="muted">Actualizado: {{producto()!.fechaActualizacion}}</p>

          <p class="precio">{{formatearPrecio(producto()!.precio)}} / {{producto()!.unidad}}</p>
          <p class="stock">{{producto()!.cantidadDisponible}} {{producto()!.unidad}} disponibles</p>

          <!-- Solicitar compra form -->
          <section class="solicitud-section">
            <h2>Solicitar compra</h2>
            <form [formGroup]="solicitudForm" (ngSubmit)="enviarSolicitud()">
              <div class="form-group">
                <label for="cantidad">Cantidad ({{producto()!.unidad}})</label>
                <input
                  id="cantidad"
                  type="number"
                  formControlName="cantidad"
                  min="1"
                  [max]="producto()!.cantidadDisponible"
                  (input)="onCantidadChange($event)">
              </div>

              <p class="subtotal">Subtotal: <strong>{{formatearPrecio(subtotal())}}</strong></p>

              <div class="form-group">
                <label for="notas">Notas para el productor (opcional)</label>
                <textarea id="notas" formControlName="notas" rows="3" placeholder="Instrucciones especiales, empaque, etc."></textarea>
              </div>

              <button type="submit" class="btn-primary" [disabled]="solicitudForm.invalid">
                Enviar solicitud
              </button>
            </form>
          </section>

          @if (mensajeExito()) {
            <div class="exito">{{mensajeExito()}}</div>
          }

          <!-- Productor info -->
          <section class="productor-section">
            <h2>Información del productor</h2>
            <p><strong>ID Productor:</strong> {{producto()!.productorId}}</p>
            <p><strong>Municipio:</strong> {{producto()!.municipio}}</p>
            <p><strong>Descripción del lote:</strong> {{producto()!.descripcion}}</p>
            <a [routerLink]="['/productor', producto()!.productorId]" class="btn-outline">
              Ver perfil del productor →
            </a>
          </section>
        </div>
      </div>
    }
  </div>
  ```

  **`producto-detalle.scss`** rules:
  - `.detalle-page`: `max-width: 1100px`, `margin: 0 auto`, `padding: 2rem 1.5rem`
  - `.back-link`: `margin-bottom: 1.5rem`, `display: inline-block`
  - `.detalle-layout`: `display: grid`, `grid-template-columns: 1fr 1fr`, `gap: 3rem`, `align-items: flex-start`
  - `.detalle-imagen img`: `width: 100%`, `border-radius: var(--radius-lg)`, `object-fit: cover`, `aspect-ratio: 4/3`
  - `.detalle-info h1`: `font-family: var(--font-heading)`, `color: var(--primary-dark)`, `margin: 0.5rem 0 0.75rem`
  - `.descripcion`: `color: var(--muted)`, `line-height: 1.7`, `margin-bottom: 0.75rem`
  - `.muted`: `color: var(--muted)`, `font-size: 0.875rem`, `margin-bottom: 0.25rem`
  - `.precio`: `font-size: 2rem`, `font-weight: 700`, `color: var(--primary)`, `margin: 1rem 0 0.25rem`
  - `.stock`: `color: var(--muted)`, `margin-bottom: 1.5rem`
  - `.solicitud-section`: `border-top: 1px solid var(--border)`, `padding-top: 1.5rem`, `margin-top: 1.5rem`
  - `.solicitud-section h2, .productor-section h2`: `font-size: 1.1rem`, `margin-bottom: 1rem`, `color: var(--primary-dark)`
  - `.form-group`: `display: flex`, `flex-direction: column`, `gap: 0.3rem`, `margin-bottom: 1rem`
  - `.form-group label`: `font-size: 0.85rem`, `font-weight: 600`, `color: var(--muted)`
  - `.form-group input, .form-group textarea`: `padding: 0.6rem 0.75rem`, `border: 1px solid var(--border)`, `border-radius: var(--radius-sm)`, `font-family: var(--font-body)`, `background: var(--background)`, `color: var(--text)`
  - `.subtotal`: `font-size: 1rem`, `color: var(--text)`, `margin-bottom: 1rem`
  - `.exito`: `background: color-mix(in srgb, var(--primary) 10%, white)`, `color: var(--primary)`, `padding: 1rem`, `border-radius: var(--radius-sm)`, `margin-top: 1rem`, `font-weight: 600`
  - `.productor-section`: `border-top: 1px solid var(--border)`, `padding-top: 1.5rem`, `margin-top: 1.5rem`, `display: flex`, `flex-direction: column`, `gap: 0.5rem`
  - `@media (max-width: 768px)`: `.detalle-layout { grid-template-columns: 1fr }`

  Files: `src/app/producto-detalle/producto-detalle.ts`, `producto-detalle.html`, `producto-detalle.scss`

  Verify: `npx ng build --configuration development 2>&1` — no errors.

---

- [ ] 4. **Replace `src/app/productor-perfil/productor-perfil.ts` and create `productor-perfil.html` + `productor-perfil.scss`**

  Replace the inline-template stub completely.

  **`productor-perfil.ts`**
  ```
  imports: [CommonModule, RouterLink, ProductoCard]
  selector: app-productor-perfil
  standalone: true
  templateUrl: ./productor-perfil.html
  styleUrl: ./productor-perfil.scss

  inject ActivatedRoute as route
  inject ProductosService as productosService
  import PRODUCTORES_MOCK from '../data/mock-data'  (named export)

  productor = signal<Productor | null>(null)
  productosDelProductor = signal<Producto[]>([])

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = Number(raw);
    if (!raw || isNaN(id)) return;
    const p = PRODUCTORES_MOCK.find(p => p.id === id);
    if (!p) return;
    this.productor.set(p);
    const productos = this.productosService.productos().filter(
      pr => pr.productorId === id && pr.activo
    );
    this.productosDelProductor.set(productos);
  }

  contactar(): void {
    alert('Funcionalidad de contacto próximamente');
  }
  ```

  **`productor-perfil.html`** — use exactly the template from the spec:
  ```html
  @if (productor()) {
    <div class="portada" [style.backgroundImage]="'url(' + productor()!.fotoPortada + ')'">
      <div class="portada-overlay"></div>
      <img class="foto-perfil" [src]="productor()!.fotoPerfil" [alt]="productor()!.nombre">
    </div>

    <div class="perfil-info">
      <h1>{{productor()!.nombre}}</h1>
      <span class="badge">{{productor()!.tipo}}</span>
      <p>{{productor()!.municipio}}, {{productor()!.departamento}}</p>
      <p class="descripcion">{{productor()!.descripcion}}</p>

      <ul class="lista-productos">
        @for (prod of productor()!.productos; track prod) {
          <li>{{prod}}</li>
        }
      </ul>

      <div class="lotes-counter">
        <span class="numero">{{productor()!.lotesEntregados}}</span>
        <span>lotes entregados</span>
      </div>

      <button class="btn-primary" (click)="contactar()">Contactar</button>
    </div>

    <section class="productos-section">
      <h2>Productos disponibles</h2>
      @if (productosDelProductor().length === 0) {
        <p>Este productor no tiene productos disponibles en este momento.</p>
      } @else {
        <div class="productos-grid">
          @for (p of productosDelProductor(); track p.id) {
            <app-producto-card [producto]="p"></app-producto-card>
          }
        </div>
      }
    </section>
  } @else {
    <div class="not-found">
      <p>Productor no encontrado.</p>
      <a routerLink="/catalogo" class="btn-outline">Volver al catálogo</a>
    </div>
  }
  ```

  **`productor-perfil.scss`** rules:
  - `.portada`: `height: 250px`, `background-size: cover`, `background-position: center`, `position: relative`
  - `.portada-overlay`: `position: absolute`, `inset: 0`, `background: rgba(0,0,0,0.4)`
  - `.foto-perfil`: `position: absolute`, `bottom: -50px`, `left: 2rem`, `width: 100px`, `height: 100px`, `border-radius: 50%`, `border: 3px solid var(--surface-white)`, `object-fit: cover`, `z-index: 1`
  - `.perfil-info`: `max-width: 900px`, `margin: 0 auto`, `padding: 70px 2rem 1.5rem`, `display: flex`, `flex-direction: column`, `gap: 0.75rem`
  - `.perfil-info h1`: `font-family: var(--font-heading)`, `color: var(--primary-dark)`
  - `.descripcion`: `color: var(--muted)`, `line-height: 1.7`
  - `.lista-productos`: `padding-left: 1.5rem`, `color: var(--muted)`, `font-size: 0.9rem`
  - `.lotes-counter`: `display: flex`, `align-items: baseline`, `gap: 0.5rem`
  - `.lotes-counter .numero`: `font-size: 2rem`, `color: var(--primary)`, `font-weight: 700`
  - `.productos-section`: `max-width: 900px`, `margin: 0 auto`, `padding: 2rem`
  - `.productos-section h2`: `font-family: var(--font-heading)`, `color: var(--primary-dark)`, `margin-bottom: 1.5rem`
  - `.productos-grid`: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 1.5rem`
  - `.not-found`: `text-align: center`, `padding: 4rem 1.5rem`, `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 1rem`, `color: var(--muted)`
  - `@media (max-width: 768px)`: `.productos-grid { grid-template-columns: repeat(2, 1fr) }`
  - `@media (max-width: 480px)`: `.productos-grid { grid-template-columns: 1fr }`

  Files: `src/app/productor-perfil/productor-perfil.ts`, `productor-perfil.html`, `productor-perfil.scss`

  Verify: `npx ng build --configuration development 2>&1` — zero TypeScript or template errors.

---

- [ ] 5. **Final build verification and TypeScript error fix pass**

  Run a full development build after all 12 files are written. If any TypeScript or Angular template errors appear, fix them before finishing. Common errors to watch for:

  - **TS2322 / TS2345** on `categoriaSeleccionada()` string vs. `Producto['categoria']` union: cast with `as Producto['categoria']` or use a `!cat` guard before the comparison.
  - **NG8002** (unknown element `app-producto-card`): means the import of `ProductoCard` is missing in the consuming component's `imports` array.
  - **NG2** (property not found): make sure `producto()!.xxx` accesses are inside `@if (producto())` blocks.
  - **TS2345 on `solicitudForm.value.notas`**: `value.notas` is `string | null | undefined` — use `?? ''` to coerce.
  - **`disabled` binding**: Angular treats `[disabled]="expr"` on buttons as boolean attribute binding. For `solicitudForm.invalid` this is valid.

  Command: `cd 'c:\Users\pedro\OneDrive\Desktop\ElectivaFIN\Agromarket' ; npx ng build --configuration development 2>&1`

  Expected: build completes with 0 errors (warnings about budget are acceptable).
