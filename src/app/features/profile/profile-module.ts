import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Rutas
import { profileRoutes } from './profile.routes';

// Componentes
import { Profile } from './profile';



@NgModule({
  declarations: [
    Profile
  ],
  imports: [
    CommonModule,

    // FontAwesome
    FontAwesomeModule,
    RouterModule.forChild(profileRoutes)
  ],
})

export class ProfileModule {}
