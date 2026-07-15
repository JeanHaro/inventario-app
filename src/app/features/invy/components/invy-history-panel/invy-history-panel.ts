import {
  Component,
  computed,
  inject,
  model
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';

// RxJs
import { filter } from 'rxjs';

// Font Awesome
import {
  faTrash,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Servicios
import { InvyChatService } from '../../services/invy-chat';


@Component({
  selector: 'invy-history-panel',
  standalone: false,
  templateUrl: './invy-history-panel.html',
  styleUrl: './invy-history-panel.scss',
})
export class InvyHistoryPanel {
  // TODO: INYECCIONES
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly chatService = inject(InvyChatService);

  // TODO: ICONOS
  readonly faTrash: IconDefinition = faTrash;

  // TODO: MODEL - sincroniza en ambas direcciones
  showHistory = model<boolean>(false);

  // TODO: toSignal
  private readonly navigationEnd = toSignal(
    this.router.events.pipe( filter( e => e instanceof NavigationEnd ) ),
    { initialValue: null }
  );

  // TODO: COMPUTED

  // Obtener el id del chat
  readonly currentChadId = computed<string | null>(() => {
    this.navigationEnd();

    return this.route.snapshot.firstChild?.paramMap.get('chatId') ?? null;
  });

  // Obtener el chat actual
  readonly currentChat = computed(() => {
    const id = this.currentChadId();

    return id ? this.chatService.getChat(id) : undefined;
  });

  // Obtener los chats anteriores
  readonly pastChats = computed(() => {
    const currentId = this.currentChadId();

    return this.chatService.chats().filter( chat => chat.id !== currentId );
  });

  // TODO: MÉTODOS PÚBLICOS

  // Mostrar / ocultar panel de historia
  toggleHistory(): void {
    this.showHistory.set(!this.showHistory());
  }

  // Eliminar chat
  deleteChat ( event: Event, chatId: string ): void {
    event.stopPropagation();
    event.preventDefault();

    // Si estas en el chat actual
    const esElActual = this.currentChadId() === chatId;

    this.chatService.deleteChat(chatId);

    if ( esElActual ) this.router.navigate(['dashboard', 'invy']);
  }
}
