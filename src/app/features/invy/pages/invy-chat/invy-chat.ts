import { Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

// Servicios
import { InvyChatService } from '../../services/invy-chat';

@Component({
  selector: 'invy-chat',
  standalone: false,
  templateUrl: './invy-chat.html',
  styleUrl: './invy-chat.scss',
})
export class InvyChat {
  // TODO: INYECCIONES
  private readonly route = inject(ActivatedRoute);
  private readonly chatService = inject(InvyChatService);

  // TODO: toSignal
  private readonly chatId = toSignal(
    this.route.paramMap,
    { initialValue: this.route.snapshot.paramMap }
  );

  // TODO: COMPUTED
  // ============================================ USER
  readonly userName = computed(() => this.chatService.userName());
  readonly profileImage = computed(() => this.chatService.profileImage());

  readonly userInitial = computed(() =>
    (this.userName() ?? '').charAt(0).toUpperCase()
  );

  // ================================================ CHAT
  readonly chat = computed(() => {
    const id = this.chatId().get('chatId');

    return id ? this.chatService.getChat(id) : undefined;
  });

  readonly messages = computed(() => this.chat()?.messages ?? []);

  // ==================================================== IA
  readonly aiLoading = computed(() =>
    this.chatService.aiLoading()
  )
}
