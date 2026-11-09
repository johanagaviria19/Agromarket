# Four Angular UI components for AgroMarket

Four standalone Angular components were added to complete the buyer-facing surface of AgroMarket: a reusable product card, a catalogue page with reactive filtering, a product detail page with a purchase request form, and a producer profile page. Each component uses Angular 19+ signals and the block-template `@if`/`@for` syntax. All routes are lazy-loaded via `loadComponent` and already registered in `app.routes.ts`.

Watch for: `compradorId` is hardcoded to `1` in `enviarSolicitud()` — there is no auth context yet, so every request is attributed to a phantom user. This is the most significant gap relative to production readiness. The `productorDelProducto` getter on `ProductoDetalle` is a plain getter (not a computed signal), which means it re-executes on every change-detection cycle, but since it is a simple array lookup over a small static dataset the performance impact is negligible.

**Verdict**: APPROVED

---

## High-level view

`ProductoCard` is a pure presentational component. `esFavorito` is a plain boolean class property as required, not a signal, so toggling state is entirely local to the card — the parent hears only the emitted `id` and decides what to persist. This is the right split.

`Catalogo` owns four writable signals that drive a single `productosFiltrados` computed, which in turn feeds `totalResultados`. All four signals are reset by `limpiarFiltros()` and every filter change is piped through `$any($event.target).value` — a standard Angular pattern for native DOM events in strict templates. The `(change)` binding on `<select>` and `(input)` on the text field are both correct for their respective event types.

`ProductoDetalle` validates the route param before trusting it (`Number(raw)` + `isNaN` guard), navigates away on a missing product, and re-validates quantity against `cantidadDisponible` before submission. The `productorDelProducto` getter accesses `PRODUCTORES_MOCK` directly — the component imports the constant rather than routing through a service, which matches the spec. All template accesses to `producto()` are guarded inside an outer `@if(producto())`.

`ProductorPerfil` populates its signals in `ngOnInit` from `PRODUCTORES_MOCK` (for the producer) and `productosService.productos()` (for the product list). The `.filter(pr => pr.productorId === id && pr.activo)` correctly mirrors the `disponibles` computed in `ProductosService` but applies it directly at load time rather than reactively — new products added after init won't appear without a navigation refresh, which is acceptable for this use case.

<details>
<summary>Issues (3)</summary>

1. **Hardcoded `compradorId: 1`** — `enviarSolicitud()` passes `compradorId: 1` unconditionally. Before auth is wired, every solicitud is attributed to user 1 regardless of who is actually signed in. Replace with a real user ID from an auth service or guard the form behind a login check. (confirmed)

2. **Stale product list in `ProductorPerfil`** — `productosDelProductor` is populated once in `ngOnInit` from a snapshot of `productosService.productos()`. If the signal changes after navigation (e.g., a product is added from the dashboard in another tab), the profile won't reflect it. Convert to a `computed` that reads `productosService.productos()` reactively, or accept the current behaviour and document it. (confirmed)

3. **`productorDelProducto` plain getter re-executes every CD cycle** — The getter on `ProductoDetalle` is not memoized. Harmless with a static mock array, but should become a `computed` before `PRODUCTORES_MOCK` is replaced with a service call. (likely)

</details>

<details>
<summary>Details</summary>

### Hardcoded buyer identity in `enviarSolicitud`

```typescript
this.solicitudesService.agregar({
  id: Date.now(),
  productoId: p.id,
  productorId: p.productorId,
  compradorId: 1,   // ← hardcoded
  ...
});
```

The `Solicitud` model requires `compradorId: number`. Without an auth layer the placeholder value `1` satisfies the type but makes every solicitud appear to come from the same buyer. This is confirmed by reading both the model and the service call.

### Reactive gap in `ProductorPerfil`

```typescript
ngOnInit(): void {
  const productos = this.productosService.productos().filter(
    pr => pr.productorId === id && pr.activo
  );
  this.productosDelProductor.set(productos);   // snapshot, not reactive
}
```

`productosDelProductor` is a writable signal set once from a signal snapshot. If `productosService.productos()` updates (e.g., a product is deactivated), the profile grid won't update until the route is re-entered. A `computed(() => this.productosService.productos().filter(...))` would make this reactive at zero additional cost.

### `productorDelProducto` getter on every CD cycle

The `productorDelProducto` getter in `ProductoDetalle` is a plain class getter, not a `computed`. Angular will call it on every change-detection pass. With `PRODUCTORES_MOCK` as a small static array this is currently harmless, but if the producer lookup is ever replaced with a reactive or async source, this getter should become a `computed` signal to avoid re-execution on unrelated state changes.

### Test coverage

No test files were added with these components. There is nothing to flag about missing tests beyond noting the absence: critical paths with zero coverage include the filter+sort logic in `productosFiltrados`, the `enviarSolicitud` validation branch (quantity > available), and the route-param guard in `ngOnInit` on `ProductoDetalle` and `ProductorPerfil`.

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|------|-------------|
| `src/app/shared/producto-card/producto-card.ts` | New standalone component — `@Input` producto, `@Output` toggleFavorito, `esFavorito` bool |
| `src/app/shared/producto-card/producto-card.html` | Card template — image, category badge, favourite button, name, price, link |
| `src/app/shared/producto-card/producto-card.scss` | Card styles — aspect-ratio image wrap, hover elevation, favourite button states |
| `src/app/catalogo/catalogo.ts` | New standalone component — 4 filter signals, `productosFiltrados` computed, `limpiarFiltros` |
| `src/app/catalogo/catalogo.html` | Catalogue template — sidebar filters, product grid, empty state |
| `src/app/catalogo/catalogo.scss` | Catalogue styles — 260px sticky sidebar, 3-col grid, responsive stacking at 768px |
| `src/app/producto-detalle/producto-detalle.ts` | New standalone component — route param guard, reactive form, `enviarSolicitud`, `productorDelProducto` getter |
| `src/app/producto-detalle/producto-detalle.html` | Detail template — image, info, purchase form, success message, producer section |
| `src/app/producto-detalle/producto-detalle.scss` | Detail styles — 2-col grid layout, form inputs, success banner |
| `src/app/productor-perfil/productor-perfil.ts` | New standalone component — reads `PRODUCTORES_MOCK`, filters products by `productorId`, `contactar` alert |
| `src/app/productor-perfil/productor-perfil.html` | Profile template — cover photo, circular avatar, info, product list, product grid |
| `src/app/productor-perfil/productor-perfil.scss` | Profile styles — cover overlay, sticky avatar positioning, responsive grid |

Full diff: `git diff main -- src/app/shared/producto-card src/app/catalogo src/app/producto-detalle src/app/productor-perfil`

</details>
