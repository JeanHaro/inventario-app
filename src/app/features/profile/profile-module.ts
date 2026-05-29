import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
    RouterModule.forChild(profileRoutes)
  ],
})

export class ProfileModule {}
