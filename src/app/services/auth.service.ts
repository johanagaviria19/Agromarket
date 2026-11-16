import { Injectable, signal, computed } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { USUARIOS_MOCK } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _usuario = signal<Usuario | null>(null);

  readonly usuario = this._usuario.asReadonly();
  readonly estaLogueado = computed(() => this._usuario() !== null);
  readonly esAgricultor = computed(() => this._usuario()?.rol === 'agricultor');
  readonly esComprador  = computed(() => this._usuario()?.rol === 'comprador');

  constructor() {
    const guardado = localStorage.getItem('agromarket_usuario');
    if (guardado) {
      try {
        this._usuario.set(JSON.parse(guardado));
      } catch {
        localStorage.removeItem('agromarket_usuario');
      }
    }
  }

  login(email: string, _password: string): boolean {
    const encontrado = USUARIOS_MOCK.find(u => u.email === email);
    if (encontrado) {
      this._usuario.set(encontrado);
      localStorage.setItem('agromarket_usuario', JSON.stringify(encontrado));
      return true;
    }
    return false;
  }

  registrar(nombre: string, email: string, rol: 'agricultor' | 'comprador', municipio?: string): boolean {
    const existe = USUARIOS_MOCK.find(u => u.email === email);
    if (existe) return false;
    const nuevo: Usuario = { id: Date.now(), nombre, email, rol, municipio };
    USUARIOS_MOCK.push(nuevo);
    this._usuario.set(nuevo);
    localStorage.setItem('agromarket_usuario', JSON.stringify(nuevo));
    return true;
  }

  logout(): void {
    this._usuario.set(null);
    localStorage.removeItem('agromarket_usuario');
  }
}
