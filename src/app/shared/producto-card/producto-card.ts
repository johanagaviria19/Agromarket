import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';

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
  esFavorito = false;

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(precio);
  }

  onToggleFavorito(event: Event): void {
    event.preventDefault();
    this.esFavorito = !this.esFavorito;
    this.toggleFavorito.emit(this.producto.id);
  }
}
