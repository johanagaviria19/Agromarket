import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../services/productos.service';
import { FavoritosService } from '../services/favoritos.service';
import { PRODUCTORES_MOCK } from '../data/mock-data';

const CATEGORIAS = [
  { id: 'todos',       label: 'Todos',               emoji: '🛒' },
  { id: 'frutas',      label: 'Frutas',               emoji: '🍓' },
  { id: 'hortalizas',  label: 'Hortalizas',           emoji: '🥦' },
  { id: 'tuberculos',  label: 'Tubérculos',           emoji: '🥔' },
  { id: 'granos',      label: 'Granos',               emoji: '🌽' },
  { id: 'campesinos',  label: 'Productos Campesinos', emoji: '🧺' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- ═══════════════════════ HERO ═══════════════════════ -->
    <section class="hero">
      <div class="hero__overlay"></div>
      <div class="hero__content">
        <p class="hero__tag">🌿 Marketplace agrícola de Nariño</p>
        <h1 class="hero__title">Del campo<br>a tu alcance</h1>
        <p class="hero__sub">
          Conectamos productores locales con compradores en toda Colombia.<br>
          Productos frescos, precios justos, trazabilidad real.
        </p>
        <div class="hero__btns">
          <a class="btn-primary hero__btn" routerLink="/catalogo">Explorar productos</a>
          <a class="btn-outline hero__btn-outline" routerLink="/dashboard-agricultor">Registrar finca</a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════ CÓMO FUNCIONA ═══════════════════════ -->
    <section class="steps">
      <div class="section-inner">
        <h2 class="section-title">¿Cómo funciona?</h2>
        <p class="section-sub">Tres pasos para conectar el campo con tu cocina</p>
        <div class="steps__grid">
          @for (step of pasos; track step.num) {
            <div class="step-card">
              <div class="step-card__num">{{ step.num }}</div>
              <div class="step-card__emoji">{{ step.emoji }}</div>
              <h3>{{ step.titulo }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════════ CATEGORÍAS ═══════════════════════ -->
    <section class="categorias">
      <div class="section-inner">
        <h2 class="section-title">Explora por categoría</h2>
        <div class="categorias__grid">
          @for (cat of categorias; track cat.id) {
            <button
              class="cat-card"
              [class.active]="categoriaActiva() === cat.id"
              (click)="categoriaActiva.set(cat.id)">
              <span class="cat-card__emoji">{{ cat.emoji }}</span>
              <span class="cat-card__label">{{ cat.label }}</span>
            </button>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════════ PRODUCTOS DESTACADOS ═══════════════════════ -->
    <section class="productos">
      <div class="section-inner">
        <div class="section-header">
          <div>
            <h2 class="section-title">Productos destacados</h2>
            <p class="section-sub">Frescos del campo, listos para tu mesa</p>
          </div>
          <a class="btn-outline" routerLink="/catalogo">Ver todo el catálogo →</a>
        </div>

        <div class="productos__grid">
          @for (producto of productosDestacados(); track producto.id) {
            <div class="producto-card">
              <div class="producto-card__img-wrap">
                <img [src]="producto.imagen" [alt]="producto.nombre" loading="lazy">
                <button
                  class="producto-card__fav"
                  (click)="toggleFav(producto.id)"
                  [attr.aria-label]="favs.esFavorito(producto.id) ? 'Quitar favorito' : 'Agregar favorito'">
                  {{ favs.esFavorito(producto.id) ? '♥' : '♡' }}
                </button>
                <span class="badge producto-card__badge">{{ producto.categoria }}</span>
              </div>
              <div class="producto-card__body">
                <h3 class="producto-card__name">{{ producto.nombre }}</h3>
                <p class="producto-card__lugar">📍 {{ producto.municipio }}, {{ producto.departamento }}</p>
                <div class="producto-card__meta">
                  <span class="producto-card__precio">{{ formatPrecio(producto.precio) }} / {{ producto.unidad }}</span>
                  <span class="producto-card__stock">{{ producto.cantidadDisponible }} {{ producto.unidad }} disp.</span>
                </div>
                <a class="btn-primary producto-card__btn" [routerLink]="['/producto', producto.id]">Ver producto</a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════════ PRODUCTORES DESTACADOS ═══════════════════════ -->
    <section class="productores">
      <div class="section-inner">
        <h2 class="section-title">Productores destacados</h2>
        <p class="section-sub">Conoce las manos que cultivan tus alimentos</p>
        <div class="productores__grid">
          @for (prod of productoresDestacados; track prod.id) {
            <div class="productor-card">
              <img class="productor-card__portada" [src]="prod.fotoPortada" [alt]="prod.nombre">
              <div class="productor-card__body">
                <img class="productor-card__avatar" [src]="prod.fotoPerfil" [alt]="prod.nombre">
                <div class="productor-card__info">
                  <h3>{{ prod.nombre }}</h3>
                  <p class="productor-card__lugar">📍 {{ prod.municipio }}, {{ prod.departamento }}</p>
                  <p class="productor-card__desc">{{ prod.descripcion }}</p>
                  <div class="productor-card__footer">
                    <span class="badge badge--tipo">{{ prod.tipo }}</span>
                    <a class="btn-outline" [routerLink]="['/productor', prod.id]">Ver perfil →</a>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══════════════════════ BENEFICIOS ═══════════════════════ -->
    <section class="beneficios">
      <div class="section-inner">
        <h2 class="section-title">¿Por qué AgroMarket?</h2>
        <div class="beneficios__grid">
          @for (b of beneficios; track b.titulo) {
            <div class="beneficio-card">
              <span class="beneficio-card__icon">{{ b.icono }}</span>
              <h3>{{ b.titulo }}</h3>
              <p>{{ b.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── Utilidades de sección ── */
    .section-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .section-title {
      font-size: clamp(1.5rem, 3vw, 2rem);
      color: var(--primary-dark);
      margin-bottom: 0.4rem;
    }
    .section-sub {
      color: var(--muted);
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }
    .section-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .section-header .section-title { margin-bottom: 0.25rem; }

    /* ── HERO ── */
    .hero {
      position: relative;
      min-height: 560px;
      display: flex;
      align-items: center;
      background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&fit=crop');
      background-size: cover;
      background-position: center;
    }
    .hero__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(25,59,40,0.85) 0%, rgba(40,89,67,0.70) 100%);
    }
    .hero__content {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
      color: white;
    }
    .hero__tag {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: var(--radius-full);
      padding: 4px 14px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    .hero__title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      line-height: 1.1;
      margin-bottom: 1rem;
    }
    .hero__sub {
      font-size: 1.1rem;
      line-height: 1.7;
      opacity: 0.9;
      max-width: 520px;
      margin-bottom: 2rem;
    }
    .hero__btns { display: flex; gap: 1rem; flex-wrap: wrap; }
    .hero__btn { font-size: 1rem; padding: 12px 28px; }
    .hero__btn-outline {
      background: transparent;
      color: white;
      border: 2px solid rgba(255,255,255,0.7);
      border-radius: var(--radius-sm);
      padding: 12px 28px;
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: background 0.2s;
    }
    .hero__btn-outline:hover { background: rgba(255,255,255,0.15); }

    /* ── PASOS ── */
    .steps {
      background: var(--surface);
      padding: 5rem 0;
    }
    .steps__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .step-card {
      background: var(--surface-white);
      border-radius: var(--radius-lg);
      padding: 2rem 1.5rem;
      text-align: center;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
    }
    .step-card__num {
      width: 36px;
      height: 36px;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.75rem;
    }
    .step-card__emoji { font-size: 2rem; margin-bottom: 0.75rem; }
    .step-card h3 { color: var(--primary-dark); margin-bottom: 0.5rem; font-size: 1.1rem; }
    .step-card p { color: var(--muted); font-size: 0.9rem; line-height: 1.6; }

    /* ── CATEGORÍAS ── */
    .categorias {
      padding: 5rem 0;
      background: var(--background);
    }
    .categorias__grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .cat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      padding: 1rem 1.25rem;
      background: var(--surface-white);
      border: 2px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s, transform 0.1s;
      font-family: var(--font-body);
    }
    .cat-card:hover { border-color: var(--primary-light); transform: translateY(-2px); }
    .cat-card.active { border-color: var(--primary); background: rgba(40,89,67,0.06); }
    .cat-card__emoji { font-size: 1.75rem; }
    .cat-card__label { font-size: 0.85rem; font-weight: 600; color: var(--text); }

    /* ── PRODUCTOS ── */
    .productos {
      padding: 5rem 0;
      background: var(--surface);
    }
    .productos__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .producto-card {
      background: var(--surface-white);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
      transition: box-shadow 0.2s, transform 0.15s;
    }
    .producto-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
    .producto-card__img-wrap {
      position: relative;
      height: 180px;
      overflow: hidden;
    }
    .producto-card__img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .producto-card:hover .producto-card__img-wrap img { transform: scale(1.04); }
    .producto-card__fav {
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--surface-white);
      border: none;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      font-size: 1.1rem;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s;
      color: var(--danger);
    }
    .producto-card__fav:hover { transform: scale(1.15); }
    .producto-card__badge {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: var(--primary);
      color: white;
    }
    .producto-card__body { padding: 1.1rem; }
    .producto-card__name {
      font-size: 1rem;
      color: var(--text);
      margin-bottom: 0.3rem;
      line-height: 1.3;
    }
    .producto-card__lugar { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.75rem; }
    .producto-card__meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.9rem;
    }
    .producto-card__precio { font-weight: 700; color: var(--primary); font-size: 1rem; }
    .producto-card__stock { font-size: 0.78rem; color: var(--muted); }
    .producto-card__btn { width: 100%; text-align: center; }

    /* ── PRODUCTORES ── */
    .productores {
      padding: 5rem 0;
      background: var(--background);
    }
    .productores__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .productor-card {
      background: var(--surface-white);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
      transition: box-shadow 0.2s;
    }
    .productor-card:hover { box-shadow: var(--shadow-md); }
    .productor-card__portada {
      width: 100%;
      height: 130px;
      object-fit: cover;
    }
    .productor-card__body {
      display: flex;
      gap: 1rem;
      padding: 1.25rem;
      align-items: flex-start;
    }
    .productor-card__avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--surface-white);
      margin-top: -2rem;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }
    .productor-card__info h3 { font-size: 1rem; margin-bottom: 0.2rem; }
    .productor-card__lugar { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.5rem; }
    .productor-card__desc { font-size: 0.85rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.75rem; }
    .productor-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .badge--tipo { background: var(--surface); color: var(--primary); border: 1px solid var(--border); }

    /* ── BENEFICIOS ── */
    .beneficios {
      padding: 5rem 0;
      background: var(--primary-dark);
    }
    .beneficios .section-title { color: white; }
    .beneficios .section-sub { color: rgba(255,255,255,0.6); }
    .beneficios__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .beneficio-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: var(--radius-lg);
      padding: 2rem 1.5rem;
      text-align: center;
      color: white;
      transition: background 0.2s;
    }
    .beneficio-card:hover { background: rgba(255,255,255,0.1); }
    .beneficio-card__icon { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
    .beneficio-card h3 { font-size: 1.05rem; margin-bottom: 0.5rem; }
    .beneficio-card p { font-size: 0.875rem; opacity: 0.75; line-height: 1.6; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .beneficios__grid { grid-template-columns: repeat(2, 1fr); }
      .steps__grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .hero { min-height: 480px; }
      .hero__title { font-size: 2.2rem; }
      .productores__grid { grid-template-columns: 1fr; }
      .section-header { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 480px) {
      .beneficios__grid { grid-template-columns: 1fr; }
      .productos__grid { grid-template-columns: 1fr; }
    }
  `]
})
export class Home {
  private productosService = inject(ProductosService);
  readonly favs = inject(FavoritosService);

  categorias = CATEGORIAS;
  categoriaActiva = signal('todos');

  productosDestacados = computed(() => {
    const todos = this.productosService.disponibles();
    const cat = this.categoriaActiva();
    const filtrados = cat === 'todos' ? todos : todos.filter(p => p.categoria === cat);
    return filtrados.slice(0, 6);
  });

  productoresDestacados = PRODUCTORES_MOCK.slice(0, 3);

  pasos = [
    { num: 1, emoji: '🔍', titulo: 'Descubre', desc: 'Explora el catálogo de productos frescos directo de los agricultores de Nariño.' },
    { num: 2, emoji: '🤝', titulo: 'Conecta',  desc: 'Contáctate directamente con el productor, sin intermediarios ni sobrecostos.' },
    { num: 3, emoji: '🛒', titulo: 'Compra',   desc: 'Realiza tu pedido con trazabilidad completa y recibe en tu puerta.' },
  ];

  beneficios = [
    { icono: '🤝', titulo: 'Conexión directa',  desc: 'Sin intermediarios. El precio que ves es lo que paga el productor al campo.' },
    { icono: '💰', titulo: 'Precio justo',       desc: 'Productores reciben el valor real de su cosecha, compradores ahorran.' },
    { icono: '🌱', titulo: 'Apoya el campo',     desc: 'Cada compra sostiene familias campesinas y fomenta la agricultura local.' },
    { icono: '🚚', titulo: 'Entrega rápida',     desc: 'Red de distribución regional para llevar el producto más fresco posible.' },
  ];

  formatPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
  }

  toggleFav(id: number) {
    this.favs.toggle(id);
  }
}
