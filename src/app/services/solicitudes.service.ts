import { Injectable, signal, computed } from '@angular/core';
import { Solicitud, EstadoSolicitud } from '../models/solicitud.model';
import { SOLICITUDES_MOCK } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private _solicitudes = signal<Solicitud[]>(this.cargar());

  readonly solicitudes = this._solicitudes.asReadonly();
  readonly pendientes = computed(() => this._solicitudes().filter(s => s.estado === 'pendiente'));

  agregar(nueva: Solicitud) {
    this._solicitudes.update(lista => [...lista, nueva]);
    this.guardar();
  }

  cambiarEstado(id: number, estado: EstadoSolicitud) {
    this._solicitudes.update(lista => lista.map(s => s.id === id ? { ...s, estado } : s));
    this.guardar();
  }

  private cargar(): Solicitud[] {
    const raw = localStorage.getItem('agromarket_solicitudes');
    return raw ? JSON.parse(raw) : SOLICITUDES_MOCK;
  }

  private guardar() {
    localStorage.setItem('agromarket_solicitudes', JSON.stringify(this._solicitudes()));
  }
}
