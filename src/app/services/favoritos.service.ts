import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private _ids = signal<number[]>(JSON.parse(localStorage.getItem('agromarket_favoritos') || '[]'));

  readonly ids = this._ids.asReadonly();
  readonly total = computed(() => this._ids().length);

  esFavorito(id: number): boolean { return this._ids().includes(id); }

  toggle(id: number) {
    this._ids.update(lista => lista.includes(id) ? lista.filter(i => i !== id) : [...lista, id]);
    localStorage.setItem('agromarket_favoritos', JSON.stringify(this._ids()));
  }
}
