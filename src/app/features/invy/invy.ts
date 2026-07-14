import {
  Component,
  signal,
  viewChild,
  ElementRef
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
  faPen
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
  readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textareaRef');

  // TODO: ICONOS
  readonly faCirclePlus: IconDefinition = faCirclePlus;
  readonly faDatabase: IconDefinition = faDatabase;
  readonly faPaperClip: IconDefinition = faPaperclip;
  readonly faSliders: IconDefinition = faSliders;
  readonly faArrowUp: IconDefinition = faArrowUp;
  readonly faTrash: IconDefinition = faTrash;
  readonly faPen: IconDefinition = faPen;

  // TODO: PROPIEDADES
  readonly modelOptions: SelectOption[] = [
    {
      value: 'defecto',
      label: 'Defecto'
    },
    {
      value: 'anthropic',
      label: 'Anthropic',
    },
    {
      value: 'openai',
      label: 'OpenAI',
    }
  ];

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
}
