import { computed, Injectable, signal } from '@angular/core';
import {
  Notification,
  NotificationFilter,
} from '../models/notification.model'

// ============================================================
// DATOS MOCK — Aquí van tus notificaciones de ejemplo
// (Después esto vendrá de una API)
// ============================================================
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'critical',
    title: 'Stock agotado - Arroz integral',
    description: '0 unidades. Ventas bloqueadas automáticamente desde hace 5 minutos.',
    badges: ['Críticas', 'Sin stock', 'Auditoría'],
    timestamp: new Date().toISOString(),
    isRead: false,
    action: { type: 'navigate', route: ['products', 'arroz-integral'] },
  },
  {
    id: 'notif-002',
    type: 'warning',
    title: 'Stock bajo - Aceite de oliva 500ml',
    description: '12 unidades. Punto de reorden: 25. Se recomienda emitir OC.',
    badges: ['Alertas', 'Stock bajo', 'Vence pronto'],
    timestamp: new Date().toISOString(),
    isRead: false,
    action: { type: 'navigate', route: ['products', 'aceite-oliva-500ml'] },
  },
  {
    id: 'notif-003',
    type: 'movements',
    title: 'Recepción confirmada - Proveedor Makro',
    description: '200 unidades de Atún en lata ingresadas. Pendiente validación supervisor.',
    badges: ['Movimientos', 'Entrada', 'Transferencia'],
    timestamp: new Date().toISOString(),
    isRead: false,
    action: { type: 'none' },
  },
  {
    id: 'notif-004',
    type: 'confirmed',
    title: 'Orden de compra aprobada — OC-2024-089',
    description: '500 unidades. Entrega estimada: 3 días hábiles. Aprobado por gerencia.',
    badges: ['Confirmadas', 'Aprobada'],
    timestamp: new Date(Date.now() - 3600000).toISOString(), // hace 1 hora
    isRead: true,
    action: { type: 'none' },
  },
  {
    id: 'notif-005',
    type: 'system',
    title: 'Reporte mensual generado',
    description: 'Inventario Marzo 2025 procesado. 1,248 productos analizados.',
    badges: ['Sistema', 'Reporte'],
    timestamp: new Date(Date.now() - 86400000).toISOString(), // hace 1 día
    isRead: true,
    action: { type: 'none' },
  },
  {
    id: 'notif-006',
    type: 'critical',
    title: 'Stock agotado - Zapatillas Nike',
    description: '0 unidades. Ventas bloqueadas automáticamente desde hace 1 día. Es momento de llenar el inventario para este producto con urgencia. 0 unidades. Esto es una prueba solamente para ver como se ve la notificación cuando tiene una descripción extensa.',
    badges: ['Críticas', 'Sin Stock', 'Auditoría'],
    timestamp: new Date(Date.now() - 86400000).toISOString(), // hace 1 día
    isRead: false,
    action: { type: 'none' },
  },
]

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // -----------------------------------------------------------
  // ESTADO PRIVADO (solo el servicio puede modificarlo)
  // -----------------------------------------------------------
  private readonly _notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);
  private readonly _activeFilter = signal<NotificationFilter>('all');

  // -----------------------------------------------------------
  // ESTADO PÚBLICO (los componentes solo pueden leerlo)
  // -----------------------------------------------------------
  readonly activeFilter = this._activeFilter.asReadonly();

  // -----------------------------------------------------------
  // COMPUTED — Se recalculan automáticamente cuando cambia el estado
  // -----------------------------------------------------------
  /** Notificaciones filtradas según el filtro activo */
  readonly filteredNotifications = computed(() => {
    const filter = this._activeFilter();
    const notifs = this._notifications();

    return filter === 'all'
      ? notifs
      : notifs.filter((n) => n.type === filter);
  });

  /** Cantidad de no leídas (para el badge de la campanita) */
  readonly unreadCount = computed(
    () => this._notifications().filter((n) => !n.isRead).length
  );

  /** ¿Hay alguna notificación? (para el botón "marcar todas como leídas") */
  readonly hasNotifications = computed(
    () => this._notifications().length > 0
  );

  /** Conteo por tipo (para los números en los botones de filtro) */
  readonly countByType = computed(() => {
    const notifs = this._notifications();

    return {
      all: notifs.length,
      critical:  notifs.filter( n => n.type === 'critical' ).length,
      warning:   notifs.filter( n => n.type === 'warning' ).length,
      movements: notifs.filter( n => n.type === 'movements' ).length,
      confirmed: notifs.filter( n => n.type === 'confirmed' ).length,
      system:    notifs.filter( n => n.type === 'system' ).length,
    };
  });

  /** Conteo por tipo y no leidos (para los números en los botones de filtro) */
  readonly countByTypeAndUnread = computed(() => {
    const notifs = this._notifications();

    return {
      all: notifs.filter( n => !n.isRead ).length,
      critical: notifs.filter( n => n.type === 'critical' && !n.isRead ).length,
      warning: notifs.filter( n => n.type === 'warning' && !n.isRead ).length,
      movements: notifs.filter( n => n.type === 'movements' && !n.isRead ).length,
      confirmed: notifs.filter( n => n.type === 'confirmed' && !n.isRead ).length,
      system: notifs.filter( n => n.type === 'system' && !n.isRead ).length,
    }
  });

  // -----------------------------------------------------------
  // MÉTODOS — Las únicas formas de cambiar el estado
  // -----------------------------------------------------------

  setFilter ( filter: NotificationFilter ): void {
    this._activeFilter.set(filter);
  }

  markAsRead ( id: string ): void {
    this._notifications.update( (notifs) =>
      notifs.map( n => ( n.id === id ? { ...n, isRead: true } : n ) )
    );
  }

  markAllAsRead(): void {
    this._notifications.update( (notifs) =>
      notifs.map( n => ({ ...n, isRead: true }))
    );
  }
}
