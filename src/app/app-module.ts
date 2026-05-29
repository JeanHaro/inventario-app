import { NgModule, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import localePe from '@angular/common/locales/es-PE';
registerLocaleData(localePe);

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: LOCALE_ID,
      useValue: 'es-PE',
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
