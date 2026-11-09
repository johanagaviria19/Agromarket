import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../services/productos.service';
import { SolicitudesService } from '../services/solicitudes.service';
import { Producto } from '../models/producto.model';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.scss'
})
export class ProductoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private solicitudesService = inject(SolicitudesService);

  producto = signal<Producto | null>(null);
  cantidad = signal(1);
  mensajeExito = signal('');

  subtotal = computed(() => {
    const p = this.producto();
    return p ? p.precio * this.cantidad() : 0;
  });

  solicitudForm = this.fb.group({
    cantidad: [1, [Validators.required, Validators.min(1)]],
    notas: ['']
  });

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = Number(raw);
    if (!raw || isNaN(id)) {
      this.router.navigate(['/catalogo']);
      return;
    }
    const p = this.productosService.getById(id);
    if (!p) {
      this.router.navigate(['/catalogo']);
      return;
    }
    this.producto.set(p);
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(precio);
  }

  onCantidadChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.cantidad.set(val);
    this.solicitudForm.patchValue({ cantidad: val });
  }

  enviarSolicitud(): void {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      return;
    }
    const p = this.producto();
    if (!p) return;
    const cant = this.solicitudForm.value.cantidad as number;
    if (cant > p.cantidadDisponible) {
      return;
    }
    this.solicitudesService.agregar({
      id: Date.now(),
      productoId: p.id,
      productorId: p.productorId,
      compradorId: 1,
      cantidad: cant,
      subtotal: this.subtotal(),
      estado: 'pendiente',
      fecha: new Date().toISOString().split('T')[0],
      notas: this.solicitudForm.value.notas ?? ''
    });
    this.mensajeExito.set('¡Solicitud enviada con éxito! El productor se pondrá en contacto contigo.');
  }
}
