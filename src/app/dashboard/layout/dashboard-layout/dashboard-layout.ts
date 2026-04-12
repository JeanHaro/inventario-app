import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  standalone: false,
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  showSidebar: boolean = false;

  // Métodos
  toggleSidebar (e: Event): void {
    const { name } = e.target as HTMLButtonElement;
    const mainElement = document.querySelector('main.main-content.active');

    if (name === 'sidebar-active' || mainElement === e.target) {
      this.showSidebar = !this.showSidebar;
    }
  }
}
