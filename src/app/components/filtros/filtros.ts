import { Component, input,  output } from '@angular/core';

import { Categoria, Producto } from '../../models/producto.model';

@Component({
  selector: 'app-dashboard-filtros',
  standalone: false,
  templateUrl: './filtros.html',
  styleUrl: './filtros.scss',
})
export class Filtros {
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
