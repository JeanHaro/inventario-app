import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild
} from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faArrowRightFromBracket,
  faPenToSquare,
  faEllipsis,
  faFileArrowDown,
  faBoxArchive,
  faBoxOpen,
  faFilter,
  faArrowDownShortWide,
  faEye,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { EstadoProducto, EstadoVariante, Producto, Variante } from '../../models/products.model';
import { InventarioService } from '../../services/inventario';

type Tabs = 'variantes' | 'imagenes';
type Fields = 'nombre' | 'stock' | 'precioAdicional' | 'estado';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  // TODO: INYECCIONES
  private readonly inventarioService = inject(InventarioService);

  // TODO: VIEWCHILD
  readonly optionsMenuRef = viewChild<ElementRef<HTMLElement>>('optionsMenuRef');
  readonly filterOptionsRef = viewChild<ElementRef<HTMLElement>>('filterOptionsRef');
  readonly orderOptionsRef = viewChild<ElementRef<HTMLElement>>('orderOptionsRef');

  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faEllipsis: IconDefinition = faEllipsis;
  readonly faFileArrowDown: IconDefinition = faFileArrowDown;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faBoxOpen: IconDefinition = faBoxOpen;
  readonly faFilter: IconDefinition = faFilter;
  readonly faArrowDownShortWide: IconDefinition = faArrowDownShortWide;
  readonly faEye: IconDefinition = faEye;
  readonly faAngleDown: IconDefinition = faAngleDown;

  // TODO: INPUT Y OUTPUT
  readonly producto = input.required<Producto>();
  readonly cerrarModal = output<void>();
  readonly productoActualizado = output<Producto>(); // Avisamos que el producto se actualizo

  // TODO: SIGNALS
  showOptionsMenu = signal<boolean>(false);
  showFilterOptions = signal<boolean>(false);
  showOrderOptions = signal<boolean>(false);

  activeTab = signal<Tabs>('variantes');

  filterState = signal<EstadoVariante | 'todos'>('todos'); // Estados para el filtro
  sortField = signal<Fields | 'defecto'>('defecto');

  private readonly TAG_COLORS = [
    'violet', 'blue', 'green', 'orange', 'red', 'teal', 'pink', 'indigo'
  ] as const; // Paleta de colores predefinida para tags
  readonly maxTags = signal<number>(2); // Cantidad max de tags
  showAllTags = signal<boolean>(false); // Mostrar todos los tags

  // TODO: COMPUTED
  // ================================================== TAGS DE LOS PRODUCTOS

  // Tags que se muestran
  readonly tagsVisibles = computed<string[]>(() => {
    const etiquetas = this.producto().etiquetas ?? [];

    if ( this.showAllTags() ) return etiquetas; // Todos

    return etiquetas.slice(0, this.maxTags())
  })

  // Cantidad de tags que quedan ocultos
  readonly tagsRestantes = computed<number>(() => {
    const etiquetas = this.producto().etiquetas ?? [];

    if ( this.showAllTags() ) return 0; // Ya no hay restantes

    return Math.max(0, etiquetas.length - this.maxTags())
  })

  // ================================================== CAMBIAR ESTADO POR FILTRO

  // Filtrar los productos por estado
  readonly variantesPorEstado = computed<Variante[]>(() => {
    if ( this.filterState() === 'todos' ) return this.producto().variantes;

    return this.producto().variantes.filter(
      variante => variante.estado === this.filterState()
    );
  });

  // ========================================================== ORDENAMIENTO

  // Variantes ordenadas según el select
  readonly variantesOrdenadas = computed<Variante[]>(() => {
    const lista = [...this.variantesPorEstado()];
    const field = this.sortField() as Fields;

    if ( this.sortField() === 'defecto' ) return lista;

    return lista.sort((a, b) => {
      const valA: string | number = ( a[field] as string | number ) ?? '';
      const valB: string | number = ( b[field] as string | number ) ?? '';

       // Si son numéricos
      if ( typeof valA === 'number' && typeof valB === 'number' ) {
        return valA - valB;
      }

      // Si es string
      return String(valA).localeCompare(String(valB), 'es');
    })
  });

  // ========================================================== ARCHIVAR

  // Verificamos que el producto esta archivado
  readonly productoArchivado = computed<boolean>(() =>
    this.producto().estado === 'descontinuado'
  );

  // TODO: HOSTLISTENER
  // ====================================================== MOSTRAR OPCIONES

  // Escucha cualquier click en el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick ( event: Event ): void {
    // Verificación independiente del menu de opciones
    if ( this.showOptionsMenu() ) {
      const menuOptions = this.optionsMenuRef()?.nativeElement;
      // Si existe el menu y el click fue fuera de este, entonces cerramos el menu
      if ( menuOptions && !menuOptions.contains(event.target as Node) ) {
        this.showOptionsMenu.set(false);
      }
    }

    // Verificación independiente del filtro
    if ( this.showFilterOptions() ) {
      const filterOptions = this.filterOptionsRef()?.nativeElement;
      // Si existe el filter y el click fue fuera de este, entonces cerramos el menu
      if ( filterOptions && !filterOptions.contains(event.target as Node) ) {
        this.showFilterOptions.set(false);
      }
    }

    // Verificación independiente del orden
    if ( this.showOrderOptions() ) {
      const orderOptions = this.orderOptionsRef()?.nativeElement;
      // Si existe el order y el click fue fuera de este, entonces cerramos el menu
      if ( orderOptions && !orderOptions.contains(event.target as Node) ) {
        this.showOrderOptions.set(false);
      }
    }
  }

  // ================================================== TAGS DE LOS PRODUCTOS

  // Actualiza maxTag según el ancho de la pantalla
  @HostListener('window:resize')
  actualizarMaxTags(): void {
    const width = window.innerWidth;

    if ( width >= 1024 ) this.maxTags.set(4);
    else if ( width >= 600 ) this.maxTags.set(2);
    else this.maxTags.set(1);
  }

  // TODO: HOOKS
  ngOnInit(): void {
    this.actualizarMaxTags();
  }

  // TODO: MÉTODOS PRIVADOS
  // ========================================================== ARCHIVAR

  // Decide a que estado pasar al desarchivar, segun el stock real de las variantes
  private resolverEstadoDesarchivar(): EstadoProducto {
    const tieneStock = this.producto().variantes.some( v => v.stock > 0 );
    return tieneStock ? 'disponible' : 'agotado';
  }


  // TODO: MÉTODOS PÚBLICOS
  // ====================================================== MOSTRAR OPCIONES

  // Abrir y cerrar menu de opciones
  toggleOptionsMenu ( event: Event ): void {
    event.stopPropagation(); // Evita que cuando demos click al button lo cuente como si estuviera clickeando en el documento de afuera

    this.showFilterOptions.set(false);
    this.showOrderOptions.set(false);
    this.showOptionsMenu.set(!this.showOptionsMenu());
  }

  // Abrir y cerrar las opciones del filtro
  toggleOptionsFilter ( event: Event ): void {
    event.stopPropagation();

    this.showOptionsMenu.set(false);
    this.showOrderOptions.set(false);
    this.showFilterOptions.set(!this.showFilterOptions());
  }

  // Abrir y cerrar las opciones del orden
  toggleOptionsOrder ( event: Event ): void {
    event.stopPropagation();

    this.showOptionsMenu.set(false);
    this.showFilterOptions.set(false);
    this.showOrderOptions.set(!this.showOrderOptions());
  }

  // ================================================== TAGS DE LOS PRODUCTOS
  getTagColor ( tag: string ): string {
    // Suma los códigos de caracteres del nombre -> número estable
    const hash = tag.split('').reduce( ( acc, char ) => acc + char.charCodeAt(0), 0);

    return this.TAG_COLORS[ hash % this.TAG_COLORS.length];
  }

  // ================================================== CAMBIAR ESTADO POR FILTRO
  // Seleccionar filtro
  seleccionarFiltro ( estado: EstadoVariante | 'todos' ): void {
    this.showFilterOptions.set(false); // Cerramos el dropdown

    this.filterState.set(estado);
  }

  // ========================================================== ORDENAMIENTO
  // Seleccionar ordenamiento
  seleccionarOrdenamiento ( field: Fields | 'defecto' ): void {
    this.showOrderOptions.set(false); // Cerramos el dropdwon

    this.sortField.set(field);
  }

  // ========================================================== ARCHIVAR

  // Archivar / Desarchivar el producto
  toggleArchivoProducto(): void {
    const nuevoEstado: EstadoProducto = this.productoArchivado()
                  ? this.resolverEstadoDesarchivar()
                  : 'descontinuado';

    this.inventarioService.actualizarProducto(
      this.producto().id.toString(),
      { estado: nuevoEstado }
    ).subscribe({
      next: (resp) => {
        this.productoActualizado.emit(resp); // avisamos al padre
        this.showOptionsMenu.set(false); // Cerramos el menu
      }
    });
  }
}
