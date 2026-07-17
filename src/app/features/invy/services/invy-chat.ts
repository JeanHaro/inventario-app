import {
  effect,
  inject,
  Service,
  signal
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJs
import { Observable } from 'rxjs';

// Interfaces
import { AiChatMessage, AiChatResponse, Chat, ChatMessage } from '../models/chat.model';

// Environment
import { environment } from '../../../../environments/environment';


@Service()
export class InvyChatService {
  // TODO: INYECCIONES
  private readonly http = inject(HttpClient);

  // TODO: PROPIEDADES
  private readonly STORAGE_KEY = 'invy-chats';

  // TODO: SIGNALS
  userName = signal<string>('Jean');
  profileImage = signal<string | null>(null);
  chats = signal<Chat[]>(this.loadFromStorage());
  aiLoading = signal<boolean>(false);

  // TODO: HOOKS
  constructor() {
    // Sincroniza automáticamente cada vez que chats cambia
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.chats()));
    });
  }

  // TODO: MÉTODOS PRIVADOS
  private loadFromStorage(): Chat[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // TODO: MÉTODOS PÚBLICOS

  // Obtener un chat
  getChat ( chatId: string ): Chat | undefined {
    return this.chats().find( chat => chat.id === chatId );
  }

  // Crear un chat
  createChat ( firstMessage: ChatMessage ): string {
    const id = crypto.randomUUID();

    this.chats.update( actuales => [
      ...actuales,
      {
        id,
        title: 'Nueva conversación',
        messages: [ firstMessage ]
      }
    ]);

    return id;
  }

  // Renombrar el chat
  renameChat ( chatId: string, newTitle: string ): void {
    this.chats.update( actuales =>
      actuales.map( chat =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    )
  }

  // Eliminar el chat
  deleteChat ( chatId: string ): void {
    this.chats.update( actuales => actuales.filter( chat => chat.id !== chatId ));
  }

  // Agregar mensaje al chat
  addMessage ( chatId: string, message: ChatMessage ): void {
    this.chats.update( actuales =>
      actuales.map( chat =>
        chat.id === chatId
            ? { ...chat, messages: [ ...chat.messages, message ] }
            : chat
      )
    );
  }

  sendToAI ( messages: AiChatMessage[], provider: 'openai' | 'anthropic' ): Observable<AiChatResponse> {
    return this.http.post<AiChatResponse>(`${environment.apiUrl}/chat`, {
      messages,
      provider
    })
  }
}
