import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';

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
  // TODO: ViewChild
  readonly notificationRef = viewChild(
    'notificationRef',
    { read: ElementRef<HTMLElement> }
  );
  readonly searchMobileRef = viewChild<ElementRef<HTMLElement>>('searchMobileRef');

  // TODO: Inyecciones
  private readonly notificationService = inject(NotificationService);

  // TODO: Iconoss
  readonly faMagnifyingGlass: IconDefinition = faMagnifyingGlass;
  readonly faSun: IconDefinition = faSun;
  readonly faMoon: IconDefinition = faMoon;
  readonly faBell: IconDefinition = faBell;

  // TODO: Input y Output
  sidebarActive = output<Event>();
  showSidebar = input<boolean>(false);

  // TODO: Signals
  showSearch = signal<boolean>(false);
  showNotification = signal<boolean>(false);
  isDarkMode = signal<boolean>(false);

  // Exponemos el servicio al template (solo lectura)
  readonly unreadNotificationCount = this.notificationService.unreadCount;

  // TODO: HostListener
  // ====================================================== MOSTRAR NOTIFICACIONES
  // Escucha cualquier click en el documento
  @HostListener('document:click', ['$event'])
  onHeaderClick ( event: Event ): void {
    if ( this.showNotification() ) {
      const notifications = this.notificationRef()?.nativeElement;

      if ( notifications && !notifications.contains(event.target as Node) ) {
        this.showNotification.set(false);
      }
    }

    if ( this.showSearch() ) {
      const searchMobile = this.searchMobileRef()?.nativeElement;

      if ( searchMobile && !searchMobile.contains(event.target as Node) ) {
        if (window.innerWidth < 768) this.showSearch.set(false);
      }
    }
  }


  // TODO: MÉTODOS
  // ====================================================== MOSTRAR SIDEBAR
  openSidebar (e: Event): void {
    this.sidebarActive.emit(e);
  }

  // ====================================================== MOSTRAR SEARCH
  openSearch ( event: Event ): void {
    event.stopPropagation();

    if (window.innerWidth < 768) {
      this.showSearch.set(!this.showSearch());
      this.showNotification.set(false);
    }
  }

  // ====================================================== DARK MODE
  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
  }

  // ====================================================== MOSTRAR NOTIFICACIONES
  openNotifications ( event: Event ): void {
    event.stopPropagation();
    this.showNotification.set(!this.showNotification())

    if (window.innerWidth < 768) this.showSearch.set(false)
  }
}
