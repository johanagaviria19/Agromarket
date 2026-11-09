export type EstadoSolicitud = 'pendiente' | 'aceptada' | 'rechazada' | 'finalizada';

export interface Solicitud {
  id: number;
  productoId: number;
  productorId: number;
  compradorId: number;
  cantidad: number;
  subtotal: number;
  estado: EstadoSolicitud;
  fecha: string;
  notas?: string;
}
