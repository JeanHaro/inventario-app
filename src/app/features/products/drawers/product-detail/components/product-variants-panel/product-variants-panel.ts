
import { Component, computed, input, signal } from '@angular/core';

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
  Producto,
  Variante,
  EstadoVariante
} from '../../../../models/products.model';
import { SelectOption } from './../../../../../../shared/components/select/models/select.model';

type Fields = 'nombre' | 'stock' | 'precioAdicional' | 'estado';


@Component({
  selector: 'app-product-variants-panel',
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

  // TODO: INPUT, recibe el nombre completo
  readonly producto = input.required<Producto>();

  // TODO: PROPIEDADES
  // Opciones de los selects
  readonly filtroOptions: SelectOption[] = [
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

  readonly ordenOptions: SelectOption[] = [
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
  filterState = signal<EstadoVariante | 'todos'>('todos');
  sortField   = signal<Fields | 'defecto'>('defecto');

  // TODO: COMPUTED
  // ================================================== CAMBIAR ESTADO POR FILTRO

  // Filtrar variantes por estado
  readonly variantesPorEstado = computed<Variante[]>(() => {
    if ( this.filterState() === 'todos' ) return this.producto().variantes;

    return this.producto().variantes.filter(
      variante => variante.estado === this.filterState()
    );
  });

  // ========================================================== ORDENAMIENTO

  // Ordenar las variantes ya filtradas
  readonly variantesOrdenadas = computed<Variante[]>(() => {
    const lista = [ ...this.variantesPorEstado() ];
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

  seleccionarFiltro ( valor: string ): void {
    this.filterState.set( valor as EstadoVariante | 'todos' );
  }
  // ========================================================== ORDENAMIENTO

  seleccionarOrdenamiento ( valor: string ): void {
    this.sortField.set( valor as Fields );
  }
}
