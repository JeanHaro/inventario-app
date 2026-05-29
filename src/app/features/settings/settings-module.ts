import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Rutas
import { settingsRoutes } from './settings.routes';

// Componentes
import { Settings } from './settings';

@NgModule({
  declarations: [
    Settings
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(settingsRoutes)
  ],
})
export class SettingsModule {}
