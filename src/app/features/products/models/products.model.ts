// =============================================
// TODO: TIPOS PARA LOS ESTADOS Y CATEGORIAS

// LISTA DE CATEGORIAS
export const CATEGORY_LIST = [
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
export const PRODUCT_STATES =[
  'disponible',             // en venta y con stock
  'agotado',                // sin stock pero sigue activo
  'reservado',              // apartado, no disponible para venta libre
  'proximamente',           // pre-lanzamiento, aún no se vende
  'descontinuado',          // ya no se vende, fuera del catálogo
  'pausado'                 // temporalmente fuera de venta
] as const;

// LISTA DE ESTADOS DE VARIANTES
export const VARIANT_STATES =[
  'disponible',
  'sin_stock',
  'reservado',
  'descontinuado',
] as const;

// Extraemos el tipo (autocompletado y validación)
export type Category = ( typeof CATEGORY_LIST )[number];
export type ProductState = ( typeof PRODUCT_STATES )[number];
export type VariantState = ( typeof VARIANT_STATES )[number];

// ==================================================
// TODO: PARA LOS KEBAB DE VARIANTE

// Para los pop-ups de kebab de variante y el stock
export type VariantPanel = {
  tipo: 'kebab' | 'stock';
  id: number;
  productoId: number;
};

export interface VariantRef {
  productoId: number;
  varianteId: number;
}

// ==================================================
// TODO: INTERFACES

// Interface para las variantes
export interface Variant {
  id: number;
  nombre: string;            // ej: "128GB", "Pack x3", "Talla grande"
  talla?: string;             // ej: "M", "L", "XL", "42", "N/A"
  color?: string;             // ej: "Negro", "Blanco", "N/A"
  capacidad?: string;         // ej: "10kg", "256GB", "2L"
  stock: number;
  estado: VariantState;
  sku: string;               // código único: "XIA14-NEG-128"
  precioAdicional: number;   // precio extra sobre el base (ej: +50 por la variante Pro Max)
  imagen?: string;
}

// Interface para el Producto
export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  marca: string;         // ej: "Apple", "Samsung", "Mabe"
  modelo?: string;        // ej: "iPhone 15", "Lavadora LT12"
  precio: number;         // precio base
  descuento?: number;     // porcentaje 0-100
  categoria: Category;
  estado: ProductState;
  variantes: Variant[];
  imagenes?: string[];    // URLs de imágenes
  etiquetas?: string[];   // ej: ["nuevo", "oferta", "destacado"]
  creadoEn: string;       // ISO date string
  actualizadoEn: string;
}

// ==================================================
// TODO: ORDENAMIENTOS

// CAMPOS DE LA TABLA para el ordenamiento
export const FIELD_LIST = [
  'nombre',
  'marca',
  'precio',
  'descuento',
  'categoria',
  'estado',
  'variantes'
] as const;


export type SortDirection = 'asc' | 'desc' | 'none';
export type SortField = ( typeof FIELD_LIST )[number];

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}
