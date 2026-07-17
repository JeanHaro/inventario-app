import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  untracked,
  viewChild
} from '@angular/core';

// Font Awesome
import {
  faArrowUp,
  faCirclePlus,
  faDatabase,
  faMicrochip,
  faPaperclip,
  faPlus,
  faRobot,
  faSliders,
  faXmark,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';


// Interfaces
import { SelectOption } from '../../../../shared/components/select/models/select.model';
export type ActionType = 'producto' | 'variante' | 'datos';
type Models = 'anthropic' | 'openai';
export interface ComposedMessage {
  text: string;
  action: ActionType | null;
  images: File[];
  provider: 'anthropic' | 'openai'
}

@Component({
  selector: 'invy-message-composer',
  standalone: false,
  templateUrl: './invy-message-composer.html',
  styleUrl: './invy-message-composer.scss',
})
export class InvyMessageComposer {
  // TODO: VIEWCHILD
  readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textareaRef');
  readonly imageTextareaRef = viewChild<ElementRef<HTMLInputElement>>('imageTextareaRef');

  // TODO: ICONOS
  readonly faCirclePlus: IconDefinition = faCirclePlus;
  readonly faDatabase: IconDefinition = faDatabase;
  readonly faPaperClip: IconDefinition = faPaperclip;
  readonly faArrowUp: IconDefinition = faArrowUp;
  readonly faXmark: IconDefinition = faXmark;
  readonly faPlus: IconDefinition = faPlus;

  // TODO: INPUT Y OUTPUT
  readonly chatActive = input.required<boolean>();
  readonly send = output<ComposedMessage>();

  // TODO: PROPIEDADES
  readonly modelOptions: SelectOption[] = [
    {
      value: 'defecto',
      label: 'Opciones',
      icon: faSliders
    },
    {
      value: 'anthropic',
      label: 'Claude',
      icon: faRobot
    },
    {
      value: 'openai',
      label: 'OpenAI',
      icon: faMicrochip
    }
  ];

  private readonly VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly MAX_SIZE_MB = 5;
  private readonly MAX_IMAGES = 5;

  // TODO: SIGNALS
  modelField = signal<Models | 'defecto'>('defecto');
  messageText = signal<string>(''); // texarea
  selectedAction = signal<ActionType | null>(null); // acciones
  selectedImages = signal<File[]>([]); // Imágenes
  imageError = signal<string | null>(null); // Imágenes

  // TODO: COMPUTED
  // Genera las URLs de preview solo caundo cambian las imagenes seleccionadas
  readonly imagePreviews = computed<string[]>(() =>
    this.selectedImages().map( file => URL.createObjectURL(file) )
  );

  // TODO: EFFECTS

  // Libera las URLs de blob anteriores antes de generar las nuevas
  private previousUrls: string[] = [];

  private readonly managePreviewUrls = effect(() => {
    this.selectedImages();

    untracked(() => {
      this.previousUrls.forEach( url => URL.revokeObjectURL(url) );
      this.previousUrls = this.imagePreviews();
    });
  });

  // TODO: MÉTODOS PÚBLICOS

  // ============================================================= SELECT

  // seleccionar el modelo
  selectModel ( value: string ): void {
    this.modelField.set( value as Models );
  }

  // ============================================================= TEXTAREA

  // Ajusta la altura del textarea según su contenido
  autoResize(): void {
    const element = this.textareaRef()?.nativeElement;
    if ( !element ) return;

    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }

  // Enter envía el mensaje, Shift + Enter agrega un salto de línea
  onEnterPress ( event: Event ): void {
    const keyboardEvent = event as KeyboardEvent;

    if ( !keyboardEvent.shiftKey ) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Envía el mensaje actual
  sendMessage(): void {
    const texto = this.messageText().trim();
    if ( !texto ) return;

    this.send.emit({
      text: texto,
      action: this.selectedAction(),
      images: this.selectedImages(),
      provider: this.modelField() === 'defecto' ? 'openai' : this.modelField() as 'openai' | 'anthropic',
    });

    this.messageText.set('');
    this.selectedAction.set(null);
    this.selectedImages.set([]);
    this.imageError.set(null);

    const element = this.textareaRef()?.nativeElement;
    if ( element ) element.style.height = 'auto';
  }

  // ============================================================= ACCIONES

  // Selecciona una acción, pero si ya estaba seleccionada se va a deseleccionar
  selectAction ( action: ActionType ): void {
    this.selectedAction.set(
      this.selectedAction() === action ? null : action
    );
  }

  // ============================================================== IMÁGENES

  // Abrir el image selector
  openImageSelector(): void {
    this.imageTextareaRef()?.nativeElement.click();
  }

  onImagesSelected ( event: Event ): void {
    const input = event.target as HTMLInputElement;
    if ( !input.files || input.files.length === 0 ) return;

    this.imageError.set(null);

    const nuevosArchivos = Array.from(input.files);
    const espacioDisponible = this.MAX_IMAGES - this.selectedImages().length;

    // Validación de las cantidades
    if ( nuevosArchivos.length > espacioDisponible ) {
      this.imageError.set(`Solo puedes agregar ${espacioDisponible} imagen(es) más. Máximo ${this.MAX_IMAGES} por mensaje.`);
      input.value = '';
      return;
    }

    // Validación de archivos
    for ( const file of nuevosArchivos ) {

      // Tipo de archivo
      if ( !this.VALID_TYPES.includes(file.type) ) {
        this.imageError.set(`"${file.name}" no es un formato válido.`);
        input.value = '';
        return;
      }

      // Peso deñ archivo
      const sizeMB = file.size / (1024 * 1024);
      if ( sizeMB > this.MAX_SIZE_MB ) {
        this.imageError.set(`"${file.name}" pesa ${sizeMB.toFixed(1)}MB. El máximo es ${this.MAX_SIZE_MB}MB.`);
        input.value = '';
        return;
      }
    }

    this.selectedImages.update( actuales => [ ...actuales, ...nuevosArchivos ] );
    input.value = '';
  }

  // Remover la imagen
  removeImage ( index: number ): void {
    this.selectedImages.update( actuales => actuales.filter( (_, i) => i !== index ) );
  }
}
