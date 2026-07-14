import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Rutas
import { invyRoutes } from './invy.routes';

// Componentes
import { Invy } from './invy';
// Componentes - Hijo
import { InvyChat } from './pages/invy-chat/invy-chat';

// Componentes - Shared
import { Select } from '../../shared/components/select/select';


@NgModule({
  declarations: [
    Invy,
    InvyChat
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    Select,
    RouterModule.forChild(invyRoutes)
  ],
})
export class InvyModule {}
