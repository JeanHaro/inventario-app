// ============================================================
// TIPOS — Categorías posibles de una notificación
// ============================================================
export type NotificationType = | 'critical' | 'warning' | 'movements' | 'confirmed' | 'system';

// ============================================================
// TIPO — Filtro activo (todas o una categoría específica)
// ============================================================
export type NotificationFilter = 'all' | NotificationType;

// ============================================================
// INTERFAZ — Acción al hacer click en una notificación
// ============================================================
export interface NotificationAction {
  type: 'navigate' | 'none';   // navigate = ir a una ruta
  route?: string[];             // ejemplo: ['products', '123']
}

// ============================================================
// INTERFAZ PRINCIPAL — Una notificación completa
// ============================================================
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  badges: string[];
  timestamp: Date;
  isRead: boolean;
  action: NotificationAction;
}
