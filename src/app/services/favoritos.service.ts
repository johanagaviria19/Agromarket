import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private _ids = signal<number[]>(
    JSON.parse(localStorage.getItem('agromarket_favoritos') || '[]')
  );

  // Signal público — el template puede leerlo reactivamente
  readonly ids = this._ids.asReadonly();
  readonly total = computed(() => this._ids().length);

  // Método normal (para uso en TS, no en templates directamente)
  esFavorito(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number): void {
    this._ids.update(lista =>
      lista.includes(id) ? lista.filter(i => i !== id) : [...lista, id]
    );
    localStorage.setItem('agromarket_favoritos', JSON.stringify(this._ids()));
  }
}
