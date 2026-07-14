import { Component, input } from '@angular/core';

@Component({
  selector: 'invy-chat',
  standalone: false,
  templateUrl: './invy-chat.html',
  styleUrl: './invy-chat.scss',
})
export class InvyChat {
  readonly userName = input<string>();
}
