import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Rutas
import { settingsRoutes } from './settings.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(settingsRoutes)
  ],
})
export class SettingsModule {}
