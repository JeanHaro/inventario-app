import { Component, computed, signal } from '@angular/core';

// Font Awesome
import {
  faArrowUpRightFromSquare,
  faBoxArchive,
  faBoxesStacked,
  faEye,
  faNoteSticky,
  faPlus,
  faRobot,
  faTag,
  faUserPlus,
  faUsers,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Models
import { Activity, ActivityTab } from './models/activity.model';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  // TODO: ICONOS
  readonly faEye: IconDefinition = faEye;
  readonly faUsers: IconDefinition = faUsers;
  readonly faUserPlus: IconDefinition = faUserPlus;
  readonly faArrowUpRightFromSquare: IconDefinition = faArrowUpRightFromSquare;

  // TODO: SIGNALS
  activeTab = signal<ActivityTab>('mias');

  // Temporal
  private readonly allActivities = signal<Activity[]>([
    {
      id: '1',
      tipo: 'stock',
      tipoLabel: 'Stock actualizado',
      icono: faBoxesStacked,
      elementoNombre: 'Zapatilla Urbana - Talla 42',
      detalle: 'De 30 a 25 unidades',
      usuarioNombre: 'Jean Haro',
      fecha: 'Hace 5 minutos'
    },
    {
      id: '2',
      tipo: 'actualizacion',
      tipoLabel: 'Precio actualizado',
      icono: faTag,
      elementoNombre: 'Zapatilla Urbana - Talla 42',
      detalle: 'De S/ 80 a S/ 90',
      usuarioNombre: 'María López',
      fecha: 'Ayer, 3:40 p.m.'
    },
    {
      id: '3',
      tipo: 'archivado',
      tipoLabel: 'Variante archivada',
      icono: faBoxArchive,
      elementoNombre: 'Casaca de cuero - Talla M',
      detalle: 'Marcada como descontinuada',
      usuarioNombre: 'Jean Haro',
      fecha: '20 jun, 10:15 a.m.'
    },
    {
      id: '4',
      tipo: 'creacion',
      tipoLabel: 'Producto creado',
      icono: faPlus,
      elementoNombre: 'Mochila Escolar',
      detalle: 'Stock inicial: 50 unidades',
      usuarioNombre: 'María López',
      fecha: '10 ene, 3:00 a.m.'
    },
    {
      id: '5',
      tipo: 'ia',
      tipoLabel: 'Descripción generada con IA',
      icono: faRobot,
      elementoNombre: 'Mochila Escolar',
      detalle: 'Invy generó una nueva descripción del producto',
      usuarioNombre: 'Jean Haro',
      fecha: '09 ene, 8:12 p.m.'
    }
  ]);

  // TODO: COMPUTED

  // Solo es true cuando la pestaña activa no es "mias"
  readonly showUsers = computed<boolean>(() => this.activeTab() !== 'mias');

  // Filtra la lista completa según la pestaña
  readonly activities = computed<Activity[]>(() => {
    switch(this.activeTab()) {
      case 'mias':
        // TODO: cuando exista auth real, filtrar por el id del usuario logueado
        return this.allActivities().filter(
          activity => activity.usuarioNombre === 'Jean Haro'
        );

      case 'ia':
        return this.allActivities().filter(
          activity => activity.tipo === 'ia'
        );

      case 'generales':
      default:
        return this.allActivities();
    }
  });

  // TODO: MÉTODOS

  // Cambia que pestaña está activa
  changeTab ( tab: ActivityTab ): void {
    this.activeTab.set(tab);
  }

  // Se ejecuta al hacer click en ver
  viewActivityDetails ( id: string ) {
    // TODO: abrir el drawer de detalle con query param
  }
}
