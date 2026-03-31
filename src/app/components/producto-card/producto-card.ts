import { Component, input, output } from '@angular/core';

// Modelos
import {
  EstadoProducto,
  Producto
} from '../../models/producto.model';

@Component({
  selector: 'app-dashboard-producto-card',
  standalone: false,
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.scss',
})
export class ProductoCard {
  // Propiedades
  producto = input.required<Producto>();
  estadoChange = output<{ id: number, evento: Event }>();
  eliminar = output<number>();

  // Exponemos el enum al template, ya que Angular no puede acceder a enums directamente
    EstadoProducto = EstadoProducto;

  // Getter para clases dinámicas basadas en el estado del producto
  get estadoClass(): string {
    const clases: Record<EstadoProducto, string> = {
      [EstadoProducto.Disponible]    : 'card--disponible',
      [EstadoProducto.Agotado]       : 'card--agotado',
      [EstadoProducto.Descontinuado] : 'card--descontinuado'
    };
    return clases[this.producto().estado];
  }

  // Helper para el badge del estado
  obtenerEtiquetaEstado ( estado: EstadoProducto ): string {
    const etiquetas: Record<EstadoProducto, string> = {
      [EstadoProducto.Disponible] : 'Disponible',
      [EstadoProducto.Agotado] : 'Agotado',
      [EstadoProducto.Descontinuado] : 'Descontinuado'
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
