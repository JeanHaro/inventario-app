import { Component, input } from '@angular/core';

import {
  IconDefinition,
  faHome,
  faBox,
  faPowerOff,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  // Iconos
  readonly faHome: IconDefinition = faHome;
  readonly faBox: IconDefinition = faBox;
  readonly faPowerOff: IconDefinition = faPowerOff;
  readonly faChevronRight: IconDefinition = faChevronRight;

  // Propiedades de salida y entrada
  showSidebar = input<boolean>(false);
}
