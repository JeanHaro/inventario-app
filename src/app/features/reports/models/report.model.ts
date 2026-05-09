import { Categoria, Producto } from "../../products/models/products.model";

export interface InventoryStats {
  totalProductos: number;
  totalDisponibles: number;
  totalAgotados: number;
  totalDescontinuados: number;
  masCaros: Producto;
  masBarato: Producto;
  valorTotalInventario: number;
  precioPromedio: number;
  productosPorCategoria: Partial<Record<Categoria, number>>;
}

export interface InventoryReport {
  id: number;
  titulo: string;
  generadoEn: string;
  stats: InventoryStats;
  filtrosActivos: string[];
}

export type StatsFn = ( products: Producto[] ) => number;
