import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.scss'
})
export class ProductoCard {
  @Input({ required: true }) producto!: Producto;
  @Output() toggleFavorito = new EventEmitter<number>();

  favoritosService = inject(FavoritosService);

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(precio);
  }

  onToggleFavorito(event: Event): void {
    event.preventDefault();
    this.favoritosService.toggle(this.producto.id);
    this.toggleFavorito.emit(this.producto.id);
  }
}
