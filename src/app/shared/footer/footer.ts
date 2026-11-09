import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__inner">

        <!-- Marca -->
        <div class="footer__brand">
          <p class="footer__logo">🌿 AgroMarket</p>
          <p class="footer__slogan">Del campo a tu alcance</p>
          <p class="footer__desc">
            Conectamos productores agrícolas de Nariño con compradores de todo Colombia.
          </p>
        </div>

        <!-- Categorías -->
        <div class="footer__col">
          <h4 class="footer__title">Categorías</h4>
          <ul>
            <li><a routerLink="/catalogo">Frutas</a></li>
            <li><a routerLink="/catalogo">Hortalizas</a></li>
            <li><a routerLink="/catalogo">Tubérculos</a></li>
            <li><a routerLink="/catalogo">Granos</a></li>
            <li><a routerLink="/catalogo">Productos Campesinos</a></li>
          </ul>
        </div>

        <!-- Plataforma -->
        <div class="footer__col">
          <h4 class="footer__title">Plataforma</h4>
          <ul>
            <li><a routerLink="/">Inicio</a></li>
            <li><a routerLink="/catalogo">Catálogo</a></li>
            <li><a routerLink="/dashboard-agricultor">Soy Agricultor</a></li>
            <li><a routerLink="/dashboard-comprador">Soy Comprador</a></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div class="footer__col">
          <h4 class="footer__title">Contacto</h4>
          <ul class="footer__contact">
            <li>📞 +57 602 720-9000</li>
            <li>📍 Pasto, Nariño</li>
            <li>✉️ contacto&#64;agromarket.com.co</li>
          </ul>
        </div>

      </div>

      <div class="footer__bottom">
        <p>© 2025 AgroMarket — Todos los derechos reservados</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--primary-dark);
      color: var(--primary-light);
      font-family: var(--font-body);
      margin-top: auto;
    }

    .footer__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1.5rem 2rem;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.4fr;
      gap: 2.5rem;
    }

    .footer__logo {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      color: var(--surface-white);
      margin-bottom: 0.4rem;
    }

    .footer__slogan {
      font-size: 0.95rem;
      color: var(--primary-light);
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .footer__desc {
      font-size: 0.85rem;
      line-height: 1.6;
      opacity: 0.75;
    }

    .footer__title {
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--primary-light);
      margin-bottom: 1rem;
    }

    .footer__col ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer__col ul li a {
      color: var(--primary-light);
      text-decoration: none;
      font-size: 0.875rem;
      opacity: 0.85;
      transition: opacity 0.15s, color 0.15s;
    }

    .footer__col ul li a:hover {
      opacity: 1;
      color: var(--surface-white);
    }

    .footer__contact li {
      font-size: 0.875rem;
      opacity: 0.85;
    }

    .footer__bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      text-align: center;
      padding: 1.25rem 1.5rem;
      font-size: 0.8rem;
      opacity: 0.6;
    }

    @media (max-width: 768px) {
      .footer__inner {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      .footer__brand {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 480px) {
      .footer__inner {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Footer {}
