import {
  Component,
  signal,
  viewChild,
  ElementRef,
  computed,
  effect,
  untracked
} from '@angular/core';

// FontAwesome
import {
  faArrowUp,
  faCirclePlus,
  faDatabase,
  faTrash,
  faPaperclip,
  faSliders,
  IconDefinition,
  faPen,
  faXmark,
  faRobot,
  faMicrochip,
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { SelectOption } from '../../shared/components/select/models/select.model';
type Models = 'anthropic' | 'openai';
type ActionType = 'producto' | 'variante' | 'datos';

@Component({
  selector: 'app-invy',
  standalone: false,
  templateUrl: './invy.html',
  styleUrl: './invy.scss',
})
export class Invy {
  // TODO: VIEWCHILD
  readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textareaRef'); // textarea
  readonly imageTextareaRef = viewChild<ElementRef<HTMLInputElement>>('imageTextareaRef'); // Imágenes


  // TODO: ICONOS
  readonly faCirclePlus: IconDefinition = faCirclePlus;
  readonly faDatabase: IconDefinition = faDatabase;
  readonly faPaperClip: IconDefinition = faPaperclip;
  readonly faSliders: IconDefinition = faSliders;
  readonly faArrowUp: IconDefinition = faArrowUp;
  readonly faTrash: IconDefinition = faTrash;
  readonly faPen: IconDefinition = faPen;
  readonly faXmark: IconDefinition = faXmark;

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
  readonly userName = signal<string>('Jean');
  readonly greeting = signal<string>(
    this.getGreetingsByTime()[
      Math.floor(Math.random() * this.getGreetingsByTime().length)
    ]
  );
  modelField = signal<Models | 'defecto'>('defecto');
  chatActive = signal<boolean>(false);
  showHistory = signal<boolean>(false); // history
  messageText = signal<string>(''); // texarea
  selectedAction = signal<ActionType | null>(null); // acciones
  selectedImages = signal<File[]>([]); // Imágenes
  imageError = signal<string | null>(null); // Imágenes

  // TODO: COMPUTED

  // ============================================================== IMÁGENES

  // Genera las URLs de preview solo caundo cambian las imagenes seleccionadas
  readonly imagePreviews = computed<string[]>(() =>
    this.selectedImages().map( file => URL.createObjectURL(file) )
  )

  // TODO: EFFECTS

  // ============================================================== IMÁGENES

  // Libera las URLs de blob anteriores antes de generar las nuevas (evitar memory leaks)
  private previousUrls: string[] = [];

  private readonly managePreviewUrls = effect(() => {
    this.selectedImages();

    untracked(() => {
      this.previousUrls.forEach( url => URL.revokeObjectURL(url) );
      this.previousUrls = this.imagePreviews();
    });
  });

  // TODO: MÉTODOS PRIVADOS
  private getGreetingsByTime(): string[] {
    const hora = new Date().getHours();

    if ( hora < 12 ) {
      return [
        `Buenos días, ${this.userName()}. ¿Qué crearemos hoy?`,
        `Buenos días. ¿Empezamos revisando el inventario?`,
      ];
    }

    if ( hora < 19 ) {
      return [
        `Buenas tardes, ${this.userName()}. ¿En qué te ayudo?`,
        `¿Cómo va tu tarde, ${this.userName()}? Vamos con tu inventario.`,
      ];
    }

    return [
      `Buenas noches, ${this.userName()}. ¿Qué te trae por aquí?`,
      `Trabajando hasta tarde, ${this.userName()}. ¿Qué necesitas?`,
    ];
  }

  // TODO: MÉTODOS PÚBLICOS

  // ============================================================ SELECT

  // seleccionar el modelo
  selectModel ( valor: string ): void {
    this.modelField.set( valor as Models );
  }

  // ============================================================= HISTORY

  // Mostrar / ocultar historia
  toggleHistory(): void {
    this.showHistory.set(!this.showHistory());
  }

  // ============================================================= TEXTAREA

  // Ajusta la altura del textarea según su contenido
  autoResize(): void {
    const element = this.textareaRef()?.nativeElement;
    if ( !element ) return;

    element.style.height = 'auto'; // Resetea antes de medir, evita que solo crezca
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

    console.log('Enviando mensaje:', texto); // hasta que exista el backend

    this.messageText.set('');

    // Resetea la altura del textarea tras enviar
    const element = this.textareaRef()?.nativeElement;
    if ( element ) element.style.height = 'auto';
  }

  // ============================================================= ACCIONES

  // Selecciona una acción - si ya estaba seleccionada, se deselecciona
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

  removeImage ( index: number ): void {
    this.selectedImages.update( actuales => actuales.filter( (_, i) => i !== index) )
  }
}
