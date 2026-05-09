import { Component, input, output } from '@angular/core';

// Modelos
import {
  EstadoProducto,
  Producto
} from '../../models/products.model';

@Component({
  selector: 'app-products-card',
  standalone: false,
  templateUrl: './products-card.html',
  styleUrl: './products-card.scss',
})
export class ProductsCard {
  // Propiedades
  producto = input.required<Producto>();
  estadoChange = output<{ id: number, evento: Event }>();
  eliminar = output<number>();

  // Getter para clases dinámicas basadas en el estado del producto
  get estadoClass(): string {
    const clases: Record<EstadoProducto, string> = {
      ['disponible']    : 'card--disponible',
      ['agotado']       : 'card--agotado',
      ['reservado']       : 'card--agotado',
      ['proximamente']       : 'card--agotado',
      ['descontinuado'] : 'card--descontinuado',
      ['pausado'] : 'card--descontinuado',
    };
    return clases[this.producto().estado];
  }

  // Helper para el badge del estado
  obtenerEtiquetaEstado ( estado: EstadoProducto ): string {
    const etiquetas: Record<EstadoProducto, string> = {
      ['disponible'] : 'Disponible',
      ['agotado'] : 'Agotado',
      ['reservado'] : 'Reservado',
      ['proximamente'] : 'Proximamente',
      ['descontinuado'] : 'Descontinuado',
      ['pausado']: 'Pausado'
    };

    return etiquetas[estado];
  }

  // Métodos
  onEstadoChange ( evento: Event ): void {
    this.estadoChange.emit({ id: this.producto().id, evento });
  }

  onEliminar(): void {
    this.eliminar.emit(this.producto().id);
  }

}
