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
  faMinus
} from '@fortawesome/free-solid-svg-icons';

// Modelos
import {
  Producto,
  type VariantePanel
} from '../../models/products.model';

type StateCheckbox = 'vacio' | 'todos' | 'parcial' | 'ninguno';

@Component({
  selector: 'app-products-table',
  standalone: false,
  templateUrl: './products-table.html',
  styleUrl: './products-table.scss',
})
export class ProductsTable {

  // TODO: ICONOS
  readonly faMinus: IconDefinition = faMinus;
  readonly faCheck: IconDefinition = faCheck;
  readonly faArrowUpShortWide: IconDefinition = faArrowUpShortWide;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faLayerGroup: IconDefinition = faLayerGroup;
  readonly faChevronDown: IconDefinition = faChevronDown;
  readonly faEllipsisVertical: IconDefinition = faEllipsisVertical;
  readonly faBoxesStacked: IconDefinition = faBoxesStacked;

  // TODO: PROPIEDADES
  // Signals internos de la tabla
  productoExpandido = signal<number | null>(null);

  // Models
  // Estos models, sirve si quieres que el valor fluya en ambas direcciones sin lógica adicional (sin logica adicional significa que en el padre no debe estar en un método ejecutando otros valores, solo un valor específico)
  readonly variantePanel = model<VariantePanel | null>(null);

  // Inputs — datos que vienen del padre
  readonly productos = input.required<Producto[]>();
  readonly productosSeleccionados = input.required<Set<number>>();

  // Outputs — eventos que sube al padre
  readonly seleccionToggled = output<number>();
  readonly todasToggled = output<void>();
  readonly kebabProducto = output<number>();
  readonly seleccionLimpiada = output<void>();

  // TODO: COMPUTED
  // Obtener la cantidad de todos los productos seleccionados
  readonly totalSeleccionados = computed<number>(() =>
    this.productosSeleccionados().size
  );

  // Condicion del estado del checkbox
  readonly checkboxEstado = computed<StateCheckbox>(() => {
    const total    = this.totalSeleccionados();
    const visibles = this.productos().length;

    if ( visibles === 0 )     return 'vacio';
    if ( total === visibles ) return 'todos';
    if ( total > 0 )          return 'parcial';
    return 'ninguno';
  });

  // TODO: MÉTODOS
  // Identificar si el producto esta seleccionado
  estaSeleccionado ( id: number ): boolean {
    return this.productosSeleccionados().has(id);
  }

  // Seleccionar todas — avisa al padre para que ejecute la lógica
  seleccionarTodas(): void {
    this.todasToggled.emit();
  }

  // Añadir o sacar productos de la selección — avisa al padre con el id
  toggleSeleccion ( id: number ): void {
    this.seleccionToggled.emit(id);
  }

  // Mostrar Kebab por producto — cierra panel de variante y avisa al padre
  toggleKebabProducto ( id: number ): void {
    this.variantePanel.set(null);
    this.kebabProducto.emit(id);
  }

  // Mostrar variantes
  toggleVariantes ( id: number ): void {
    const producto = this.productos()
      .filter( p => p.id === id )
      .find( p => p.variantes.length > 0 );

    if ( !producto ) return;

    this.variantePanel.set(null);

    const actual = this.productoExpandido();
    this.productoExpandido.set( actual === id ? null : id );
  }

  // Mostrar Kebab por variante
  toggleKebabVariante ( id: number, productoId: number ): void {
    this.seleccionLimpiada.emit();

    const actual    = this.variantePanel();
    const yaAbierto = actual?.tipo === 'kebab' && actual?.id === id;

    this.variantePanel.set( yaAbierto ? null : { tipo: 'kebab', id, productoId } );
  }

  // Mostrar el panel de stock de variante
  abrirStockVariante ( id: number, productoId: number ): void {
    this.seleccionLimpiada.emit();

    const actual    = this.variantePanel();
    const yaAbierto = actual?.tipo === 'stock' && actual?.id === id;

    this.variantePanel.set( yaAbierto ? null : { tipo: 'stock', id, productoId } );
  }
}
