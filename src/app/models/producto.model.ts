export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: 'frutas' | 'hortalizas' | 'tuberculos' | 'granos' | 'campesinos';
  precio: number;
  unidad: 'kg' | 'atado' | 'unidad' | 'bulto';
  cantidadDisponible: number;
  municipio: string;
  departamento: string;
  productorId: number;
  imagen: string;
  activo: boolean;
  fechaActualizacion: string;
}
