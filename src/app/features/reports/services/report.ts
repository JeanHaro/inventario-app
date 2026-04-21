import { Injectable } from '@angular/core';

// Modelos
import {
  EstadoProducto,
  Producto
} from '../../products/models/products.model';
import { InventoryReport, InventoryStats } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  // =============================
  //  Funciones de estadísticas
  // =============================

  // Cuenta productos por uno o más estados - REST params
  countByState ( products: Producto[], ...states: EstadoProducto[] ): number {
    return products.filter( p => states.includes(p.estado) ).length;
  }

  // Suma precio x stock total de todas las variantes de todos los productos
  getTotalValue ( products: Producto[] ): number {
    return products.reduce( (total, product) => {
        // Suma el stock total de todas las variantes del producto
        const stockTotal = product.variantes.reduce(
          (stock, variante) => stock + variante[2],
          0
        );

        return total + (product.precio * stockTotal)
      }, 0 );
  }

  // Promedio de precios
  getAveragePrice ( products: Producto[] ): number {
    if (products.length === 0) return 0;

    const totalPrice = products.reduce( (total, product) => total + product.precio, 0 );

    return totalPrice / products.length;
  }

  // El producto más caro
  getMostExpensive ( products: Producto[] ): Producto {
    if (products.length === 0) throw new Error('No hay productos para analizar');

    return products.reduce(
      (expensive, product) =>
        product.precio > expensive.precio
          ? product
          : expensive,
      products[0]
    );
  }

  // El producto más barato
  getCheapest ( products: Producto[] ): Producto {
    if (products.length === 0) throw new Error('No hay productos para analizar');

    return products.reduce(
      (cheapest, product) =>
        product.precio < cheapest.precio
          ? product
          : cheapest,
      products[0]
    );
  }

  // =============================
  //  Función integradora
  // =============================

  // Genera el objeto InventoryStats completo llamando a los métodos anteriores
  generateStats ( products: Producto[] ): InventoryStats {
    return {
      totalProducts: products.length,
      totalAvailable: this.countByState(products, EstadoProducto.Disponible),
      totalOutOfStock: this.countByState(products, EstadoProducto.Agotado),
      totalDiscontinued: this.countByState(products, EstadoProducto.Descontinuado),
      mostExpensive: this.getMostExpensive(products),
      cheapest: this.getCheapest(products),
      totalValue: this.getTotalValue(products),
      averagePrice: this.getAveragePrice(products)
    }
  }

  // =============================
  //  CRUD de Reportes Guardados
  // =============================
  private reports: InventoryReport[] = [];

  // Guardar un nuevo reporte
  saveReport ( title: string, stats: InventoryStats, ...filters: string[] ): void {
    const nextId =
      this.reports.length === 0
        ? 1
        : Math.max(...this.reports.map( r => r.id )) + 1;

    const newReport: InventoryReport = {
      id: nextId,
      title,
      generatedAt: new Date().toLocaleDateString(),
      stats,
      activeFilters: filters
    };

    this.reports.push(newReport);
  }

  // Obtener reportes
  getReports(): InventoryReport[] {
    return this.reports;
  }

  // Eliminar un reporte
  deleteReport ( id: number ): void {
    const index = this.reports.findIndex( report => report.id === id);

    if (index === -1) throw new Error(`Producto con ID ${id} no encontrado`);

    this.reports.splice(index, 1);
  }
}
