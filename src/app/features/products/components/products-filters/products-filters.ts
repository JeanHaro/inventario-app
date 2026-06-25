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
  ProductState,
  Product
} from '../../models/products.model';

@Component({
  selector: 'products-filters',
  standalone: false,
  templateUrl: './products-filters.html',
  styleUrl: './products-filters.scss',
})
export class ProductsFilters {
  // TODO: VIEWCHILD
  readonly filtersContainerRef = viewChild<ElementRef<HTMLElement>>('productFiltersRef');

  // TODO: ICONOS
  readonly faTableCellsLarge: IconDefinition = faTableCellsLarge;
  readonly faCheckCircle: IconDefinition = faCheckCircle;
  readonly faCircleXmark: IconDefinition = faCircleXmark;
  readonly faBookmark: IconDefinition = faBookmark;
  readonly faCalendarDays: IconDefinition = faCalendarDays;
  readonly faBan: IconDefinition = faBan;
  readonly faCirclePause: IconDefinition = faCirclePause;

  // TODO: INPUT Y OUTPUT
  // Inputs
  readonly products = input.required<Product[]>();
  readonly activeState = input<ProductState | 'Todas'>('Todas'); // Recibimos del padre cual filtro esta activo
  // Output
  readonly stateChanged = output<ProductState | 'Todas'>(); // Avisamos al padre que estado seleccionamos

  // TODO: COMPUTED
  // Contar la cantidad de productos por estado
  readonly countsByState = computed(() => {
    return this.products().reduce(
      ( accumulator , producto ) => {
        accumulator[producto.estado] = ( accumulator[producto.estado] ?? 0 ) + 1;

        return accumulator;
      },
      {} as Partial<Record<ProductState, number>>
    )
  });

  // TODO: MÉTODOS PÚBLICOS
  // Cambiar el valor del estado seleccionado
  selectState ( event: MouseEvent, estado: ProductState | 'Todas' ): void {
    // Emitimos el cambio de estado
    this.stateChanged.emit(estado);

    // 2. Centrar el botón clickeado en el scroll (Solo el contenedor de los filtros)
    const container = this.filtersContainerRef()!.nativeElement;
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
