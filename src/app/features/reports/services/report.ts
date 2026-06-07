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
          (stock, variante) => stock + variante.stock,
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
  getMostExpensive ( products: Producto[] ): Producto | null {
    if (products.length === 0) return null;

    return products.reduce(
      (expensive, product) =>
        product.precio > expensive.precio
          ? product
          : expensive,
      products[0]
    );
  }

  // El producto más barato
  getCheapest ( products: Producto[] ): Producto | null {
    if (products.length === 0) return null;

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
      totalProductos: products.length,
      totalDisponibles: this.countByState(products, 'disponible'),
      totalAgotados: this.countByState(products, 'agotado'),
      totalDescontinuados: this.countByState(products, 'descontinuado'),
      masCaros: this.getMostExpensive(products)!,
      masBarato: this.getCheapest(products)!,
      valorTotalInventario: this.getTotalValue(products),
      precioPromedio: this.getAveragePrice(products),
      productosPorCategoria: { 'electronica': 1 }
    }
  }

  // =============================
  //  CRUD de Reportes Guardados
  // =============================
  private reports: InventoryReport[] = [];

  // Guardar un nuevo reporte
  saveReport ( titulo: string, stats: InventoryStats, ...filters: string[] ): void {
    const nextId =
      this.reports.length === 0
        ? 1
        : Math.max(...this.reports.map( r => r.id )) + 1;

    const newReport: InventoryReport = {
      id: nextId,
      titulo,
      generadoEn: new Date().toLocaleDateString(),
      stats,
      filtrosActivos: filters
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
