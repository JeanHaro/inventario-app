import {
  Component,
  signal,
  computed,
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
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

// Servicios
import { InvyChatService } from './services/invy-chat';

// Interfaces
import { AiChatMessage, AiContentBlock, ChatMessage } from './models/chat.model';
import {
  ActionType,
  ComposedMessage
} from './components/invy-message-composer/invy-message-composer';

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

  // TODO: ICONOS
  readonly faCirclePlus: IconDefinition = faCirclePlus;
  readonly faDatabase: IconDefinition = faDatabase;
  readonly faPaperClip: IconDefinition = faPaperclip;
  readonly faSliders: IconDefinition = faSliders;
  readonly faArrowUp: IconDefinition = faArrowUp;
  readonly faPen: IconDefinition = faPen;
  readonly faXmark: IconDefinition = faXmark;
  readonly faPlus: IconDefinition = faPlus;

  // TODO: SIGNALS
  // ============================================================== USER
  readonly userName = computed(() => this.chatService.userName());
  readonly greeting = signal<string>(
    this.getGreetingsByTime()[
      Math.floor(Math.random() * this.getGreetingsByTime().length)
    ]
  );
  displayedGreeting = signal<string>(''); // saludo letra por letra
  editingTitle = signal<boolean>(false); // title
  titleDraft = signal<string>(''); // title
  showHistory = signal<boolean>(false); // history

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

  // ============================================================== TITLE

  readonly currentChatTitle = computed(() => {
    this.navigationEnd();
    const id = this.route.snapshot.firstChild?.paramMap.get('chatId');

    return id ? this.chatService.getChat(id)?.title ?? 'Hola' : 'Hola';
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

  // ============================================================= TEXTAREA

  private fileToBase64 ( file: File ): Promise<string> {
    return new Promise( ( resolve, reject ) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ============================================================= IA

  // Genera una pista de contexto según la acción seleccionada, invisible para el usuario
  private buildContextHint ( action: ActionType | null ): string {
    switch (action) {
      case 'producto':
        return '[Contexto: el usuario se refiere a un PRODUCTO general, no a una variante específica] ';
      case 'variante':
        return '[Contexto: el usuario se refiere a una VARIANTE específica, no al producto en general] ';
      case 'datos':
        return '[Contexto: el usuario está haciendo una consulta de datos/información] ';
      default: return '';
    }
  }

  // Convierte el historial guardado ( formato simple ) al formato multimodal que espera / chat
  private buildHistoryForAI ( chatId: string, currentAction: ActionType | null ): AiChatMessage[] {
    const chat = this.chatService.getChat(chatId);
    if ( !chat ) return [];

    return chat.messages.map( ( m, index ): AiChatMessage => {
      const esElUltimo = index === chat.messages.length - 1;
      const hint = ( esElUltimo && m.role === 'user' )
                            ? this.buildContextHint(currentAction)
                            : '';

      if ( m.role === 'user' && m.images && m.images.length > 0 ) {
        const blocks: AiContentBlock[] = [];
        const textoConHint = hint + (m.content ?? '');

        if ( textoConHint.trim() ) blocks.push({
          type: 'text',
          text: textoConHint
        });

        m.images.forEach( img => blocks.push({
          type: 'image',
          imageBase64: img
          })
        );

        return {
          role: 'user',
          content: blocks
        };
      }

      return {
        role: m.role,
        content: m.content
      };
    });
  }

  // TODO: MÉTODOS PÚBLICOS

  // ============================================================= TEXTAREA

  // Recibir el mensaje actual
  async onSend ( composed: ComposedMessage ): Promise<void> {
    const imagenes = composed.images.length > 0
                        ? await Promise.all(
                          composed.images.map( file => this.fileToBase64(file) )
                        )
                        : undefined;

    const mensajeUsuario: ChatMessage = {
      role: 'user',
      content: composed.text,
      images: imagenes
    };

    let chatId = this.route.snapshot.firstChild?.paramMap.get('chatId');

    if ( chatId ) {
      this.chatService.addMessage(chatId, mensajeUsuario);
    } else {
      chatId = this.chatService.createChat(mensajeUsuario);
      this.router.navigate(['dashboard', 'invy', chatId]);
    }

    this.chatService.aiLoading.set(true);

    const historialParaIA = this.buildHistoryForAI(chatId, composed.action);

    this.chatService.sendToAI(historialParaIA, composed.provider).subscribe({
      next: ( resp ) => {
        this.chatService.addMessage(chatId!, {
          role: 'assistant',
          content: resp.content
        });
        this.chatService.aiLoading.set(false);
      },
      error: () => {
        this.chatService.addMessage(chatId!, {
          role: 'assistant',
          content: 'Ocurrió un error al conectar con el asistente. Intente de nuevo.'
        });
        this.chatService.aiLoading.set(false);
      }
    })
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
