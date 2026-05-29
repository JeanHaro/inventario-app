import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Rutas
import { homeRoutes } from './home.routes';

// Componentes
import { Home } from './home';

@NgModule({
  declarations: [
    Home
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes)
  ],
})
export class HomeModule {}
