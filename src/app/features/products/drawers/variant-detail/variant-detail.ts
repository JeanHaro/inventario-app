import { Component, ElementRef, HostListener, input, output, signal, viewChild } from '@angular/core';

// FontAwesome
import {
  faArrowRightFromBracket,
  faBarcode,
  faBoxArchive,
  faBoxesStacked,
  faClockRotateLeft,
  faClose,
  faEllipsis,
  faFileArrowDown,
  faFloppyDisk,
  faPenToSquare,
  faPlus,
  faSpinner,
  faTag,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { Variant } from '../../models/products.model';

@Component({
  selector: 'variant-detail',
  standalone: false,
  templateUrl: './variant-detail.html',
  styleUrl: './variant-detail.scss',
})
export class VariantDetail {
  // TODO: VIEWCHILD
  readonly optionsMenuRef = viewChild<ElementRef<HTMLElement>>('optionsMenuRef');

  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faEllipsis: IconDefinition = faEllipsis;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;
  readonly faClose: IconDefinition = faClose;
  readonly faFileArrowDown: IconDefinition = faFileArrowDown;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faSpinner: IconDefinition = faSpinner;
  readonly faBoxesStacked: IconDefinition = faBoxesStacked;
  readonly faTag: IconDefinition = faTag;
  readonly faPlus: IconDefinition = faPlus;
  readonly faClockRotateLeft: IconDefinition = faClockRotateLeft;

  // TODO: INPUT Y OUTPUT
  readonly variant = input.required<Variant>();
  readonly productName = input.required<string>();
  readonly closeModal = output<void>();

  // TODO: SIGNALS
  showOptionsMenu = signal<boolean>(false);

  // TODO: HOSTLISTENER
  // ====================================================== MOSTRAR OPCIONES

  // Escucha cualquier click en el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick ( event: Event ): void {
    if ( this.showOptionsMenu() ) {
      const menuOptions = this.optionsMenuRef()?.nativeElement;

      if ( menuOptions && !menuOptions.contains(event.target as Node) ) {
        this.showOptionsMenu.set(false);
      }
    }
  }

  // TODO: MÉTODOS PÚBLICOS
  // ====================================================== MOSTRAR OPCIONES

  // Mostrar y ocultar el menu de opciones
  toggleOptionsMenu ( event: Event ): void {
    event.stopPropagation();
    this.showOptionsMenu.set(!this.showOptionsMenu());
  }
}
