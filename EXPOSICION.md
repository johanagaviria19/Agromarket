# AgroMarket — Guion de Exposición

> **Documento de preparación para la exposición del proyecto Angular.**
> Cada persona lee su sección, abre los archivos indicados en el editor, y sigue el guion para explicar el código, la pantalla y el proceso Git.

---

## REPARTO DE ROLES

| Persona | Fase | Responsabilidad |
|---------|------|-----------------|
| **Catalina** | Fase 0 + Fase 1 | Estructura base del proyecto, modelos, servicios, Landing, Navbar y Footer |
| **Pedroza** | Fase 2 | Catálogo con filtros, Detalle de producto, Perfil del productor, ProductoCard |
| **Esteban** | Fase 3 | Dashboard Agricultor y Dashboard Comprador |

---

---

## PERSONA 1 — Catalina
### Fase 0 (Base del proyecto: modelos, servicios, app root) + Fase 1 (Landing, Navbar, Footer)

---

### PARTE 1: CÓDIGO

---

#### 1.1 — Interfaces TypeScript (Modelos)

**[Concepto Angular: Interfaces TypeScript]**
Archivo: `app/models/producto.model.ts` — líneas 1–14

```typescript
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: 'frutas' | 'hortalizas' | 'tuberculos' | 'granos' | 'campesinos';
  precio: number;
  unidad: 'kg' | 'atado' | 'unidad' | 'bulto';
  cantidadDisponible: number;
  municipio: string;
  departamento: string;
  productorId: number;
  imagen: string;
  activo: boolean;
  fechaActualizacion: string;
}
```

➡️ **Qué es y por qué importa:** Esto es una interfaz de TypeScript. Define exactamente qué forma tiene un producto en toda la aplicación. Los campos `categoria` y `unidad` usan *union types* (el `|`), lo que significa que solo pueden tener esos valores exactos; si intento poner `categoria: 'verduras'` TypeScript me da error en tiempo de desarrollo antes de que corra el código.

---

**[Concepto Angular: Interfaces TypeScript]**
Archivo: `app/models/productor.model.ts` — líneas 1–13

```typescript
export interface Productor {
  id: number;
  nombre: string;
  tipo: 'individual' | 'asociacion' | 'cooperativa';
  municipio: string;
  departamento: string;
  descripcion: string;
  productos: string[];
  fotoPerfil: string;
  fotoPortada: string;
  lotesEntregados: number;
  activo: boolean;
}
```

➡️ **Qué es y por qué importa:** Lo mismo para un productor. El campo `tipo` solo acepta tres valores posibles. Cuando Angular sirve datos, si alguien manda un objeto con una propiedad que no está aquí, TypeScript avisa. Esto hace que el código sea más seguro y más fácil de mantener entre el equipo.

---

#### 1.2 — Signals en los Servicios + localStorage

**[Concepto Angular: Signals + localStorage]**
Archivo: `app/services/productos.service.ts` — líneas 1–28

```typescript
@Injectable({ providedIn: 'root' })
export class ProductosService {
  private _productos = signal<Producto[]>(this.cargar());

  readonly productos = this._productos.asReadonly();
  readonly disponibles = computed(() =>
    this._productos().filter(p => p.activo && p.cantidadDisponible > 0)
  );

  agregar(nuevo: Producto) {
    this._productos.update(lista => [...lista, nuevo]);
    this.guardar();
  }

  private cargar(): Producto[] {
    const raw = localStorage.getItem('agromarket_productos');
    return raw ? JSON.parse(raw) : PRODUCTOS_MOCK;
  }

  private guardar() {
    localStorage.setItem('agromarket_productos', JSON.stringify(this._productos()));
  }
}
```

➡️ **Qué es y por qué importa:** Aquí está el corazón de la persistencia. `signal<Producto[]>` crea un estado reactivo: cuando cambia, Angular actualiza automáticamente las pantallas que lo usan. `cargar()` lee del `localStorage`; si no hay nada guardado, usa los datos mock. `guardar()` serializa el estado actual a JSON y lo guarda. `.asReadonly()` expone el signal solo para lectura desde afuera, así nadie puede modificarlo sin pasar por `agregar()`, `actualizar()` o `eliminar()`.

---

**[Concepto Angular: Signals + localStorage]**
Archivo: `app/services/favoritos.service.ts` — líneas 1–17

```typescript
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private _ids = signal<number[]>(
    JSON.parse(localStorage.getItem('agromarket_favoritos') || '[]')
  );

  readonly ids = this._ids.asReadonly();
  readonly total = computed(() => this._ids().length);

  esFavorito(id: number): boolean { return this._ids().includes(id); }

  toggle(id: number) {
    this._ids.update(lista =>
      lista.includes(id) ? lista.filter(i => i !== id) : [...lista, id]
    );
    localStorage.setItem('agromarket_favoritos', JSON.stringify(this._ids()));
  }
}
```

➡️ **Qué es y por qué importa:** El servicio de favoritos guarda solo los IDs en un array. `toggle()` usa `.update()` del signal: si el ID ya está, lo saca con `filter`; si no está, lo agrega con spread `[...lista, id]`. Inmediatamente después llama a `localStorage.setItem` para que los favoritos sobrevivan si el usuario recarga la página.

---

#### 1.3 — Standalone Component (App Root)

**[Concepto Angular: Standalone Components]**
Archivo: `app/app.ts` — líneas 1–22

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main { flex: 1; }
  `]
})
export class App {}
```

➡️ **Qué es y por qué importa:** `standalone: true` es el nuevo modelo de Angular: no necesitamos NgModules. En `imports[]` declaramos directamente los componentes que usa este template: `RouterOutlet` (donde Angular inyecta la página según la ruta), `Navbar` y `Footer`. El `min-height: 100vh` con flexbox hace que el footer siempre quede abajo aunque la página tenga poco contenido.

---

#### 1.4 — Navbar: Signal + @Output + CSS Variables

**[Concepto Angular: Signals]**
Archivo: `app/shared/navbar/navbar.ts` — líneas 143–151

```typescript
export class Navbar {
  menuAbierto = signal(false);

  @Output() abrirLogin = new EventEmitter<void>();

  toggleMenu() {
    this.menuAbierto.update(v => !v);
  }
}
```

➡️ **Qué es y por qué importa:** `menuAbierto` es un signal booleano. `toggleMenu()` llama a `.update()`, que recibe el valor actual `v` y retorna su opuesto. Esto es mejor que `this.menuAbierto = !this.menuAbierto` porque Angular detecta el cambio automáticamente sin necesidad de `ChangeDetectionRef`.

---

**[Concepto Angular: @Output y Event Binding]**
Archivo: `app/shared/navbar/navbar.ts` — línea 147

```typescript
@Output() abrirLogin = new EventEmitter<void>();
```

Y en el template del Navbar (línea ~38):
```html
<button class="btn-outline" (click)="abrirLogin.emit()">Iniciar sesión</button>
```

➡️ **Qué es y por qué importa:** `@Output()` permite que el componente hijo (Navbar) emita eventos hacia el padre. `EventEmitter<void>` significa que no manda datos, solo notifica. El `(click)=` es *event binding*: escucha el evento nativo del navegador y ejecuta el método indicado.

---

**[Concepto Angular: Property Binding y CSS Variables]**
Archivo: `app/shared/navbar/navbar.ts` — línea ~21 del template

```html
<ul class="navbar__links" [class.open]="menuAbierto()">
```

Y en los estilos del mismo archivo:
```scss
.navbar {
  background: var(--surface-white);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-body);
}

.navbar__logo {
  color: var(--primary);
  font-family: var(--font-heading);
}
```

➡️ **Qué es y por qué importa:** `[class.open]` es *property binding* para clases CSS: agrega la clase `open` cuando `menuAbierto()` es `true`, y la quita cuando es `false`. Los `var(--primary)` y `var(--surface-white)` son variables CSS definidas en `styles.scss`; así todo el sistema de colores está en un solo lugar.

---

#### 1.5 — CSS Variables globales

**[Concepto Angular: CSS Variables]**
Archivo: `styles.scss` — líneas 1–24

```scss
:root {
  --primary:        #285943;
  --primary-dark:   #193B28;
  --primary-light:  #8DAF76;
  --accent:         #D99B42;
  --danger:         #ba1a1a;
  --background:     #FAFAF6;
  --surface:        #F2EBDD;
  --surface-white:  #ffffff;
  --text:           #2C3531;
  --muted:          #5E6D62;
  --border:         #E8E4DA;
  --radius-sm:      0.5rem;
  --radius-md:      0.75rem;
  --font-heading:   'Playfair Display', serif;
  --font-body:      'Plus Jakarta Sans', sans-serif;
}
```

➡️ **Qué es y por qué importa:** `:root` define variables disponibles en toda la aplicación. Si queremos cambiar el color principal de `#285943` a otro verde, lo cambiamos en un solo lugar y se actualiza en Navbar, Footer, botones y tarjetas a la vez. Es la base del sistema de diseño de AgroMarket.

---

#### 1.6 — Home: computed() + @for + Property Binding

**[Concepto Angular: Computed]**
Archivo: `app/home/home.ts` — líneas 174–181

```typescript
productosDestacados = computed(() => {
  const todos = this.productosService.disponibles();
  const cat = this.categoriaActiva();
  const filtrados = cat === 'todos'
    ? todos
    : todos.filter(p => p.categoria === cat);
  return filtrados.slice(0, 6);
});
```

➡️ **Qué es y por qué importa:** `computed()` crea un valor derivado que se recalcula automáticamente cuando cambia alguno de los signals que usa (`disponibles()` o `categoriaActiva()`). No tenemos que llamar a ninguna función manualmente; Angular sabe cuándo recalcular.

---

**[Concepto Angular: inject()]**
Archivo: `app/home/home.ts` — líneas 165–166

```typescript
private productosService = inject(ProductosService);
readonly favs = inject(FavoritosService);
```

➡️ **Qué es y por qué importa:** `inject()` es la forma moderna de inyección de dependencias en Angular. No necesitamos el constructor con parámetros decorados; simplemente llamamos `inject(ClaseDelServicio)` como propiedad de la clase. Es más limpio y funciona igual que el constructor tradicional.

---

**[Concepto Angular: @for + Property Binding + Event Binding]**
Archivo: `app/home/home.ts` — template, sección productos destacados

```html
@for (producto of productosDestacados(); track producto.id) {
  <div class="producto-card">
    <img [src]="producto.imagen" [alt]="producto.nombre" loading="lazy">
    <button
      (click)="toggleFav(producto.id)"
      [attr.aria-label]="favs.esFavorito(producto.id) ? 'Quitar favorito' : 'Agregar favorito'">
      {{ favs.esFavorito(producto.id) ? '♥' : '♡' }}
    </button>
    <a class="btn-primary" [routerLink]="['/producto', producto.id]">Ver producto</a>
  </div>
}
```

➡️ **Qué es y por qué importa:** `@for` es la nueva sintaxis de Angular 17 (reemplaza `*ngFor`). `track producto.id` le dice a Angular qué campo usar para identificar cada elemento y actualizar solo los que cambiaron. `[src]=` y `[alt]=` son *property bindings* que conectan propiedades del DOM con valores del componente. `(click)=` es *event binding*.

---

#### 1.7 — Footer: Standalone + RouterLink + CSS Variables

**[Concepto Angular: Standalone Components + CSS Variables]**
Archivo: `app/shared/footer/footer.ts` — líneas 1–10

```typescript
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `...`,
  styles: [`
    .footer {
      background: var(--primary-dark);
      color: var(--primary-light);
      font-family: var(--font-body);
    }
  `]
})
export class Footer {}
```

➡️ **Qué es y por qué importa:** El Footer es un componente standalone con estilos en línea. Usa `var(--primary-dark)` para mantener coherencia con el sistema de colores global sin duplicar ningún valor hexadecimal. `RouterLink` en `imports[]` permite usar `routerLink` en los `<a>` del template para navegar entre rutas sin recargar la página.

---

### PARTE 2: VISUAL — Qué mostrar en pantalla

**Al exponer, Catalina debe:**

1. **Abrir `styles.scss`** → mostrar el bloque `:root` con todas las variables de color. Cambiar momentáneamente `--primary` a rojo para demostrar que actualiza todo en vivo (luego revertir).

2. **Abrir la app en el navegador** (`ng serve`) → ir a `/` (Home):
   - Señalar el Navbar pegajoso en la parte superior
   - Hacer clic en cada categoría de la sección "Explora por categoría" y mostrar cómo los productos cambian instantáneamente (ese es el `computed()` reactivo)
   - Hacer clic en el corazón de un producto y recargando la página demostrar que el favorito persiste (localStorage)
   - Reducir la ventana a móvil (< 768px) y mostrar el menú hamburguesa que usa el signal `menuAbierto`

3. **Abrir DevTools > Application > LocalStorage** → mostrar la clave `agromarket_favoritos` con los IDs guardados.

4. **Abrir `producto.model.ts`** en el editor → señalar los union types como documentación viva de los valores posibles.

---

### PARTE 3: GIT — Ramas y commits de Catalina

**Al exponer, Catalina dice:**

> "Mi trabajo está en la rama `feature/Cata-landing-y-base`. Esta rama salió de `main` donde Esteban había dejado la estructura inicial del proyecto con los modelos y los datos mock.
>
> Hice el primer commit con la landing page, el Navbar y el Footer ya funcionando:
> ```
> cee09e2  feat: landing page, navbar y footer completos
> ```
> Después hubo un commit de corrección de errores y advertencias de TypeScript:
> ```
> 926c192  fix: corregir errores funcionales y advertencias de calidad
> ```
> Y un último commit de configuración del editor:
> ```
> ecf70d5  chore: configuracion VS Code para archivos tsconfig como jsonc
> ```
>
> Cuando la feature estuvo lista, abrí un **Pull Request** desde `feature/Cata-landing-y-base` hacia `develop`. El PR fue revisado y mergeado, quedando disponible para que Pedroza y Esteban pudieran partir desde ahí."

**Mostrar en la terminal:**
```bash
git log --oneline feature/Cata-landing-y-base
git diff main feature/Cata-landing-y-base --stat
```

---

---

## PERSONA 2 — Pedroza
### Fase 2 (Catálogo con filtros, Detalle de producto, Perfil del Productor, ProductoCard)

---

### PARTE 1: CÓDIGO

---

#### 2.1 — ProductoCard: @Input() y @Output()

**[Concepto Angular: @Input() y @Output()]**
Archivo: `app/shared/producto-card/producto-card.ts` — líneas 1–30

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.scss'
})
export class ProductoCard {
  @Input({ required: true }) producto!: Producto;
  @Output() toggleFavorito = new EventEmitter<number>();
  esFavorito = false;

  onToggleFavorito(event: Event): void {
    event.preventDefault();
    this.esFavorito = !this.esFavorito;
    this.toggleFavorito.emit(this.producto.id);
  }
}
```

➡️ **Qué es y por qué importa:** `@Input({ required: true })` obliga a quien use este componente a pasarle un producto; si no lo hace, Angular da error en tiempo de compilación. `@Output()` define un evento personalizado `toggleFavorito` que emite el ID del producto. Así el `ProductoCard` no sabe nada del servicio de favoritos; solo avisa "el usuario tocó el corazón de este ID" y el padre (Catálogo o Home) decide qué hacer.

---

**[Concepto Angular: Property Binding y @if]**
Uso del componente en `app/catalogo/catalogo.html` — líneas 73–77

```html
@for (producto of productosFiltrados(); track producto.id) {
  <app-producto-card
    [producto]="producto"
    (toggleFavorito)="onToggleFavorito($event)">
  </app-producto-card>
}
```

➡️ **Qué es y por qué importa:** `[producto]="producto"` es *property binding* hacia el `@Input()` del hijo. `(toggleFavorito)="onToggleFavorito($event)"` escucha el `@Output()` del hijo; `$event` trae el ID que emitió `EventEmitter`. Esta comunicación padre-hijo sin servicios es fundamental en Angular.

---

#### 2.2 — Catálogo: Signals + Computed con múltiples filtros

**[Concepto Angular: Signals]**
Archivo: `app/catalogo/catalogo.ts` — líneas 16–21

```typescript
busqueda = signal('');
categoriaSeleccionada = signal('');
municipioSeleccionado = signal('');
ordenamiento = signal<'precio-asc' | 'precio-desc' | 'nombre'>('nombre');
```

➡️ **Qué es y por qué importa:** Cada filtro del sidebar es un signal independiente. Cuando el usuario escribe en el input de búsqueda, solo el signal `busqueda` cambia; Angular sabe exactamente qué recalcular. No necesitamos manejar eventos de form ni variables booleanas de "dirty".

---

**[Concepto Angular: Computed con lógica compleja]**
Archivo: `app/catalogo/catalogo.ts` — líneas 28–50

```typescript
productosFiltrados = computed(() => {
  const q = this.busqueda().toLowerCase().trim();
  const cat = this.categoriaSeleccionada() as Producto['categoria'] | '';
  const mun = this.municipioSeleccionado();
  const ord = this.ordenamiento();

  const lista = this.productosService.disponibles().filter(p => {
    const matchQ   = !q   || p.nombre.toLowerCase().includes(q)
                          || p.descripcion.toLowerCase().includes(q);
    const matchCat = !cat || p.categoria === cat;
    const matchMun = !mun || p.municipio === mun;
    return matchQ && matchCat && matchMun;
  });

  return [...lista].sort((a, b) => {
    if (ord === 'precio-asc')  return a.precio - b.precio;
    if (ord === 'precio-desc') return b.precio - a.precio;
    return a.nombre.localeCompare(b.nombre);
  });
});

totalResultados = computed(() => this.productosFiltrados().length);
```

➡️ **Qué es y por qué importa:** Este `computed()` escucha cuatro signals al mismo tiempo. Cada vez que cualquiera cambia, Angular recalcula `productosFiltrados` y Angular actualiza el `@for` en el template automáticamente. `totalResultados` es un computed que depende de otro computed, mostrando que se pueden encadenar.

---

**[Concepto Angular: @for + @if — nueva sintaxis]**
Archivo: `app/catalogo/catalogo.html` — líneas 65–80

```html
@if (totalResultados() === 0) {
  <div class="empty-state">
    <p>No se encontraron productos con estos filtros.</p>
    <button class="btn-outline" (click)="limpiarFiltros()">Limpiar filtros</button>
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
```

➡️ **Qué es y por qué importa:** Esta es la nueva sintaxis de Angular 17: `@if` y `@for` sin asterisco, como bloques de código. Antes era `*ngIf` y `*ngFor`. El `@else` está integrado directamente, no necesitamos `ng-template`. Es más legible y más performante.

---

**[Concepto Angular: Property Binding en inputs de filtro]**
Archivo: `app/catalogo/catalogo.html` — líneas 15–20

```html
<input
  id="busqueda"
  type="text"
  [value]="busqueda()"
  (input)="busqueda.set($any($event.target).value)">
```

➡️ **Qué es y por qué importa:** `[value]="busqueda()"` mantiene el input sincronizado con el signal (binding unidireccional de signal al DOM). `(input)="busqueda.set(...)"` captura cada tecla y actualiza el signal. Juntos simulan two-way binding (`[(ngModel)]`) pero con signals, que es más explícito y predecible.

---

#### 2.3 — Producto Detalle: ActivatedRoute + FormBuilder + Computed

**[Concepto Angular: inject() + ActivatedRoute]**
Archivo: `app/producto-detalle/producto-detalle.ts` — líneas 23–29

```typescript
private route = inject(ActivatedRoute);
private router = inject(Router);
private fb = inject(FormBuilder);
private productosService = inject(ProductosService);
private solicitudesService = inject(SolicitudesService);
```

➡️ **Qué es y por qué importa:** Cinco servicios inyectados con la forma moderna `inject()`. `ActivatedRoute` nos da acceso a los parámetros de la URL (el `:id` de `/producto/:id`). `FormBuilder` es un helper para crear formularios reactivos sin tanto código repetitivo.

---

**[Concepto Angular: Enrutamiento con ActivatedRoute]**
Archivo: `app/producto-detalle/producto-detalle.ts` — líneas 42–55

```typescript
ngOnInit(): void {
  this.paramSub = this.route.paramMap.subscribe(params => {
    const raw = params.get('id');
    const id = Number(raw);
    if (!raw || isNaN(id)) {
      this.router.navigate(['/catalogo']);
      return;
    }
    const p = this.productosService.getById(id);
    if (!p) {
      this.router.navigate(['/catalogo']);
      return;
    }
    this.producto.set(p);
  });
}
```

➡️ **Qué es y por qué importa:** `route.paramMap.subscribe()` escucha cambios en los parámetros de la URL. Cuando el usuario navega a `/producto/3`, `params.get('id')` retorna `"3"`. Validamos que sea un número válido y que exista el producto; si no, redirigimos al catálogo. Esto protege contra URLs inválidas.

---

**[Concepto Angular: Formularios Reactivos]**
Archivo: `app/producto-detalle/producto-detalle.ts` — líneas 36–39

```typescript
solicitudForm = this.fb.group({
  cantidad: [1, [Validators.required, Validators.min(1)]],
  notas: ['']
});
```

➡️ **Qué es y por qué importa:** `FormBuilder.group()` crea un `FormGroup` reactivo. Cada campo tiene un valor inicial y un array de validadores. `Validators.min(1)` asegura que no se pida cantidad 0 o negativa. Los formularios reactivos son más poderosos que los de template porque la lógica de validación vive en TypeScript, no en el HTML.

---

**[Concepto Angular: Computed derivado de Signal]**
Archivo: `app/producto-detalle/producto-detalle.ts` — líneas 33–35

```typescript
subtotal = computed(() => {
  const p = this.producto();
  return p ? p.precio * this.cantidad() : 0;
});
```

➡️ **Qué es y por qué importa:** El subtotal se recalcula automáticamente cada vez que cambia el signal `producto` o el signal `cantidad`. No hay que calcular nada manualmente ni suscribirse a eventos; simplemente mostramos `{{ subtotal() }}` en el template y Angular mantiene el valor actualizado.

---

#### 2.4 — Perfil del Productor: Signal + ActivatedRoute

**[Concepto Angular: Signals + inject()]**
Archivo: `app/productor-perfil/productor-perfil.ts` — líneas 20–26

```typescript
export class ProductorPerfil implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private favoritosService = inject(FavoritosService);

  productor = signal<Productor | null>(null);
  productosDelProductor = signal<Producto[]>([]);
```

➡️ **Qué es y por qué importa:** Dos signals tipados: `productor` puede ser `null` si aún no cargó o si el ID no existe. Cuando llamamos `.set()` con los datos, Angular re-renderiza el template automáticamente. Esta combinación de `ActivatedRoute` + signals reemplaza el patrón antiguo de `BehaviorSubject` + `async` pipe.

---

**[Concepto Angular: Enrutamiento + filter en Signal]**
Archivo: `app/productor-perfil/productor-perfil.ts` — líneas 28–40

```typescript
ngOnInit(): void {
  this.paramSub = this.route.paramMap.subscribe(params => {
    const raw = params.get('id');
    const id = Number(raw);
    if (!raw || isNaN(id)) return;
    const p = PRODUCTORES_MOCK.find(pr => pr.id === id);
    if (!p) return;
    this.productor.set(p);
    const productos = this.productosService.productos().filter(
      pr => pr.productorId === id && pr.activo
    );
    this.productosDelProductor.set(productos);
  });
}
```

➡️ **Qué es y por qué importa:** Leemos el ID del productor desde la URL con `ActivatedRoute`, buscamos el productor en los datos mock, y filtramos los productos activos que pertenecen a ese productor. Luego llamamos `.set()` en ambos signals para actualizar el template.

---

### PARTE 2: VISUAL — Qué mostrar en pantalla

**Al exponer, Pedroza debe:**

1. **Ir a `/catalogo`** en el navegador:
   - Escribir algo en el buscador y mostrar cómo los resultados se filtran en tiempo real sin botón "Buscar"
   - Cambiar la categoría y el municipio simultáneamente y mostrar `X productos encontrados` actualizándose
   - Cambiar el ordenamiento a "Precio: menor a mayor" y mostrar las tarjetas reordenándose
   - Dejar filtros que no dan resultados → mostrar el `empty-state` del `@if`

2. **Hacer clic en un producto** → llegar a `/producto/1`:
   - Mostrar cómo la URL tiene el ID del producto
   - Cambiar la cantidad en el formulario y mostrar el subtotal recalculándose en tiempo real
   - Enviar una solicitud y mostrar el mensaje de éxito

3. **Hacer clic en el nombre del productor** → llegar a `/productor/1`:
   - Mostrar el perfil con foto, descripción y los productos de ese productor
   - Señalar la URL `/productor/1` y explicar que Angular leyó ese `1` con `ActivatedRoute`

4. **Abrir DevTools > Application > LocalStorage** → mostrar `agromarket_solicitudes` con la solicitud recién enviada.

---

### PARTE 3: GIT — Ramas y commits de Pedroza

**Al exponer, Pedroza dice:**

> "Mi trabajo está en la rama `feature/Pedroza-catalogo-y-detalle`. Esta rama salió de `develop`, donde ya estaba el trabajo de Catalina mergeado.
>
> Mis commits principales fueron:
> ```
> 2d6207b  feat: implement ProductoCard, Catalogo, ProductoDetalle, ProductorPerfil components
> c06d5d3  feat: catálogo con filtros, detalle de producto y perfil de productor
> 47bfee2  Merge pull request #2 from johanagaviria19/feature/Pedroza-catalogo-y-detalle
> ```
>
> Hice dos Pull Requests hacia `develop`: el primero con la implementación inicial y el segundo con mejoras. El flujo fue: crear rama → desarrollar → commit → push → abrir PR → review → merge a `develop`."

**Mostrar en la terminal:**
```bash
git log --oneline feature/Pedroza-catalogo-y-detalle
git show c06d5d3 --stat
```

---

---

## PERSONA 3 — Esteban
### Fase 3 (Dashboard Agricultor y Dashboard Comprador)

---

### PARTE 1: CÓDIGO

---

#### 3.1 — Dashboard Agricultor: Formularios Reactivos completos

**[Concepto Angular: Formularios Reactivos con FormBuilder + Validators]**
Archivo: `app/dashboard-agricultor/dashboard-agricultor.ts` — líneas 42–52

```typescript
productoForm = this.fb.group({
  nombre:             ['', [Validators.required, Validators.minLength(3)]],
  descripcion:        ['', [Validators.required]],
  categoria:          ['', [Validators.required]],
  precio:             [null as number | null, [Validators.required, Validators.min(1)]],
  unidad:             ['kg', [Validators.required]],
  cantidadDisponible: [null as number | null, [Validators.required, Validators.min(1)]],
  municipio:          ['', [Validators.required]],
  imagen:             ['']
});
```

➡️ **Qué es y por qué importa:** `FormBuilder.group()` define el formulario completo con todos sus campos y validaciones. `Validators.minLength(3)` rechaza nombres muy cortos. `Validators.min(1)` rechaza precios o cantidades de cero o negativos. Este formulario reactivo vive 100% en TypeScript; el HTML solo lo referencia con `formControlName`.

---

**[Concepto Angular: formControlName en el template]**
Archivo: `app/dashboard-agricultor/dashboard-agricultor.html` — líneas 97–115 (sección publicar)

```html
<form class="form" [formGroup]="productoForm" (ngSubmit)="publicarProducto()">
  <div class="form__field">
    <label for="nombre">Nombre del producto</label>
    <input id="nombre" type="text" formControlName="nombre"
           placeholder="Ej: Papa Pastusa Seleccionada">
    @if (productoForm.controls.nombre.invalid &&
         productoForm.controls.nombre.touched) {
      <span class="form__error">
        El nombre es obligatorio (mínimo 3 caracteres).
      </span>
    }
  </div>

  <div class="form__submit">
    <button type="submit" class="btn-primary"
            [disabled]="productoForm.invalid">
      Publicar producto
    </button>
  </div>
</form>
```

➡️ **Qué es y por qué importa:** `[formGroup]="productoForm"` conecta el `<form>` HTML con el FormGroup de TypeScript. `formControlName="nombre"` conecta el `<input>` con el control específico. `[disabled]="productoForm.invalid"` deshabilita el botón mientras haya errores. El `@if` muestra el error solo cuando el campo fue tocado (`touched`) para no molestar al usuario desde el principio.

---

**[Concepto Angular: Signals + .set() para retroalimentación]**
Archivo: `app/dashboard-agricultor/dashboard-agricultor.ts` — líneas 55–72

```typescript
mensajePublicacion = signal('');

publicarProducto(): void {
  if (this.productoForm.invalid) {
    this.productoForm.markAllAsTouched();
    return;
  }
  const v = this.productoForm.getRawValue();
  const nuevo: Producto = {
    id: Date.now(),
    nombre: v.nombre!,
    // ...
    activo: true,
    fechaActualizacion: new Date().toISOString().split('T')[0]
  };
  this.productosService.agregar(nuevo);
  this.mensajePublicacion.set(`Producto "${nuevo.nombre}" publicado con éxito.`);
  this.productoForm.reset({ unidad: 'kg' });
  this.seccionActiva.set('mis-productos');
}
```

➡️ **Qué es y por qué importa:** `mensajePublicacion.set(...)` actualiza el signal con el mensaje de éxito, que el template muestra con `@if (mensajePublicacion())`. Luego `reset()` limpia el formulario y `seccionActiva.set('mis-productos')` navega a la lista de productos, todo sin `Router.navigate()`.

---

#### 3.2 — Dashboard Agricultor: Signals para navegación interna

**[Concepto Angular: Signals para estado de UI]**
Archivo: `app/dashboard-agricultor/dashboard-agricultor.ts` — líneas 10–22

```typescript
type SeccionAgricultor = 'resumen' | 'mis-productos' | 'publicar' | 'solicitudes';

@Component({ ... })
export class DashboardAgricultor {
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private solicitudesService = inject(SolicitudesService);

  seccionActiva = signal<SeccionAgricultor>('resumen');
```

Y en el sidebar del HTML:
```html
<button type="button"
  [class.active]="seccionActiva() === 'resumen'"
  (click)="seccionActiva.set('resumen')">
  📊 Resumen
</button>
```

➡️ **Qué es y por qué importa:** El dashboard no usa rutas hijas para sus secciones; usa un signal `seccionActiva` como un "estado de pantalla". El `type SeccionAgricultor` limita los valores posibles a las cuatro secciones válidas. `[class.active]` aplica la clase CSS cuando el signal coincide con el nombre de la sección.

---

**[Concepto Angular: Computed para estadísticas en tiempo real]**
Archivo: `app/dashboard-agricultor/dashboard-agricultor.ts` — líneas 30–36

```typescript
totalProductos       = computed(() => this.productos().length);
productosActivos     = computed(() => this.productos().filter(p => p.activo).length);
productosAgotados    = computed(() => this.productos().filter(p => p.cantidadDisponible === 0).length);
solicitudesPendientes = computed(() =>
  this.solicitudes().filter(s => s.estado === 'pendiente').length
);
```

➡️ **Qué es y por qué importa:** Cuatro computed derivados del mismo signal de productos y solicitudes. Cuando el agricultor publica un nuevo producto, `totalProductos` y `productosActivos` se actualizan automáticamente en las tarjetas de estadísticas del resumen sin que tengamos que hacer nada más.

---

**[Concepto Angular: @switch — nueva sintaxis]**
Archivo: `app/dashboard-agricultor/dashboard-agricultor.html` — líneas 26–30

```html
@switch (seccionActiva()) {
  @case ('resumen') {
    <h2 class="dash__title">Resumen</h2>
    <!-- tarjetas de estadísticas -->
  }
  @case ('publicar') {
    <h2 class="dash__title">Publicar producto</h2>
    <!-- formulario -->
  }
  @case ('solicitudes') {
    <!-- tabla de solicitudes -->
  }
}
```

➡️ **Qué es y por qué importa:** `@switch` es también parte de la nueva sintaxis de Angular 17. Evalúa el valor del signal `seccionActiva()` y renderiza solo el bloque `@case` que coincide. Es más eficiente que tener múltiples `@if` porque Angular descarta los bloques que no se muestran.

---

#### 3.3 — Dashboard Comprador: Clases CSS dinámicas con Record<string,string>

**[Concepto Angular: Clases CSS dinámicas con mapa (Record)]**
Archivo: `app/dashboard-comprador/dashboard-comprador.ts` — líneas 36–43

```typescript
readonly clasePorEstado: Record<string, string> = {
  pendiente:  'badge-pendiente',
  aceptada:   'badge-aceptada',
  rechazada:  'badge-rechazada',
  finalizada: 'badge-finalizada'
};

getClaseEstado(estado: string): string {
  return this.clasePorEstado[estado] ?? '';
}
```

➡️ **Qué es y por qué importa:** `Record<string, string>` es un tipo TypeScript para un objeto donde todas las claves y valores son strings. En lugar de un `if/else` o `switch` con cuatro casos, usamos el estado como clave del objeto para obtener la clase CSS. Es más limpio y fácil de extender: si mañana hay un estado `cancelada`, solo agregamos una línea al mapa.

---

**[Concepto Angular: Computed encadenado con múltiples servicios]**
Archivo: `app/dashboard-comprador/dashboard-comprador.ts` — líneas 25–34

```typescript
readonly solicitudesList = this.solicitudesService.solicitudes;
readonly totalFavoritos  = this.favoritosService.total;

totalSolicitudes = computed(() => this.solicitudesList().length);
pendientesCount  = computed(() =>
  this.solicitudesList().filter(s => s.estado === 'pendiente').length
);

productosFavoritos = computed(() =>
  this.favoritosService.ids()
    .map(id => this.productosService.getById(id))
    .filter((p): p is Producto => !!p)
);
```

➡️ **Qué es y por qué importa:** `productosFavoritos` es un computed que combina dos servicios: lee los IDs del `FavoritosService` y busca cada producto en `ProductosService`. El `.filter((p): p is Producto => !!p)` es un *type predicate* de TypeScript que descarta los `undefined` y le dice al compilador que el array resultante solo tiene `Producto`, no `Producto | undefined`.

---

**[Concepto Angular: inject() con múltiples servicios]**
Archivo: `app/dashboard-comprador/dashboard-comprador.ts` — líneas 19–23

```typescript
private solicitudesService = inject(SolicitudesService);
private productosService   = inject(ProductosService);
private favoritosService   = inject(FavoritosService);
```

➡️ **Qué es y por qué importa:** El Dashboard del Comprador necesita tres servicios a la vez. Con `inject()` los declaramos como propiedades privadas sin necesitar un constructor con parámetros. Los tres servicios son `providedIn: 'root'`, lo que significa que Angular mantiene una sola instancia de cada uno en toda la app; el Comprador y el Agricultor ven los mismos datos.

---

#### 3.4 — Enrutamiento: app.routes.ts

**[Concepto Angular: Enrutamiento con loadComponent (lazy loading)]**
Archivo: `app/app.routes.ts` — líneas 1–10

```typescript
export const routes: Routes = [
  { path: '',
    loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'catalogo',
    loadComponent: () => import('./catalogo/catalogo').then(m => m.Catalogo) },
  { path: 'producto/:id',
    loadComponent: () => import('./producto-detalle/producto-detalle').then(m => m.ProductoDetalle) },
  { path: 'productor/:id',
    loadComponent: () => import('./productor-perfil/productor-perfil').then(m => m.ProductorPerfil) },
  { path: 'dashboard-agricultor',
    loadComponent: () => import('./dashboard-agricultor/dashboard-agricultor').then(m => m.DashboardAgricultor) },
  { path: 'dashboard-comprador',
    loadComponent: () => import('./dashboard-comprador/dashboard-comprador').then(m => m.DashboardComprador) },
  { path: '**', redirectTo: '' }
];
```

➡️ **Qué es y por qué importa:** `loadComponent` hace *lazy loading*: el código de cada componente se descarga solo cuando el usuario navega a esa ruta. La app inicial es más pequeña y carga más rápido. `:id` en `'producto/:id'` es un parámetro dinámico que `ActivatedRoute` puede leer. `{ path: '**', redirectTo: '' }` captura cualquier URL desconocida y redirige al Home.

---

### PARTE 2: VISUAL — Qué mostrar en pantalla

**Al exponer, Esteban debe:**

1. **Ir a `/dashboard-agricultor`**:
   - Mostrar el sidebar con los cuatro botones de sección
   - Hacer clic en "Resumen" → señalar las cuatro tarjetas de estadísticas
   - Hacer clic en "Publicar producto" → intentar enviar el formulario vacío y mostrar todos los errores de validación apareciendo simultáneamente (ese es `markAllAsTouched()`)
   - Llenar el formulario correctamente y publicar → mostrar el mensaje de éxito y la redirección automática a "Mis productos"
   - En "Mis productos" → señalar el nuevo producto en la tabla; hacer clic en "Desactivar" y mostrar el badge cambiando de "Activo" a "Inactivo"
   - En "Solicitudes" → aceptar una solicitud y mostrar el badge cambiando con la clase CSS del `Record<string,string>`

2. **Ir a `/dashboard-comprador`**:
   - Mostrar la sección "Resumen" con los contadores de solicitudes y favoritos
   - Ir a "Mis favoritos" → mostrar los productos guardados desde antes
   - Ir a "Solicitudes" → mostrar el historial con los badges de colores por estado

3. **Abrir DevTools > Network** → navegar entre rutas y mostrar que los archivos JS de cada componente se descargan la primera vez que se visita esa ruta (lazy loading en acción).

4. **Abrir DevTools > Application > LocalStorage** → mostrar las tres claves: `agromarket_productos`, `agromarket_favoritos`, `agromarket_solicitudes`.

---

### PARTE 3: GIT — Ramas y commits de Esteban

**Al exponer, Esteban dice:**

> "Mi trabajo está en la rama `feature/Esteban-dashboards`. Esta rama salió de `develop` que ya tenía el trabajo de Catalina y Pedroza.
>
> Mi commit principal fue:
> ```
> 9ae7380  feat: dashboard agricultor y dashboard comprador completos
> ```
>
> Cuando terminé, abrí un Pull Request desde `feature/Esteban-dashboards` hacia `develop`. El PR fue revisado y mergeado:
> ```
> a3ea6b1  Merge pull request #4 from johanagaviria19/feature/Esteban-dashboards
> ```
>
> El flujo de Git del equipo fue siempre el mismo: cada persona trabaja en su rama `feature/`, hace commits descriptivos, y cuando termina abre un PR a `develop`. Nadie toca directamente `main` ni `develop`; eso protege el código que ya funciona."

**Mostrar en la terminal:**
```bash
git log --oneline develop
git log --oneline --graph --all
```

---

---

## RESUMEN RÁPIDO DE CONCEPTOS POR PERSONA

| Concepto | Persona | Archivo clave |
|----------|---------|---------------|
| Interfaces TypeScript | Catalina | `models/producto.model.ts`, `models/productor.model.ts` |
| Standalone Components | Catalina | `app.ts`, `footer.ts` |
| Signals (`signal()`, `.set()`, `.update()`) | Catalina | `services/favoritos.service.ts`, `navbar.ts` |
| Computed (`computed()`) | Catalina | `home.ts` → `productosDestacados` |
| inject() | Catalina + Pedroza + Esteban | `home.ts`, `catalogo.ts`, `dashboard-comprador.ts` |
| CSS Variables | Catalina | `styles.scss`, `footer.ts`, `navbar.ts` |
| localStorage | Catalina | `services/productos.service.ts`, `services/favoritos.service.ts` |
| @for / @if (nueva sintaxis) | Pedroza | `catalogo.html`, `home.ts` |
| @Input() y @Output() | Pedroza | `shared/producto-card/producto-card.ts` |
| Property Binding y Event Binding | Pedroza | `catalogo.html`, `home.ts` |
| ActivatedRoute (Enrutamiento) | Pedroza | `producto-detalle.ts`, `productor-perfil.ts` |
| Formularios Reactivos (FormBuilder) | Pedroza + Esteban | `producto-detalle.ts`, `dashboard-agricultor.ts` |
| loadComponent (Lazy Loading) | Esteban | `app.routes.ts` |
| Computed encadenado | Esteban | `dashboard-comprador.ts` |
| Record<string,string> (clases dinámicas) | Esteban | `dashboard-comprador.ts`, `dashboard-agricultor.ts` |
| @switch (nueva sintaxis) | Esteban | `dashboard-agricultor.html` |

---

## NOTAS FINALES PARA EL DÍA DE LA EXPOSICIÓN

- **Abrir el proyecto con `ng serve`** antes de entrar al salón y verificar que compila sin errores.
- **Tener el editor abierto** en los archivos de cada persona antes de que le toque hablar.
- Cuando se muestre código en el editor, **usar Ctrl+G (ir a línea)** para saltar rápidamente al número de línea indicado.
- Si el profesor pregunta por qué usaron signals en lugar de RxJS: "Angular recomienda signals para estado local del componente porque son más simples y más eficientes; RxJS sigue siendo útil para operaciones asíncronas como HTTP."
- Si el profesor pregunta por qué no hay módulos (`NgModule`): "Angular 17 promueve componentes standalone como el modelo por defecto; los módulos ya no son necesarios para apps nuevas."
