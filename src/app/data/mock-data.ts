import { Producto } from '../models/producto.model';
import { Productor } from '../models/productor.model';
import { Solicitud } from '../models/solicitud.model';

export const PRODUCTORES_MOCK: Productor[] = [
  {
    id: 1, nombre: 'Don Hernando Jojoa', tipo: 'individual',
    municipio: 'Pasto', departamento: 'Nariño',
    descripcion: '35 años cultivando tubérculos andinos con abonos orgánicos propios.',
    productos: ['Papa Pastusa', 'Papa Criolla', 'Habas de Altura'],
    fotoPerfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    fotoPortada: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=300&fit=crop',
    lotesEntregados: 14, activo: true
  },
  {
    id: 2, nombre: 'Asomuflor Nariño', tipo: 'asociacion',
    municipio: 'La Florida', departamento: 'Nariño',
    descripcion: 'Asociación de 24 mujeres campesinas en mora, fresa y uchuva agroecológica.',
    productos: ['Mora de Castilla', 'Uchuva', 'Fresa de Altura'],
    fotoPerfil: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    fotoPortada: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&h=300&fit=crop',
    lotesEntregados: 38, activo: true
  },
  {
    id: 3, nombre: 'Coop. Valle de Atriz', tipo: 'cooperativa',
    municipio: 'Túquerres', departamento: 'Nariño',
    descripcion: 'Cooperativa agrícola con abastecimiento continuo para restaurantes y hoteles.',
    productos: ['Zanahoria Lavada', 'Brócoli', 'Cebolla Junca'],
    fotoPerfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    fotoPortada: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=300&fit=crop',
    lotesEntregados: 92, activo: true
  },
  {
    id: 4, nombre: 'Don Carlos Rosero', tipo: 'individual',
    municipio: 'Sandoná', departamento: 'Nariño',
    descripcion: 'Productor de cebolla larga en el valle cálido de Sandoná.',
    productos: ['Cebolla Larga Junca', 'Tomate Chonto'],
    fotoPerfil: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
    fotoPortada: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&h=300&fit=crop',
    lotesEntregados: 21, activo: true
  },
  {
    id: 5, nombre: 'Finca Bella Vista', tipo: 'individual',
    municipio: 'Buesaco', departamento: 'Nariño',
    descripcion: 'Cultivo de mora en el cañón del Juanambú con prácticas agroecológicas.',
    productos: ['Mora de Castilla Seleccionada', 'Lulo'],
    fotoPerfil: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
    fotoPortada: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=300&fit=crop',
    lotesEntregados: 9, activo: true
  },
  {
    id: 6, nombre: 'Cooperativa Guaitara', tipo: 'cooperativa',
    municipio: 'Ipiales', departamento: 'Nariño',
    descripcion: 'Cooperativa del piedemonte andino especializada en zanahoria y papa.',
    productos: ['Zanahoria Orgánica', 'Papa Nativa', 'Arveja'],
    fotoPerfil: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop',
    fotoPortada: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=300&fit=crop',
    lotesEntregados: 47, activo: true
  }
];

export const PRODUCTOS_MOCK: Producto[] = [
  {
    id: 1, nombre: 'Papa Pastusa Seleccionada', descripcion: 'Papa de primera calidad cosechada a 2.800 msnm en Cabrera. Tamaño uniforme, sin golpes.',
    categoria: 'tuberculos', precio: 3200, unidad: 'kg', cantidadDisponible: 1200,
    municipio: 'Pasto', departamento: 'Nariño', productorId: 1,
    imagen: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-01'
  },
  {
    id: 2, nombre: 'Tomate Chonto en Rama', descripcion: 'Tomate grado 1 superior cosechado en Túquerres. Sabor intenso y piel firme.',
    categoria: 'hortalizas', precio: 4500, unidad: 'kg', cantidadDisponible: 450,
    municipio: 'Túquerres', departamento: 'Nariño', productorId: 3,
    imagen: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-02'
  },
  {
    id: 3, nombre: 'Fresa Silvestre de Altura', descripcion: 'Fresa cosecha selecta de La Florida, con alta concentración de azúcar natural.',
    categoria: 'frutas', precio: 7800, unidad: 'kg', cantidadDisponible: 280,
    municipio: 'La Florida', departamento: 'Nariño', productorId: 2,
    imagen: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-01'
  },
  {
    id: 4, nombre: 'Zanahoria Orgánica Lavada', descripcion: 'Zanahoria lavada y calibrada del piedemonte andino. Libre de agroquímicos.',
    categoria: 'hortalizas', precio: 2800, unidad: 'kg', cantidadDisponible: 800,
    municipio: 'Ipiales', departamento: 'Nariño', productorId: 6,
    imagen: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-03'
  },
  {
    id: 5, nombre: 'Cebolla Larga Junca', descripcion: 'Cebolla tallo extra grueso del valle cálido de Sandoná. Atados de 1 kg.',
    categoria: 'hortalizas', precio: 3000, unidad: 'atado', cantidadDisponible: 600,
    municipio: 'Sandoná', departamento: 'Nariño', productorId: 4,
    imagen: 'https://images.unsplash.com/photo-1618512496248-a1f5f9ddc566?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-02'
  },
  {
    id: 6, nombre: 'Mora de Castilla Seleccionada', descripcion: 'Mora con grados Brix óptimos. Cosechada en el cañón del Juanambú.',
    categoria: 'frutas', precio: 5200, unidad: 'kg', cantidadDisponible: 350,
    municipio: 'Buesaco', departamento: 'Nariño', productorId: 5,
    imagen: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-01'
  },
  {
    id: 7, nombre: 'Papa Criolla Colombia', descripcion: 'Papa criolla recién cosechada. Ideal para sopas y guisos.',
    categoria: 'tuberculos', precio: 4100, unidad: 'kg', cantidadDisponible: 500,
    municipio: 'Pasto', departamento: 'Nariño', productorId: 1,
    imagen: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-04'
  },
  {
    id: 8, nombre: 'Uchuva de Exportación', descripcion: 'Uchuva con capuchón seleccionada para exportación. Alta en vitamina C.',
    categoria: 'frutas', precio: 9500, unidad: 'kg', cantidadDisponible: 180,
    municipio: 'La Florida', departamento: 'Nariño', productorId: 2,
    imagen: 'https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-03'
  },
  {
    id: 9, nombre: 'Maíz Capio Amarillo', descripcion: 'Maíz capio tradicional de las comunidades indígenas del Altiplano.',
    categoria: 'granos', precio: 2200, unidad: 'kg', cantidadDisponible: 900,
    municipio: 'Ipiales', departamento: 'Nariño', productorId: 6,
    imagen: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-02'
  },
  {
    id: 10, nombre: 'Brócoli Fresco', descripcion: 'Brócoli con color intenso y florete compacto. Cosechado con frío de madrugada.',
    categoria: 'hortalizas', precio: 3600, unidad: 'kg', cantidadDisponible: 320,
    municipio: 'Túquerres', departamento: 'Nariño', productorId: 3,
    imagen: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-04'
  },
  {
    id: 11, nombre: 'Lulo de Castilla', descripcion: 'Lulo maduro del cañón del Juanambú. Ideal para jugos naturales.',
    categoria: 'frutas', precio: 6000, unidad: 'kg', cantidadDisponible: 250,
    municipio: 'Buesaco', departamento: 'Nariño', productorId: 5,
    imagen: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-03'
  },
  {
    id: 12, nombre: 'Panela Campesina Redonda', descripcion: 'Panela artesanal de trapiche familiar. Sin conservantes ni mezclas.',
    categoria: 'campesinos', precio: 4800, unidad: 'unidad', cantidadDisponible: 400,
    municipio: 'Sandoná', departamento: 'Nariño', productorId: 4,
    imagen: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop',
    activo: true, fechaActualizacion: '2025-11-01'
  }
];

export const SOLICITUDES_MOCK: Solicitud[] = [
  { id: 1, productoId: 1, productorId: 1, compradorId: 1, cantidad: 50, subtotal: 160000, estado: 'aceptada', fecha: '2025-10-28' },
  { id: 2, productoId: 3, productorId: 2, compradorId: 1, cantidad: 10, subtotal: 78000, estado: 'pendiente', fecha: '2025-11-01' },
  { id: 3, productoId: 6, productorId: 5, compradorId: 1, cantidad: 20, subtotal: 104000, estado: 'finalizada', fecha: '2025-10-15' },
  { id: 4, productoId: 2, productorId: 3, compradorId: 1, cantidad: 30, subtotal: 135000, estado: 'rechazada', fecha: '2025-10-20' },
];
