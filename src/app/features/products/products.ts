import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faTableCellsLarge,
  faBan,
  faMagnifyingGlass,
  faPlus,
  faCheck,
  faArrowUpShortWide,
  faPenToSquare,
  faLayerGroup,
  faChevronDown,
  faEllipsisVertical,
  faBoxArchive,
  faBoxesStacked,
  faClockRotateLeft,
  faBarcode,
  faXmark,
  faFloppyDisk,
  faMinus
} from '@fortawesome/free-solid-svg-icons';

import {
  faCheckCircle,
  faCircleXmark,
  faBookmark,
  faCalendarDays,
  faCirclePause,
  faEye
} from '@fortawesome/free-regular-svg-icons';

// Modelos
import {
  EstadoProducto,
  Producto
} from './models/products.model';

// Servicios
import { InventarioService } from './services/inventario';

type VariantePanel = {
  tipo: 'kebab' | 'stock',
  id: number,
  productoId: number;
};

type StateCheckbox = 'vacio' | 'todos' | 'parcial' | 'ninguno';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  // Inyecciones
  private inventarioService = inject(InventarioService);

  // TODO: Iconos
  readonly faTableCellsLarge: IconDefinition = faTableCellsLarge;
  readonly faCheckCircle: IconDefinition = faCheckCircle;
  readonly faCircleXmark: IconDefinition = faCircleXmark;
  readonly faBookmark: IconDefinition = faBookmark;
  readonly faCalendarDays: IconDefinition = faCalendarDays;
  readonly faBan: IconDefinition = faBan;
  readonly faCirclePause: IconDefinition = faCirclePause;
  readonly faPlus: IconDefinition = faPlus;
  readonly faMagnifyingGlass: IconDefinition = faMagnifyingGlass;
  readonly faCheck: IconDefinition = faCheck;
  readonly faArrowUpShortWide: IconDefinition = faArrowUpShortWide;
  readonly faChevronDown: IconDefinition = faChevronDown;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faLayerGroup: IconDefinition = faLayerGroup;
  readonly faEllipsisVertical: IconDefinition = faEllipsisVertical;
  readonly faEye: IconDefinition = faEye;
  readonly faBoxArchive:IconDefinition = faBoxArchive;
  readonly faBoxesStacked: IconDefinition = faBoxesStacked;
  readonly faClockRotateLeft: IconDefinition = faClockRotateLeft;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faXmark: IconDefinition = faXmark;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;
  readonly faMinus: IconDefinition = faMinus;

  // TODO: Propiedades
  productos = signal<Producto[]>([]);
  productoExpandido = signal<number | null>(null);
  variantePanel = signal<VariantePanel | null>(null);
  productosSeleccionados = signal<Set<number>>(new Set());
  estadoSeleccionado = signal<EstadoProducto | 'Todas'>('Todas');

  constructor () {}

  ngOnInit(): void {
    this.inventarioService.obtenerProductos().subscribe({
      next: ( resp ) => {
        this.productos.set(resp);
      },
    });
  }

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

  // Filtrar los productos por estado
  readonly productosPorEstado = computed<Producto[]>(() => {
    if ( this.estadoSeleccionado() === 'Todas' ) return this.productos();

    return this.productos().filter(
      producto => producto.estado === this.estadoSeleccionado()
    );
  });

  // Obtener la cantidad de todos los productos seleccionados
  readonly totalSeleccionados = computed<number>(() => {
    return this.productosSeleccionados().size;
  })

  // Obtedner los productos seleccionados para archivar
  readonly productosParaArchivar = computed<Producto[]>(() => {
    return this.productos().filter(
      producto => this.productosSeleccionados().has(producto.id)
    );
  });

  // Condicion del estado del checkbox
  readonly checkboxEstado = computed<StateCheckbox>(() => {
    const total = this.totalSeleccionados();
    const visibles = this.productosPorEstado().length;

    if ( visibles === 0 ) return 'vacio';
    if (total === visibles) return 'todos';
    if (total > 0) return 'parcial';

    return 'ninguno';
  });

  // TODO: MÉTODOS
  // Mostrar variantes
  toggleVariantes ( id: number ): void {
    const producto = this.productos()
                        .filter( producto => producto.id === id)
                        .find( p => p.variantes.length > 0);

    if ( !producto ) {
      return;
    }

    this.variantePanel.set(null);

    const actual = this.productoExpandido();

    this.productoExpandido.set( actual === id ? null : id );
  }

  // Mostrar Kebar por variante
  toggleKebabVariante ( id: number, productoId: number ): void {
    this.limpiarSeleccion();

    const actual = this.variantePanel();
    const yaAbierto = actual?.tipo === 'kebab' && actual?.id === id;

    this.variantePanel.set( yaAbierto ? null : { tipo: 'kebab', id, productoId } );
  }

  // Mostrar el kebab del stock
  abrirStockVariante ( id: number, productoId: number ): void {
    this.limpiarSeleccion();

    const actual = this.variantePanel();
    const yaAbierto = actual?.tipo === 'stock' && actual?.id === id;

    this.variantePanel.set(yaAbierto ? null :{ tipo: 'stock', id, productoId });
  }

  // Mostrar Kebab por producto
  toggleKebabProducto ( id: number ): void {
    this.variantePanel.set(null);

    // Si ese producto ya es el único seleccionado
    if ( this.totalSeleccionados() === 1 && this.estaSeleccionado(id) ) {
      return this.limpiarSeleccion();
    }

    // Liimpiar y seleccionar solo ese producto
    this.productosSeleccionados.set(new Set([id]));
  }

  // Añadir o sacar productos de la selección
  toggleSeleccion ( id: number ): void {
    this.variantePanel.set(null);

    const seleccionados = new Set(this.productosSeleccionados());

    seleccionados.has(id) ? seleccionados.delete(id) : seleccionados.add(id);

    this.productosSeleccionados.set(seleccionados);
  }

  // Identificar si el producto esta seleccionado
  estaSeleccionado ( id: number ): boolean {
    return this.productosSeleccionados().has(id);
  }

  // Seleccionar todas
  seleccionarTodas(): void {
    this.variantePanel.set(null);

    const seleccionados = new Set(this.productosSeleccionados());

    if ( this.totalSeleccionados() === this.productosPorEstado().length ) {
      return this.limpiarSeleccion();
    }

    this.productosPorEstado().forEach( product => seleccionados.add(product.id) );
    return this.productosSeleccionados.set(seleccionados);
  }

  // Limpiar selecciones
  limpiarSeleccion(): void {
    this.productosSeleccionados.set(new Set());
  }

  // Cambiar el valor del estado seleccionado
  estadoPorProducto ( estado: EstadoProducto | 'Todas' ): void {
    this.limpiarSeleccion();

    this.estadoSeleccionado.set(estado);
  }
}
