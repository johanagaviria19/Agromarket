import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../models/producto.model';
import { PRODUCTOS_MOCK } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private _productos = signal<Producto[]>(this.cargar());

  readonly productos = this._productos.asReadonly();
  readonly disponibles = computed(() => this._productos().filter(p => p.activo && p.cantidadDisponible > 0));

  getById(id: number): Producto | undefined {
    return this._productos().find(p => p.id === id);
  }

  agregar(nuevo: Producto) {
    this._productos.update(lista => [...lista, nuevo]);
    this.guardar();
  }

  actualizar(id: number, cambios: Partial<Producto>) {
    this._productos.update(lista => lista.map(p => p.id === id ? { ...p, ...cambios } : p));
    this.guardar();
  }

  eliminar(id: number) {
    this._productos.update(lista => lista.filter(p => p.id !== id));
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
