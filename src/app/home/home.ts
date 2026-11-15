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
  styleUrl: './home.scss',
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
