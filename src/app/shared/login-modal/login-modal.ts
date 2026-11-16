import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (visible) {
      <div class="overlay" (click)="cerrar.emit()"></div>
      <div class="modal">
        <button class="modal__close" (click)="cerrar.emit()" aria-label="Cerrar">✕</button>

        <div class="modal__tabs">
          <button class="tab" [class.tab--active]="tabActiva() === 'login'" (click)="tabActiva.set('login')">Iniciar sesión</button>
          <button class="tab" [class.tab--active]="tabActiva() === 'registro'" (click)="tabActiva.set('registro')">Registrarse</button>
        </div>

        @if (tabActiva() === 'login') {
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="modal__form">
            <h2 class="modal__title">Bienvenido</h2>

            <label class="field">
              <span>Correo electrónico</span>
              <input type="email" formControlName="email" placeholder="tu@correo.com" />
              @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
                <span class="field__error">Ingresa un correo válido</span>
              }
            </label>

            <label class="field">
              <span>Contraseña</span>
              <input type="password" formControlName="password" placeholder="••••••••" />
              @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
                <span class="field__error">La contraseña es obligatoria</span>
              }
            </label>

            @if (errorLogin()) {
              <p class="form__error">{{errorLogin()}}</p>
            }

            <button type="submit" class="btn-primary btn--full">Entrar</button>

            <p class="modal__hint">Prueba: <code>hernando@agro.co</code> o <code>maria@comprador.co</code> (cualquier contraseña)</p>
          </form>
        }

        @if (tabActiva() === 'registro') {
          <form [formGroup]="registroForm" (ngSubmit)="onRegistro()" class="modal__form">
            <h2 class="modal__title">Crear cuenta</h2>

            <label class="field">
              <span>Nombre completo</span>
              <input type="text" formControlName="nombre" placeholder="Tu nombre" />
              @if (registroForm.get('nombre')?.touched && registroForm.get('nombre')?.invalid) {
                <span class="field__error">El nombre es obligatorio</span>
              }
            </label>

            <label class="field">
              <span>Correo electrónico</span>
              <input type="email" formControlName="email" placeholder="tu@correo.com" />
              @if (registroForm.get('email')?.touched && registroForm.get('email')?.invalid) {
                <span class="field__error">Ingresa un correo válido</span>
              }
            </label>

            <label class="field">
              <span>Contraseña</span>
              <input type="password" formControlName="password" placeholder="••••••••" />
              @if (registroForm.get('password')?.touched && registroForm.get('password')?.invalid) {
                <span class="field__error">La contraseña es obligatoria</span>
              }
            </label>

            <label class="field">
              <span>Rol</span>
              <select formControlName="rol">
                <option value="">Selecciona un rol</option>
                <option value="agricultor">Agricultor</option>
                <option value="comprador">Comprador</option>
              </select>
              @if (registroForm.get('rol')?.touched && registroForm.get('rol')?.invalid) {
                <span class="field__error">Selecciona un rol</span>
              }
            </label>

            <label class="field">
              <span>Municipio (opcional)</span>
              <input type="text" formControlName="municipio" placeholder="Tu municipio" />
            </label>

            @if (errorRegistro()) {
              <p class="form__error">{{errorRegistro()}}</p>
            }

            <button type="submit" class="btn-primary btn--full">Registrarme</button>
          </form>
        }
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 200;
      animation: fadeIn 0.2s ease;
    }
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 201;
      background: var(--surface-white);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.18));
      width: min(440px, 95vw);
      padding: 2rem;
      animation: slideUp 0.2s ease;
    }
    .modal__close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.1rem;
      cursor: pointer;
      color: var(--text-muted, #888);
      line-height: 1;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
    }
    .modal__close:hover { color: var(--text); background: var(--surface, #f5f5f5); }
    .modal__tabs {
      display: flex;
      border-bottom: 2px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .tab {
      flex: 1;
      background: none;
      border: none;
      padding: 0.6rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      color: var(--text-muted, #888);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: color 0.15s, border-color 0.15s;
    }
    .tab--active { color: var(--primary); border-bottom-color: var(--primary); }
    .modal__title {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      color: var(--text);
      margin: 0 0 1.25rem;
    }
    .modal__form { display: flex; flex-direction: column; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.3rem; }
    .field span { font-size: 0.85rem; font-weight: 600; color: var(--text); }
    .field input, .field select {
      padding: 0.6rem 0.8rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      background: var(--surface-white);
      color: var(--text);
      transition: border-color 0.15s;
    }
    .field input:focus, .field select:focus {
      outline: none;
      border-color: var(--primary);
    }
    .field__error { font-size: 0.78rem; color: var(--error, #c0392b); }
    .form__error {
      background: var(--error-bg, #fdecea);
      color: var(--error, #c0392b);
      border-radius: var(--radius-sm);
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
      margin: 0;
    }
    .btn--full { width: 100%; justify-content: center; }
    .modal__hint { font-size: 0.78rem; color: var(--text-muted, #888); margin: 0; text-align: center; }
    .modal__hint code { background: var(--surface, #f5f5f5); padding: 1px 4px; border-radius: 3px; font-size: 0.75rem; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -48%); } to { opacity: 1; transform: translate(-50%, -50%); } }
  `]
})
export class LoginModal {
  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() loginExitoso = new EventEmitter<void>();

  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  tabActiva = signal<'login' | 'registro'>('login');
  errorLogin = signal('');
  errorRegistro = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rol: ['', Validators.required],
    municipio: ['']
  });

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    const ok = this.auth.login(email!, password!);
    if (ok) {
      this.errorLogin.set('');
      this.loginExitoso.emit();
      this.cerrar.emit();
    } else {
      this.errorLogin.set('Credenciales incorrectas. Verifica tu correo.');
    }
  }

  onRegistro(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    const { nombre, email, password: _pw, rol, municipio } = this.registroForm.value;
    const ok = this.auth.registrar(nombre!, email!, rol as 'agricultor' | 'comprador', municipio ?? undefined);
    if (ok) {
      this.errorRegistro.set('');
      this.loginExitoso.emit();
      this.cerrar.emit();
    } else {
      this.errorRegistro.set('Email ya registrado. Intenta iniciar sesión.');
    }
  }
}
