import {
  Component,
  computed,
  ElementRef,
  HostListener,
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
import { Producto } from '../../models/products.model';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
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

  // TODO: SIGNALS
  showOptionsMenu = signal<boolean>(false);
  showFilterOptions = signal<boolean>(false);
  showOrderOptions = signal<boolean>(false);

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

  // TODO: Hooks
  ngOnInit(): void {
    this.actualizarMaxTags();
  }

  // TODO: MÉTODOS
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
}
