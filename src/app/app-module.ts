import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Componentes
import { Dashboard } from './components/dashboard/dashboard';
import { ProductoCard } from './components/producto-card/producto-card';
import { Filtros } from './components/filtros/filtros';
import { Form } from './components/form/form';

@NgModule({
  declarations: [App, Dashboard, ProductoCard, Filtros, Form],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
