import { Routes } from '@angular/router';

// Componentes
import { Invy } from './invy';
// Componentes hijos
import { InvyChat } from './pages/invy-chat/invy-chat';

export const invyRoutes: Routes = [
  {
    path: '',
    component: Invy,
    children: [
      {
        path: ':chatId',
        component: InvyChat
      }
    ]
  }
];
