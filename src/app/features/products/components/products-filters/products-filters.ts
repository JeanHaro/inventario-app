import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faTableCellsLarge,
  faBan,
} from '@fortawesome/free-solid-svg-icons';

import {
  faCheckCircle,
  faCircleXmark,
  faBookmark,
  faCalendarDays,
  faCirclePause,
} from '@fortawesome/free-regular-svg-icons';

// Interfaces
import {
  EstadoProducto,
  Producto
} from '../../models/products.model';

@Component({
  selector: 'app-product-filters',
  standalone: false,
  templateUrl: './products-filters.html',
  styleUrl: './products-filters.scss',
})
export class ProductsFilters {
  // TODO: viewChild
  readonly productFiltersContent = viewChild<ElementRef<HTMLElement>>('productFiltersRef');

  // TODO: ICONOS
  readonly faTableCellsLarge: IconDefinition = faTableCellsLarge;
  readonly faCheckCircle: IconDefinition = faCheckCircle;
  readonly faCircleXmark: IconDefinition = faCircleXmark;
  readonly faBookmark: IconDefinition = faBookmark;
  readonly faCalendarDays: IconDefinition = faCalendarDays;
  readonly faBan: IconDefinition = faBan;
  readonly faCirclePause: IconDefinition = faCirclePause;

  // TODO: PROPIEDADES
  // Inputs
  readonly productos = input.required<Producto[]>();
  readonly estadoActivo = input<EstadoProducto | 'Todas'>('Todas'); // Recibimos del padre cual filtro esta activo
  // Output
  readonly estadoCambiado = output<EstadoProducto | 'Todas'>(); // Avisamos al padre que estado seleccionamos

  // TODO: COMPUTED
  // Contar la cantidad de productos por estado
  readonly conteosPorEstado = computed(() => {
    return this.productos().reduce(
      ( accumulator , producto ) => {
        accumulator[producto.estado] = ( accumulator[producto.estado] ?? 0 ) + 1;

        return accumulator;
      },
      {} as Partial<Record<EstadoProducto, number>>
    )
  });

  // TODO: MÉTODOS
  // Cambiar el valor del estado seleccionado
  seleccionarEstado ( event: MouseEvent, estado: EstadoProducto | 'Todas' ): void {
    // Emitimos el cambio de estado
    this.estadoCambiado.emit(estado);

    // 2. Centrar el botón clickeado en el scroll (Solo el contenedor de los filtros)
    const container = this.productFiltersContent()!.nativeElement;
    const btn = event.currentTarget as HTMLElement;
    // Posición del botón relativa al contenedor
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const containerWidth = container.offsetWidth;
    // Para centrar
    const scrollTarget = btnLeft - ( containerWidth / 2 ) + ( btnWidth / 2 );

    container.scrollTo({
      left: scrollTarget,
      behavior: 'smooth'
    })
  }
}
