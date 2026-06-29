import { Component, computed, input, model, output, signal } from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faCheck,
  faArrowUpShortWide,
  faPenToSquare,
  faLayerGroup,
  faChevronDown,
  faEllipsisVertical,
  faBoxesStacked,
  faMinus,
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';

// Modelos
import {
  Product,
  SortDirection,
  SortField,
  SortState,
  type VariantPanel,
  VariantRef
} from '../../models/products.model';

type StateCheckbox = 'vacio' | 'todos' | 'parcial' | 'ninguno';

@Component({
  selector: 'products-table',
  standalone: false,
  templateUrl: './products-table.html',
  styleUrl: './products-table.scss',
})
export class ProductsTable {

  // TODO: ICONOS
  readonly faMinus: IconDefinition = faMinus;
  readonly faCheck: IconDefinition = faCheck;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faLayerGroup: IconDefinition = faLayerGroup;
  readonly faChevronDown: IconDefinition = faChevronDown;
  readonly faEllipsisVertical: IconDefinition = faEllipsisVertical;
  readonly faBoxesStacked: IconDefinition = faBoxesStacked;
  readonly faSort:   IconDefinition = faSort;
  readonly faSortUp: IconDefinition = faSortUp;
  readonly faSortDown: IconDefinition = faSortDown;
  readonly faArrowUpShortWide: IconDefinition = faArrowUpShortWide;

  // TODO: INPUT, OUTPUT Y MODEL
  // Signals internos de la tabla
  expandedProduct = signal<number | null>(null);
  sortState = signal<SortState>({ field: null, direction: 'none' });

  // Models
  // Estos models, sirve si quieres que el valor fluya en ambas direcciones sin lógica adicional (sin logica adicional significa que en el padre no debe estar en un método ejecutando otros valores, solo un valor específico)
  readonly variantPanel = model<VariantPanel | null>(null);

  // Inputs — datos que vienen del padre
  readonly products = input.required<Product[]>();
  readonly selectedProducts = input.required<Set<number>>();

  // Outputs — eventos que sube al padre
  readonly selectionToggled = output<number>();
  readonly allToggled = output<void>();
  readonly productKebab = output<number>();
  readonly variantKebab = output<VariantRef>();
  readonly selectionCleared = output<void>();
  readonly editProduct = output<number>(); // PARAMS: EDITAR PRODUCTO
  readonly editVariant = output<VariantRef>();

  // TODO: COMPUTED
  // =================================================== SELECCIONAR CHECKBOX

  // Obtener la cantidad de todos los productos seleccionados
  readonly totalSelected = computed<number>(() =>
    this.selectedProducts().size
  );

  // Condicion del estado del checkbox
  readonly checkboxState = computed<StateCheckbox>(() => {
    const total    = this.totalSelected();
    const visibles = this.products().length;

    if ( visibles === 0 )     return 'vacio';
    if ( total === visibles ) return 'todos';
    if ( total > 0 )          return 'parcial';
    return 'ninguno';
  });

  // ========================================================== ORDENAMIENTO

  // Productos ordenados según el estado del sort
  readonly sortedProducts = computed<Product[]>( () => {
    const lista = [...this.products()]; // Para no mutar el signal de producto
    const { field, direction } = this.sortState();

    // Sin ordenamiento activo devolvemos como vienen
    if ( !field || direction === 'none' ) return lista;

    return lista.sort( (a, b) => {
      let valA: string | number;
      let valB: string | number;

      // Variantes se ordena por cantidad
      if ( field === 'variantes' ) {
        valA = a.variantes.length;
        valB = b.variantes.length;
      } else {
        // Campos opcionales como marca y descuento pueden ser undefined
        valA = ( a[field] as string | number ) ?? '';
        valB = ( b[field] as string | number ) ?? '';
      }

      // Si son numéricos
      if ( typeof valA === 'number' && typeof valB === 'number' ) {
        // Si la dirección es asc entonces valA - valB, sino valB - valA
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      // Si son strings
      // localeCompare es para ordenar coorrectamente en español, compara ambos string en español
      const cmp = String(valA).localeCompare(String(valB), 'es');
      return direction === 'asc' ? cmp : -cmp;
    })
  })

  // TODO: MÉTODOS PÚBLICOS
  // ====================================================== COLAPSAR VARIANTES

  // Mostrar variantes
  toggleVariants ( id: number ): void {
    const producto = this.products()
      .filter( p => p.id === id )
      .find( p => p.variantes.length > 0 );

    if ( !producto ) return;

    this.variantPanel.set(null);

    const actual = this.expandedProduct();
    this.expandedProduct.set( actual === id ? null : id );
  }

  // =================================================== SELECCIONAR CHECKBOX

  // Identificar si el producto esta seleccionado
  isSelected ( id: number ): boolean {
    return this.selectedProducts().has(id);
  }

  // Seleccionar todas — avisa al padre para que ejecute la lógica
  selectAll(): void {
    this.allToggled.emit();
  }

  // Añadir o sacar productos de la selección — avisa al padre con el id
  toggleSelection ( id: number ): void {
    this.selectionToggled.emit(id);
  }

  // ========================================================= PRODUCTO KEBAB

  // Mostrar Kebab por producto — cierra panel de variante y avisa al padre
  toggleProductKebab ( id: number ): void {
    this.variantPanel.set(null);
    this.productKebab.emit(id);
  }

  // ========================================================= VARIANTE KEBABS

  // Mostrar Kebab por variante
  toggleVariantKebab ( id: number, productoId: number ): void {
    this.selectionCleared.emit();
    this.variantKebab.emit({ productoId, varianteId: id });

    const actual = this.variantPanel();
    const yaAbierto = actual?.tipo === 'kebab' && actual?.id === id;

    this.variantPanel.set( yaAbierto ? null : { tipo: 'kebab', id, productoId } );
  }

  // Mostrar el panel de stock de variante
  openVariantStock ( id: number, productoId: number ): void {
    this.selectionCleared.emit();
    this.variantKebab.emit({ productoId, varianteId: id });

    const actual = this.variantPanel();
    const yaAbierto = actual?.tipo === 'stock' && actual?.id === id;

    this.variantPanel.set( yaAbierto ? null : { tipo: 'stock', id, productoId } );
  }

  // ========================================================== ORDENAMIENTO

  // Ciclar entre los 3 estados de ordenamiento: none -> asc -> desc -> none
  changeSort ( field: SortField ): void {
    const actual = this.sortState();

    // Si es una columna distinta, lo empezamos en asc
    if ( actual.field !== field ) {
      this.sortState.set({ field, direction: 'asc' });
      return;
    }

    // Si es la misma columna, cambiamos al siguiente estado del ciclo
    const ciclo: Record<SortDirection, SortDirection> = {
      none: 'asc',
      asc: 'desc',
      desc: 'none'
    }

    // Acción para pasar al siguiente ciclo
    const siguienteDir = ciclo[actual.direction];

    this.sortState.set({
      field: siguienteDir === 'none' ? null : field, // Si es none entonces regresamos null, para que los productos se ordenen como estaban por defecto
      direction: siguienteDir
    })
  }

  // Obtener el icono correcto según el campo y la dirección
  sortIcon ( field: SortField ): IconDefinition {
    const { field: campoActual, direction } = this.sortState();

    if ( campoActual !== field || direction === 'none' ) return this.faSort;
    return direction === 'asc' ? this.faSortUp : this.faSortDown;
  }

}

