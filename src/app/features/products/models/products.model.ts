// LISTA DE CATEGORIAS
export const CATEGORIAS_LIST = [
  'electronica',
  'tecnologia',
  'ropa',
  'calzado',
  'alimentos',
  'bebidas',
  'hogar',
  'muebles',
  'deportes',
  'belleza',
  'juguetes',
  'libros',
  'vehiculos',
  'herramientas',
  'otros'
] as const;

// LISTA DE ESTADOS DE PRODUCTO
export const  ESTADOS_PRODUCTO =[
  'disponible',             // en venta y con stock
  'agotado',                // sin stock pero sigue activo
  'reservado',              // apartado, no disponible para venta libre
  'proximamente',           // pre-lanzamiento, aún no se vende
  'descontinuado',          // ya no se vende, fuera del catálogo
  'pausado'                 // temporalmente fuera de venta
] as const;

// LISTA DE ESTADOS DE VARIANTES
export const  ESTADOS_VARIANTE =[
  'disponible',
  'sin_stock',
  'reservado',
  'descontinuado',
] as const;

// Extraemos el tipo (autocompletado y validación)
export type Categoria = ( typeof CATEGORIAS_LIST )[number];
export type EstadoProducto = ( typeof ESTADOS_PRODUCTO )[number];
export type EstadoVariante = ( typeof ESTADOS_VARIANTE )[number];

// Interface para las variantes
export interface Variante {
  id: number;
  nombre?: string;            // ej: "128GB", "Pack x3", "Talla grande"
  talla?: string;             // ej: "M", "L", "XL", "42", "N/A"
  color?: string;             // ej: "Negro", "Blanco", "N/A"
  capacidad?: string;         // ej: "10kg", "256GB", "2L"
  stock: number;
  estado: EstadoVariante;
  sku?: string;               // código único: "XIA14-NEG-128"
  precioAdicional?: number;   // precio extra sobre el base (ej: +50 por la variante Pro Max)
  imagen?: string;
}

// Interface para el Producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  marca?: string;         // ej: "Apple", "Samsung", "Mabe"
  modelo?: string;        // ej: "iPhone 15", "Lavadora LT12"
  precio: number;         // precio base
  descuento?: number;     // porcentaje 0-100
  categoria: Categoria;
  estado: EstadoProducto;
  variantes: Variante[];
  imagenes?: string[];    // URLs de imágenes
  etiquetas?: string[];   // ej: ["nuevo", "oferta", "destacado"]
  creadoEn: string;       // ISO date string
  actualizadoEn: string;
}

