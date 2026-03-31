// Enum string para categorías de productos
export enum Categoria {
  Electronica = 'Electrónica',
  Ropa = 'Ropa',
  Alimentos = 'Alimentos',
  Hogar = 'Hogar',
  Deportes = 'Deportes',
}

// Enum numérico para el estado del producto
export enum EstadoProducto {
  Disponible = 1,
  Agotado,
  Descontinuado
}

// Type Alias de Tupla para Variantes de Producto
export type Variante = [
  talla: string,
  color: string,
  stock: number
]

// Interface para el Producto
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: Categoria;
  estado: EstadoProducto;
  disponible: boolean;
  variantes: Variante[];
  descripcion?: string;
}

