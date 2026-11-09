# AgroMarket UI Components — ProductoCard, Catálogo, ProductoDetalle, ProductorPerfil

Four Angular standalone components implement the product browsing and purchase-request flow for AgroMarket: a reusable card, a filterable catalog, a product detail page with a purchase form, and a producer profile page. All components follow the Angular 21 signals/computed pattern with `@if`/`@for` control flow. The implementations are largely correct, but two issues require changes before shipping: a hardcoded CSS color in the overlay element and an unexpanded producer-info section in the product detail page. Additionally, no build verification log was recorded by the coder, so compile-time correctness cannot be fully confirmed from evidence alone.

**Watch for:**
- `rgba(0, 0, 0, 0.4)` hardcoded in `productor-perfil.scss` — violates the no-hardcoded-colors rule (confirmed)
- `color-mix(in srgb, var(--primary) 10%, white)` in `producto-detalle.scss` — `white` is a literal color keyword, not a CSS variable (confirmed)
- No build output recorded; compile-time template errors cannot be ruled out (possible)

**Verdict**: CHANGES_REQUESTED

---

## High-level view

The four components wire up correctly to the existing services — `ProductosService.getById()`, `FavoritosService.toggle()`, and `SolicitudesService.agregar()` all match the actual service implementations confirmed in the codebase. Signal usage is consistent: `esFavorito` in `ProductoCard` is correctly a plain class property, all four Catálogo filter signals exist and `limpiarFiltros()` resets all four, and `ProductoDetalle` properly guards every template access to `producto()` inside a single top-level `@if (producto())` block.

The CSS layer has two hardcoded color values. `productor-perfil.scss` uses `rgba(0, 0, 0, 0.4)` for the portada overlay — this should be a CSS variable like `var(--overlay)` or `var(--overlay-dark)`. `producto-detalle.scss` uses `color-mix(in srgb, var(--primary) 10%, white)` for the success message background — `white` is a literal color keyword and should be replaced with `var(--surface-white)` or a dedicated variable.

The `ProductoDetalle` producer-info section shows `productorId` and municipio but not the producer's name, which differs from the spec's "nombre y municipio del productor" — a lookup against `PRODUCTORES_MOCK` would be needed to resolve the name.

The `productor-perfil.html` product cards omit `(toggleFavorito)="onToggleFavorito($event)"`. Favorites will silently drop on the profile page even though `ProductorPerfil` wires up nothing to handle the output.

No build output was recorded by the coder, so compile-time template errors under `strictTemplates: true` cannot be ruled out.

---

<details>
<summary>Issues (5)</summary>

1. **Hardcoded rgba in productor-perfil.scss** — `background: rgba(0, 0, 0, 0.4)` on `.portada-overlay` violates the CSS variables rule. Replace with a CSS variable (e.g., `var(--overlay-dark)` defined in `styles.scss`, or a semi-transparent token if one already exists).

2. **Literal `white` in color-mix (producto-detalle.scss)** — `.exito { background: color-mix(in srgb, var(--primary) 10%, white) }` embeds a hardcoded color keyword. Replace `white` with `var(--surface-white)` to comply with the no-hardcoded-colors rule.

3. **Producer name missing in ProductoDetalle** — The spec requires "nombre y municipio del productor" but the template shows the numeric `productorId`. Import `PRODUCTORES_MOCK` in `producto-detalle.ts` and do a find-by-id lookup to display the actual name.

4. **Missing (toggleFavorito) binding in ProductorPerfil** — `<app-producto-card [producto]="p">` in `productor-perfil.html` omits the output binding. Add `(toggleFavorito)="favoritosService.toggle($event)"` (or wire it through a method) to keep favorite state consistent across the app.

5. **Build not verified** — The plan.md records the build command but no output log exists in `.agents/tasks/`. TypeScript and Angular template compilation errors under `strictTemplates: true` cannot be ruled out without a successful build run.

</details>

---

<details>
<summary>Details</summary>

### Hardcoded CSS colors

`productor-perfil.scss` line 11: `background: rgba(0, 0, 0, 0.4)` on the `.portada-overlay` element. This is the only unambiguous CSS variable violation across the four component stylesheets.

`producto-detalle.scss` line 117: `.exito { background: color-mix(in srgb, var(--primary) 10%, white) }`. The `color-mix` function itself is fine, but `white` is a hardcoded color keyword. The intent is clearly to tint the primary color against the page background, so `var(--surface-white)` is the appropriate replacement.

### Producer info in ProductoDetalle

The spec says "Información del productor con nombre y municipio del productor." The implementation shows `ID Productor: {{ producto()!.productorId }}` and `Municipio: {{ producto()!.municipio }}`. Since the `Producto` model carries `productorId` but not the producer's name, resolving the actual name would require a lookup against `PRODUCTORES_MOCK`. The current implementation shows the ID instead of the name — a gap relative to the spec, though not a TypeScript error.

### Missing `(toggleFavorito)` binding in ProductorPerfil

The product cards in `productor-perfil.html` are rendered as `<app-producto-card [producto]="p">` without a `(toggleFavorito)` output binding. The `ProductoCard` component declares `@Output() toggleFavorito`, so clicking the favorite button will emit an event with no handler — it won't error, but favorites won't be persisted for products viewed from a producer profile. The Catálogo template correctly wires `(toggleFavorito)="onToggleFavorito($event)"`.

### Build verification gap

The plan.md documents the `npx ng build --configuration development` verification step but no output was recorded. The `ordenamiento` signal setter receives a raw DOM string via `$any()` — Angular's strict templates won't catch the union mismatch because `$any()` bypasses type checking, which is intentional. However, other template binding errors under `strictTemplates: true` could still exist and are unverified.

</details>

---

<details>
<summary>File map</summary>

| File | Change |
|------|--------|
| `src/app/shared/producto-card/producto-card.ts` | New standalone component: `@Input` producto, `@Output` toggleFavorito, esFavorito plain property, formatearPrecio |
| `src/app/shared/producto-card/producto-card.html` | Card template: image wrap, category badge, fav button, body with price and routerLink |
| `src/app/shared/producto-card/producto-card.scss` | Card styles: CSS variables throughout, 4/3 aspect ratio, hover elevation |
| `src/app/catalogo/catalogo.ts` | Replaced stub: 4 filter signals, computed productosFiltrados/totalResultados, limpiarFiltros, onToggleFavorito |
| `src/app/catalogo/catalogo.html` | Sidebar + grid layout, @for selects, @if empty state |
| `src/app/catalogo/catalogo.scss` | 260px sticky sidebar, 3-col grid, responsive breakpoints at 1024/768/480px |
| `src/app/producto-detalle/producto-detalle.ts` | Replaced stub: OnInit route read, reactive form, enviarSolicitud with stock check |
| `src/app/producto-detalle/producto-detalle.html` | Detail layout: @if guard, form with formControlName, success message, producer section |
| `src/app/producto-detalle/producto-detalle.scss` | 2-col grid layout, form inputs styled with CSS vars; **`white` literal in color-mix** |
| `src/app/productor-perfil/productor-perfil.ts` | Replaced stub: reads PRODUCTORES_MOCK, filters by productorId && activo, contactar() alert |
| `src/app/productor-perfil/productor-perfil.html` | Cover photo with overlay, circular profile pic, products list, lotes counter, product grid |
| `src/app/productor-perfil/productor-perfil.scss` | Cover/profile layout, product grid; **`rgba(0,0,0,0.4)` hardcoded** |

Full diff: `git diff main -- src/app/shared/producto-card src/app/catalogo src/app/producto-detalle src/app/productor-perfil`

</details>
