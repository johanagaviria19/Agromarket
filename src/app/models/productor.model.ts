export interface Productor {
  id: number;
  nombre: string;
  tipo: 'individual' | 'asociacion' | 'cooperativa';
  municipio: string;
  departamento: string;
  descripcion: string;
  productos: string[];
  fotoPerfil: string;
  fotoPortada: string;
  lotesEntregados: number;
  activo: boolean;
}
