import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudesService } from '../services/solicitudes.service';
import { ProductosService } from '../services/productos.service';
import { FavoritosService } from '../services/favoritos.service';
import { PRODUCTORES_MOCK } from '../data/mock-data';
import { Producto } from '../models/producto.model';

type SeccionComprador = 'resumen' | 'favoritos' | 'solicitudes';

@Component({
  selector: 'app-dashboard-comprador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-comprador.html',
  styleUrl: './dashboard-comprador.scss'
})
export class DashboardComprador {
  private solicitudesService = inject(SolicitudesService);
  private productosService = inject(ProductosService);
  private favoritosService = inject(FavoritosService);

  seccionActiva = signal<SeccionComprador>('resumen');

  readonly solicitudesList = this.solicitudesService.solicitudes;
  readonly totalFavoritos = this.favoritosService.total;

  totalSolicitudes = computed(() => this.solicitudesList().length);
  pendientesCount = computed(() => this.solicitudesList().filter(s => s.estado === 'pendiente').length);

  productosFavoritos = computed(() =>
    this.favoritosService.ids()
      .map(id => this.productosService.getById(id))
      .filter((p): p is Producto => !!p)
  );

  readonly clasePorEstado: Record<string, string> = {
    pendiente: 'badge-pendiente',
    aceptada: 'badge-aceptada',
    rechazada: 'badge-rechazada',
    finalizada: 'badge-finalizada'
  };

  getClaseEstado(estado: string): string {
    return this.clasePorEstado[estado] ?? '';
  }

  getNombreProducto(id: number): string {
    return this.productosService.getById(id)?.nombre ?? 'Producto no disponible';
  }

  getNombreProductor(id: number): string {
    return PRODUCTORES_MOCK.find(p => p.id === id)?.nombre ?? 'Productor desconocido';
  }

  quitarFavorito(id: number): void {
    this.favoritosService.toggle(id);
  }

  formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  }
}
