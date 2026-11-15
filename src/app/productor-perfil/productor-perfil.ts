import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductosService } from '../services/productos.service';
import { FavoritosService } from '../services/favoritos.service';
import { PRODUCTORES_MOCK } from '../data/mock-data';
import { Productor } from '../models/productor.model';
import { Producto } from '../models/producto.model';
import { ProductoCard } from '../shared/producto-card/producto-card';

@Component({
  selector: 'app-productor-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductoCard],
  templateUrl: './productor-perfil.html',
  styleUrl: './productor-perfil.scss'
})
export class ProductorPerfil implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private favoritosService = inject(FavoritosService);
  private paramSub: Subscription | null = null;

  productor = signal<Productor | null>(null);
  productosDelProductor = signal<Producto[]>([]);

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const raw = params.get('id');
      const id = Number(raw);
      if (!raw || isNaN(id)) return;
      const p = PRODUCTORES_MOCK.find(pr => pr.id === id);
      if (!p) return;
      this.productor.set(p);
      const productos = this.productosService.productos().filter(
        pr => pr.productorId === id && pr.activo
      );
      this.productosDelProductor.set(productos);
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }

  onToggleFavorito(id: number): void {
    this.favoritosService.toggle(id);
  }

  contactar(): void {
    alert('Funcionalidad de contacto próximamente');
  }
}
