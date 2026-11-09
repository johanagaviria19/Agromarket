import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../services/productos.service';
import { FavoritosService } from '../services/favoritos.service';
import { ProductoCard } from '../shared/producto-card/producto-card';
import { Producto } from '../models/producto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ProductoCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class Catalogo {
  private productosService = inject(ProductosService);
  private favoritosService = inject(FavoritosService);

  busqueda = signal('');
  categoriaSeleccionada = signal('');
  municipioSeleccionado = signal('');
  ordenamiento = signal<'precio-asc' | 'precio-desc' | 'nombre'>('nombre');

  readonly municipios = ['Pasto', 'Túquerres', 'Ipiales', 'La Florida', 'Sandoná', 'Buesaco'];
  readonly categorias: Producto['categoria'][] = ['frutas', 'hortalizas', 'tuberculos', 'granos', 'campesinos'];

  productosFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const cat = this.categoriaSeleccionada() as Producto['categoria'] | '';
    const mun = this.municipioSeleccionado();
    const ord = this.ordenamiento();

    const lista = this.productosService.disponibles().filter(p => {
      const matchQ   = !q   || p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
      const matchCat = !cat || p.categoria === cat;
      const matchMun = !mun || p.municipio === mun;
      return matchQ && matchCat && matchMun;
    });

    return [...lista].sort((a, b) => {
      if (ord === 'precio-asc')  return a.precio - b.precio;
      if (ord === 'precio-desc') return b.precio - a.precio;
      return a.nombre.localeCompare(b.nombre);
    });
  });

  totalResultados = computed(() => this.productosFiltrados().length);

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.categoriaSeleccionada.set('');
    this.municipioSeleccionado.set('');
    this.ordenamiento.set('nombre');
  }

  onToggleFavorito(id: number): void {
    this.favoritosService.toggle(id);
  }
}
