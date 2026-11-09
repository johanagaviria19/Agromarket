import { Component, signal, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar__inner">

        <!-- Logo -->
        <a class="navbar__logo" routerLink="/">🌿 AgroMarket</a>

        <!-- Links escritorio -->
        <ul class="navbar__links" [class.open]="menuAbierto()">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Inicio</a></li>
          <li><a routerLink="/catalogo" routerLinkActive="active">Catálogo</a></li>
          <li><a routerLink="/dashboard-agricultor" routerLinkActive="active">Dashboard Agricultor</a></li>
          <li><a routerLink="/dashboard-comprador" routerLinkActive="active">Dashboard Comprador</a></li>

          <!-- Acciones (visibles en móvil dentro del menú) -->
          <li class="navbar__actions--mobile">
            <button class="btn-outline" (click)="abrirLogin.emit()">Iniciar sesión</button>
            <a class="btn-primary" routerLink="/dashboard-agricultor">Vender mis productos</a>
          </li>
        </ul>

        <!-- Acciones escritorio -->
        <div class="navbar__actions">
          <button class="btn-outline" (click)="abrirLogin.emit()">Iniciar sesión</button>
          <a class="btn-primary" routerLink="/dashboard-agricultor">Vender mis productos</a>
        </div>

        <!-- Hamburguesa -->
        <button class="navbar__hamburger" (click)="toggleMenu()" [attr.aria-expanded]="menuAbierto()" aria-label="Abrir menú">
          <span></span><span></span><span></span>
        </button>

      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--surface-white);
      border-bottom: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      font-family: var(--font-body);
    }

    .navbar__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .navbar__logo {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      color: var(--primary);
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .navbar__links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      list-style: none;
      flex: 1;
    }

    .navbar__links li a {
      text-decoration: none;
      color: var(--text);
      font-size: 0.9rem;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      transition: background 0.15s, color 0.15s;
    }

    .navbar__links li a:hover,
    .navbar__links li a.active {
      background: rgba(40, 89, 67, 0.08);
      color: var(--primary);
    }

    .navbar__actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-shrink: 0;
    }

    .navbar__actions--mobile { display: none; }

    .navbar__hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      margin-left: auto;
    }

    .navbar__hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--text);
      border-radius: 2px;
      transition: all 0.2s;
    }

    @media (max-width: 768px) {
      .navbar__actions { display: none; }

      .navbar__hamburger { display: flex; }

      .navbar__links {
        display: none;
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--surface-white);
        border-bottom: 1px solid var(--border);
        flex-direction: column;
        align-items: stretch;
        padding: 1rem 1.5rem;
        gap: 0.25rem;
      }

      .navbar__links.open { display: flex; }

      .navbar__links li a {
        display: block;
        padding: 10px 12px;
      }

      .navbar__actions--mobile {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--border);
        margin-top: 0.5rem;
      }

      .navbar__actions--mobile a,
      .navbar__actions--mobile button {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class Navbar {
  menuAbierto = signal(false);

  @Output() abrirLogin = new EventEmitter<void>();

  toggleMenu() {
    this.menuAbierto.update(v => !v);
  }
}
