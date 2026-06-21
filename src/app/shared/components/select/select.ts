import {
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { SelectOption } from './models/select.model';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  // TODO: ICONOS
  readonly faAngleDown: IconDefinition = faAngleDown;

  // Referencia al panel de opciones — para detectar clicks afuera
  readonly optionsRef = viewChild('optionsRef', { read: ElementRef });

  // TODO: INPUT Y OUTPUT
  readonly options = input.required<SelectOption[]>();
  readonly value = input.required<string>();
  readonly width = input<string>('13rem'); // permite ajustar el ancho según contexto
  //  el padre decide qué hacer con el nuevo valor
  readonly valueChange = output<string>();

  // TODO: SIGNAL
  showOptions = signal<boolean>(false); // Mostrar opciones

  // TODO: COMPUTED

  // Opción actualmente seleccionada — para mostrar su label/badge
  readonly selected = computed<SelectOption | undefined>(() =>
    this.options().find( o => o.value === this.value() )
  );

  // TODO: HOSTLISTENER
  // Cierra el dropdown al hacer click afuera
  @HostListener('document:click', ['$event'])
  onDocumentClick ( event: Event ): void {
    if ( !this.showOptions() ) return;

    const panel = this.optionsRef()?.nativeElement;
    if ( panel && !panel.contains(event.target as Node) ) {
      this.showOptions.set(false);
    }
  }

  // TODO: MÉTODOS PÚBLICOS

  toggle ( event: Event ): void {
    event.stopPropagation();
    this.showOptions.set( !this.showOptions() );
  }

  seleccionar ( value: string ): void {
    this.valueChange.emit(value);
    this.showOptions.set(false);
  }
}
