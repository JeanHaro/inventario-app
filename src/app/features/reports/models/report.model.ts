import { Category, Product } from "../../products/models/products.model";

export interface InventoryStats {
  totalProductos: number;
  totalDisponibles: number;
  totalAgotados: number;
  totalDescontinuados: number;
  masCaros: Product;
  masBarato: Product;
  valorTotalInventario: number;
  precioPromedio: number;
  productosPorCategoria: Partial<Record<Category, number>>;
}

export interface InventoryReport {
  id: number;
  titulo: string;
  generadoEn: string;
  stats: InventoryStats;
  filtrosActivos: string[];
}

export type StatsFn = ( products: Product[] ) => number;
