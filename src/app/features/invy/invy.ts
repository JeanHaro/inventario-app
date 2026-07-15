import {
  Component,
  signal,
  viewChild,
  ElementRef,
  computed,
  effect,
  untracked,
  inject,
  DestroyRef
} from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';

// Rxjs
import { filter } from 'rxjs';

// FontAwesome
import {
  faArrowUp,
  faCirclePlus,
  faDatabase,
  faPaperclip,
  faSliders,
  IconDefinition,
  faPen,
  faXmark,
  faRobot,
  faMicrochip,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { SelectOption } from '../../shared/components/select/models/select.model';
type Models = 'anthropic' | 'openai';
type ActionType = 'producto' | 'variante' | 'datos';

// Servicios
import { InvyChatService } from './services/invy-chat';
import { ChatMessage } from './models/chat.model';

@Component({
  selector: 'app-invy',
  standalone: false,
  templateUrl: './invy.html',
  styleUrl: './invy.scss',
})
export class Invy {
  // TODO: INYECCIONES
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly chatService = inject(InvyChatService);

  // TODO: VIEWCHILD
  readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textareaRef'); // textarea
  readonly imageTextareaRef = viewChild<ElementRef<HTMLInputElement>>('imageTextareaRef'); // Imágenes

  // TODO: ICONOS
  readonly faCirclePlus: IconDefinition = faCirclePlus;
  readonly faDatabase: IconDefinition = faDatabase;
  readonly faPaperClip: IconDefinition = faPaperclip;
  readonly faSliders: IconDefinition = faSliders;
  readonly faArrowUp: IconDefinition = faArrowUp;
  readonly faPen: IconDefinition = faPen;
  readonly faXmark: IconDefinition = faXmark;
  readonly faPlus: IconDefinition = faPlus;

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
  // ============================================================== USER
  readonly userName = computed(() => this.chatService.userName());
  readonly greeting = signal<string>(
    this.getGreetingsByTime()[
      Math.floor(Math.random() * this.getGreetingsByTime().length)
    ]
  );
  displayedGreeting = signal<string>(''); // saludo letra por letra
  modelField = signal<Models | 'defecto'>('defecto');
  editingTitle = signal<boolean>(false); // title
  titleDraft = signal<string>(''); // title
  showHistory = signal<boolean>(false); // history
  messageText = signal<string>(''); // texarea
  selectedAction = signal<ActionType | null>(null); // acciones
  selectedImages = signal<File[]>([]); // Imágenes
  imageError = signal<string | null>(null); // Imágenes

  // TODO: toSignal
  // Se dispara cada vez que una navegación termina, funciona para re-leer la ruta
  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter( e => e instanceof NavigationEnd )
    ),
    { initialValue: null }
  );

  // TODO: COMPUTED

  // ============================================================== TEXTAREA
  // El chat está "activo" si existe un chatId en la ruta hija, sin importar cómo se llegó ahí
  readonly chatActive = computed<boolean>(() => {
    this.navigationEnd(); // dependencia — obliga a recalcular en cada navegación
    return !!this.route.snapshot.firstChild?.paramMap.get('chatId');
  });

  // ============================================================== IMÁGENES

  // Genera las URLs de preview solo caundo cambian las imagenes seleccionadas
  readonly imagePreviews = computed<string[]>(() =>
    this.selectedImages().map( file => URL.createObjectURL(file) )
  )

  // ============================================================== TITLE

  readonly currentChatTitle = computed(() => {
    const id = this.route.snapshot.firstChild?.paramMap.get('chatId');

    return id ? this.chatService.getChat(id)?.title ?? 'Hola' : 'Hola';
  });

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

  // TODO: HOOKS
  constructor() {
    this.typewriterEffect();
  }

  // TODO: MÉTODOS PRIVADOS
  // ============================================================ SALUDO
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

  private typewriterEffect(): void {
    const textoCompleto = this.greeting();
    let index = 0;

    const interval = setInterval(() => {
      index++;
      this.displayedGreeting.set( textoCompleto.slice(0, index) );

      if ( index >= textoCompleto.length ) {
        clearInterval(interval);
      }
    }, 35);

    this.destroyRef.onDestroy( () => clearInterval(interval) );
  }

  // TODO: MÉTODOS PÚBLICOS

  // ============================================================ SELECT

  // seleccionar el modelo
  selectModel ( valor: string ): void {
    this.modelField.set( valor as Models );
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

    const mensaje: ChatMessage = { role: 'user', content: texto };

    const chatIdActual = this.route.snapshot.firstChild?.paramMap.get('chatId');

    if ( chatIdActual ) {
      // Ya hay una conversación activa - solo agregamos el mensaje
      this.chatService.addMessage(chatIdActual, mensaje);
    } else {
      // primer mensaje - crea la conversación y navega hacia ella
      const nuevoId = this.chatService.createChat(mensaje);
      this.router.navigate(['dashboard', 'invy', nuevoId]);
    }

    this.messageText.set('');

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

  // Remover la imagen
  removeImage ( index: number ): void {
    this.selectedImages.update( actuales => actuales.filter( (_, i) => i !== index) )
  }

  // ============================================================== TITLE

  // Iniciar editando el titulo
  startEditingTitle(): void {
    this.titleDraft.set(this.currentChatTitle());
    this.editingTitle.set(true);
  }

  saveTitle(): void {
    const id = this.route.snapshot.firstChild?.paramMap.get('chatId');

    if ( id && this.titleDraft().trim() ) {
      this.chatService.renameChat(id, this.titleDraft().trim());
    }

    this.editingTitle.set(false);
  }
}
