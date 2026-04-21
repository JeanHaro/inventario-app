import { Producto } from "../../products/models/products.model";

export interface InventoryStats {
  totalProducts: number;
  totalAvailable: number;
  totalOutOfStock: number;
  totalDiscontinued: number;
  mostExpensive: Producto;
  cheapest: Producto;
  totalValue: number;
  averagePrice: number;
}

export interface InventoryReport {
  id: number;
  title: string;
  generatedAt: string;
  stats: InventoryStats;
  activeFilters: string[];
}

export type StatsFn = ( products: Producto[] ) => number;
