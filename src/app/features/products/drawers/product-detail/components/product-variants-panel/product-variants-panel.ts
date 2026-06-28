
import { Component, computed, input, output, signal } from '@angular/core';

// FontAwesome
import {
  IconDefinition,
  faFilter,
  faArrowDownShortWide,
  faPlus,
  faPenToSquare,
  faEye
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import {
  Product,
  Variant,
  VariantState
} from '../../../../models/products.model';
import { SelectOption } from './../../../../../../shared/components/select/models/select.model';

type Fields = 'nombre' | 'stock' | 'precioAdicional' | 'estado';


@Component({
  selector: 'product-variants-panel',
  standalone: false,
  templateUrl: './product-variants-panel.html',
  styleUrl: './product-variants-panel.scss',
})
export class ProductVariantsPanel {
  // TODO: ICONOS
  readonly faFilter: IconDefinition = faFilter;
  readonly faArrowDownShortWide: IconDefinition = faArrowDownShortWide;
  readonly faPlus: IconDefinition = faPlus;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faEye: IconDefinition = faEye;

  // TODO: INPUT Y OUTPUT
  readonly product = input.required<Product>();
  readonly viewVariant = output<number>();

  // TODO: PROPIEDADES
  // Opciones de los selects
  readonly filterOptions: SelectOption[] = [
    {
      value: 'todos',
      label: 'Todos'
    },
    {
      value: 'disponible',
      label: 'Disponible',
      badgeClass: 'badge--disponible' },
    {
      value: 'sin_stock',
      label: 'Sin stock',
      badgeClass: 'badge--sin_stock'
    },
    {
      value: 'reservado',
      label: 'Reservado',
      badgeClass: 'badge--reservado'
    },
    {
      value: 'descontinuado',
      label: 'Descontinuado',
      badgeClass: 'badge--descontinuado'
    },
  ];

  readonly sortOptions: SelectOption[] = [
    {
      value: 'defecto',
      label: 'Defecto'
    },
    {
      value: 'nombre',
      label: 'Nombre'
    },
    {
      value: 'stock',
      label: 'Stock'
    },
    {
      value: 'precioAdicional',
      label: 'Precio'
    },
    {
      value: 'estado',
      label: 'Estado'
    },
  ];

  // TODO: SIGNALS
  filterState = signal<VariantState | 'todos'>('todos');
  sortField   = signal<Fields | 'defecto'>('defecto');

  // TODO: COMPUTED
  // ================================================== CAMBIAR ESTADO POR FILTRO

  // Filtrar variantes por estado
  readonly variantsByState = computed<Variant[]>(() => {
    if ( this.filterState() === 'todos' ) return this.product().variantes;

    return this.product().variantes.filter(
      variante => variante.estado === this.filterState()
    );
  });

  // ========================================================== ORDENAMIENTO

  // Ordenar las variantes ya filtradas
  readonly sortedVariants = computed<Variant[]>(() => {
    const lista = [ ...this.variantsByState() ];
    const field = this.sortField() as Fields;

    if ( this.sortField() === 'defecto' ) return lista;

    return lista.sort(( a, b ) => {
      const valA: string | number = ( a[field] as string | number ) ?? '';
      const valB: string | number = ( b[field] as string | number ) ?? '';

      if ( typeof valA === 'number' && typeof valB === 'number' ) {
        return valA - valB;
      }

      return String(valA).localeCompare( String(valB), 'es' );
    });
  });

  // TODO: MÉTODOS PÚBLICOS
  // ================================================== CAMBIAR ESTADO POR FILTRO

  selectFilter ( valor: string ): void {
    this.filterState.set( valor as VariantState | 'todos' );
  }
  // ========================================================== ORDENAMIENTO

  selectSort ( valor: string ): void {
    this.sortField.set( valor as Fields );
  }
}
