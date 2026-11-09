export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'agricultor' | 'comprador';
  municipio?: string;
}
