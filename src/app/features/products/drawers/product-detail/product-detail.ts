import {
  Component,
  ElementRef,
  HostListener,
  input,
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
export class ProductDetail {
  // TODO: ViewChild
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

  // TODO: Input y Output
  readonly producto = input.required<Producto>();
  readonly cerrarModal = output<void>();

  // TODO: SIGNALS
  showOptionsMenu = signal<boolean>(false);
  showFilterOptions = signal<boolean>(false);
  showOrderOptions = signal<boolean>(false);

  // TODO: HostListener
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

  // TODO: MÉTODOS
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
}
