import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { LoginModal } from './shared/login-modal/login-modal';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, LoginModal],
  template: `
    <app-navbar (abrirLogin)="modalVisible.set(true)"></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-login-modal
      [visible]="modalVisible()"
      (cerrar)="modalVisible.set(false)"
      (loginExitoso)="onLoginExitoso()"
    ></app-login-modal>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main {
      flex: 1;
    }
  `]
})
export class App {
  private auth = inject(AuthService);
  private router = inject(Router);

  modalVisible = signal(false);

  onLoginExitoso(): void {
    this.modalVisible.set(false);
    const usuario = this.auth.usuario();
    if (usuario?.rol === 'agricultor') {
      this.router.navigate(['/dashboard-agricultor']);
    } else if (usuario?.rol === 'comprador') {
      this.router.navigate(['/dashboard-comprador']);
    }
  }
}
