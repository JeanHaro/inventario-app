import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Font Awesome
import {
  IconDefinition,
  faCheckDouble,
  faTriangleExclamation,
  faClock,
  faLeftRight,
  faCheck,
  faShield
} from '@fortawesome/free-solid-svg-icons';

// Servicios
import { NotificationService } from '../../services/notification';

// Modelos
import { Notification, NotificationFilter } from '../../models/notification.model';


@Component({
  selector: 'app-notification-dropdown',
  standalone: false,
  templateUrl: './notification-dropdown.html',
  styleUrl: './notification-dropdown.scss',
})

export class NotificationDropdown {
  // ViewChild
  @ViewChild('filtersRef') filtersRef!: ElementRef<HTMLElement>; // Contenedor de filtros

  // Inyecciones
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  // Iconos
  readonly faCheckDouble: IconDefinition = faCheckDouble;
  readonly faTriangleExclamation: IconDefinition = faTriangleExclamation;
  readonly faClock: IconDefinition = faClock;
  readonly faLeftRight: IconDefinition = faLeftRight;
  readonly faCheck: IconDefinition = faCheck;
  readonly faShield: IconDefinition = faShield;

  // Exponemos el servicio al template (solo lectura)
  readonly filteredNotifications = this.notificationService.filteredNotifications;
  readonly countByType = this.notificationService.countByType;
  readonly countByTypeAndUnread = this.notificationService.countByTypeAndUnread;
  readonly activeFilter = this.notificationService.activeFilter;
  readonly hasNotifications = this.notificationService.hasNotifications;

  // Métodos
  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  onNotificationClick ( notif: Notification ): void {
    // Marcar como leída
    this.notificationService.markAsRead(notif.id);

    // Navegar si tiene acción de tipo navigate
    if (notif.action.type === 'navigate' && notif.action.route) {
      this.router.navigate(notif.action.route);
    }
  }

  onFilterClick ( event: MouseEvent, filter: NotificationFilter ): void {
    // 1. Cambiar el filtro activo en el servicio
    this.notificationService.setFilter(filter);

    // 2. Centrar el botón clickeado en el scroll (Solo el contenedor de los filtros)
    const container = this.filtersRef.nativeElement;
    const btn = event.currentTarget as HTMLElement;
    // Posición del botón relativa al contenedor
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const containerWidth = container.offsetWidth;
    // Para centrar
    const scrollTarget = btnLeft - ( containerWidth / 2 ) + ( btnWidth / 2 );

    container.scrollTo({
      left: scrollTarget,
      behavior: 'smooth'
    })
  }
}
