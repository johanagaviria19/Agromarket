import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductosService } from '../services/productos.service';
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
export class ProductorPerfil implements OnInit {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);

  productor = signal<Productor | null>(null);
  productosDelProductor = signal<Producto[]>([]);

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = Number(raw);
    if (!raw || isNaN(id)) return;
    const p = PRODUCTORES_MOCK.find(pr => pr.id === id);
    if (!p) return;
    this.productor.set(p);
    const productos = this.productosService.productos().filter(
      pr => pr.productorId === id && pr.activo
    );
    this.productosDelProductor.set(productos);
  }

  contactar(): void {
    alert('Funcionalidad de contacto próximamente');
  }
}
