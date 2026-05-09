import { Component, output } from '@angular/core';

// Modelos
import {
  CATEGORIAS_LIST,
  EstadoProducto,
  Producto
} from '../../models/products.model';

@Component({
  selector: 'app-products-form',
  standalone: false,
  templateUrl: './products-form.html',
  styleUrl: './products-form.scss',
})
export class ProductsForm {
  // Propiedades
  categorias: string[] = Object.values(CATEGORIAS_LIST);
  nuevoProducto: Partial<Producto> = {
    categoria: 'electronica',
  };

  productoCreado = output<Producto>();
  cancelar = output<void>();

  guardarProducto(): void {
    // Validaciones básicas
    if (!this.nuevoProducto.nombre?.trim()) return;
    if (!this.nuevoProducto.precio || this.nuevoProducto.precio <= 0) return;
    if (!this.nuevoProducto.categoria) return;

    // Crear el producto completo
    const producto: Producto = {
      id: Date.now(), // ID único basado en timestamp
      nombre: this.nuevoProducto.nombre!,
      precio: this.nuevoProducto.precio!,
      categoria: this.nuevoProducto.categoria!,
      estado: 'disponible',
      variantes: [],
      descripcion: this.nuevoProducto.descripcion ?? '',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };

    this.productoCreado.emit(producto);
  }

  cancelarForm(): void {
    this.nuevoProducto = {
      categoria: 'electronica',
    };

    this.cancelar.emit();
  }
}
