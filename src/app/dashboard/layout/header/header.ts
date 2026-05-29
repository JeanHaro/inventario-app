import { Component, inject, input, output, signal } from '@angular/core';

import {
  IconDefinition,
  faMagnifyingGlass,
  faSun,
  faMoon,
  faBell
} from '@fortawesome/free-solid-svg-icons';

// Servicios
import { NotificationService } from './services/notification';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Inyecciones
  private readonly notificationService = inject(NotificationService);

  // Iconoss
  readonly faMagnifyingGlass: IconDefinition = faMagnifyingGlass;
  readonly faSun: IconDefinition = faSun;
  readonly faMoon: IconDefinition = faMoon;
  readonly faBell: IconDefinition = faBell;

  // Propiedades de salida y entrada
  sidebarActive = output<Event>();
  showSidebar = input<boolean>(false);

  // Propiedades
  showSearch = signal<boolean>(false);
  showNotification = signal<boolean>(false);
  isDarkMode = signal<boolean>(false);

  // Exponemos el servicio al template (solo lectura)
  readonly unreadNotificationCount = this.notificationService.unreadCount;

  // Métodos
  openSidebar (e: Event): void {
    this.sidebarActive.emit(e);
  }

  openSearch () {
    if (window.innerWidth < 768) {
      this.showSearch.set(!this.showSearch());

      this.showNotification.set(false);
    }
  }

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
  }

  openNotifications() {
    this.showNotification.set(!this.showNotification())

    if (window.innerWidth < 768) this.showSearch.set(false)
  }
}
