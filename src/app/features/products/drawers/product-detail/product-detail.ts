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


  // TODO: HostListener
  // Escucha cualquier click en el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick ( event: Event ): void {
    if ( !this.showOptionsMenu() ) return; // si esta cerrado ejecuta el return vacio

    const menu = this.optionsMenuRef()?.nativeElement;
    // Si existe el menu y el click fue fuera de este, entonces cerramos el menu
    if ( menu && !menu.contains(event.target as Node) ) {
      this.showOptionsMenu.set(false);
    }
  }

  // TODO: MÉTODOS
  // Abrir y cerrar menu de opciones
  toggleOptionsMenu ( event: Event ): void {
    event.stopPropagation(); // Evita que cuando demos click al button lo cuente como si estuviera clickeando en el documento de afuera

    this.showOptionsMenu.set(!this.showOptionsMenu());
  }
}
