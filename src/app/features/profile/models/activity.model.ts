// FontAwesome
import { IconDefinition } from '@fortawesome/angular-fontawesome';

// Tipos de actividad
export const ACTIVITY_LIST = [
  'creacion',
  'actualizacion',
  'stock',
  'archivado',
  'desarchivado',
  'ia'
] as const;
export type ActivityType = ( typeof ACTIVITY_LIST )[number];

export type ActivityTab = 'mias' | 'generales' | 'ia';

// Actividad
export interface Activity {
  id: string;
  tipo: ActivityType;
  tipoLabel: string;
  icono: IconDefinition;
  elementoNombre: string;
  detalle: string;
  usuarioNombre?: string;
  fecha: string;
}


