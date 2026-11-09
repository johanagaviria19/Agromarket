import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../services/productos.service';
import { SolicitudesService } from '../services/solicitudes.service';
import { Producto } from '../models/producto.model';
import { EstadoSolicitud } from '../models/solicitud.model';

type SeccionAgricultor = 'resumen' | 'mis-productos' | 'publicar' | 'solicitudes';

@Component({
  selector: 'app-dashboard-agricultor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard-agricultor.html',
  styleUrl: './dashboard-agricultor.scss'
})
export class DashboardAgricultor {
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private solicitudesService = inject(SolicitudesService);

  seccionActiva = signal<SeccionAgricultor>('resumen');
  mensajePublicacion = signal('');

  readonly productos = this.productosService.productos;
  readonly solicitudes = this.solicitudesService.solicitudes;

  readonly categorias: Producto['categoria'][] = ['frutas', 'hortalizas', 'tuberculos', 'granos', 'campesinos'];
  readonly unidades: Producto['unidad'][] = ['kg', 'atado', 'unidad', 'bulto'];

  totalProductos = computed(() => this.productos().length);
  productosActivos = computed(() => this.productos().filter(p => p.activo).length);
  productosAgotados = computed(() => this.productos().filter(p => p.cantidadDisponible === 0).length);
  solicitudesPendientes = computed(() => this.solicitudes().filter(s => s.estado === 'pendiente').length);

  productoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    precio: [null as number | null, [Validators.required, Validators.min(1)]],
    unidad: ['kg', [Validators.required]],
    cantidadDisponible: [null as number | null, [Validators.required, Validators.min(1)]],
    municipio: ['', [Validators.required]],
    imagen: ['']
  });

  publicarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }
    const v = this.productoForm.getRawValue();
    const nuevo: Producto = {
      id: Date.now(),
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      categoria: v.categoria as Producto['categoria'],
      precio: v.precio!,
      unidad: v.unidad as Producto['unidad'],
      cantidadDisponible: v.cantidadDisponible!,
      municipio: v.municipio!,
      departamento: 'Nariño',
      productorId: 1,
      imagen: v.imagen?.trim()
        ? v.imagen
        : 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
      activo: true,
      fechaActualizacion: new Date().toISOString().split('T')[0]
    };

    this.productosService.agregar(nuevo);
    this.mensajePublicacion.set(`Producto "${nuevo.nombre}" publicado con éxito.`);
    this.productoForm.reset({ unidad: 'kg' });
    this.seccionActiva.set('mis-productos');
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      this.productosService.eliminar(id);
    }
  }

  toggleActivo(id: number, activo: boolean): void {
    this.productosService.actualizar(id, { activo: !activo });
  }

  editarProducto(): void {
    alert('Funcionalidad de edición próximamente');
  }

  cambiarEstadoSolicitud(id: number, estado: EstadoSolicitud): void {
    this.solicitudesService.cambiarEstado(id, estado);
  }

  formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  }

  getNombreProducto(id: number): string {
    return this.productosService.getById(id)?.nombre ?? 'Producto no disponible';
  }

  getClaseEstado(estado: EstadoSolicitud): string {
    return `badge-${estado}`;
  }
}
