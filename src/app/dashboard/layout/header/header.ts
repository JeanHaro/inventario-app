
import { Component, input, output, signal } from '@angular/core';

import {
  IconDefinition,
  faMagnifyingGlass,
  faSun,
  faMoon,
  faBell
} from '@fortawesome/free-solid-svg-icons';

import {
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
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
  isDarkMode = signal<boolean>(false);

  // Métodos
  openSidebar (e: Event): void {
    this.sidebarActive.emit(e);
  }

  openSearch () {
    (window.innerWidth < 768)
      ? this.showSearch.set(!this.showSearch())
      : this.showSearch.set(this.showSearch());
  }

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
  }
}
