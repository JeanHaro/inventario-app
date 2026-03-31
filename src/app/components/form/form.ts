import { Component, output } from '@angular/core';
import {
  Categoria,
  EstadoProducto,
  Producto
} from '../../models/producto.model';

@Component({
  selector: 'app-dashboard-form',
  standalone: false,
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  // Propiedades
  categorias: string[] = Object.values(Categoria);
  nuevoProducto: Partial<Producto> = {
    categoria: Categoria.Electronica,
  };

  Categoria = Categoria;

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
      estado: EstadoProducto.Disponible,
      disponible: true,
      variantes: [],
      descripcion: this.nuevoProducto.descripcion ?? ''
    };

    this.productoCreado.emit(producto);
  }

  cancelarForm(): void {
    this.nuevoProducto = {
      categoria: Categoria.Electronica,
    };

    this.cancelar.emit();
  }
}
