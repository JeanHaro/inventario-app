import { Component, input,  output } from '@angular/core';

// Modelos
import { Categoria, Producto } from '../../models/products.model';

@Component({
  selector: 'app-products-filters',
  standalone: false,
  templateUrl: './products-filters.html',
  styleUrl: './products-filters.scss',
})
export class ProductsFilters {
  // Propiedades
  categorias: string[] = Object.values(Categoria);

  productos = input<Producto[]>([]);
  categoriaChange = output<string>();
  categoriaSeleccionada: string = 'Todas'

  filtrarPorCategoria ( categoria: string ): void {
    this.categoriaSeleccionada = categoria;
    this.categoriaChange.emit(categoria);
  }
}
