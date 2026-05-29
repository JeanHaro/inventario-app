import {
  Component,
  ElementRef,
  signal,
  viewChild
} from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  standalone: false,
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  readonly mainContent = viewChild.required<ElementRef<HTMLElement>>('mainContent');

  showSidebar = signal<boolean>(false);

  toggleSidebar(): void {
    this.showSidebar.set(!this.showSidebar());
  }

  // Métodos
  onOverlayClick ( e: Event ): void {
    if ( this.showSidebar() && e.target === this.mainContent().nativeElement ) {
      this.showSidebar.set(false);
    }
  }
}
