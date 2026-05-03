import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Componentes
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';

import { Header } from './layout/header/header';
// -> Componente Hijo del Header
import { NotificationDropdown } from './layout/header/components/notification-dropdown/notification-dropdown';

import { Footer } from './layout/footer/footer';
import { Sidebar } from './layout/sidebar/sidebar';
// -> Componente Hijo del Sidebar
import { ProfileMenu } from './layout/sidebar/components/profile-menu/profile-menu';

// Rutas
import { DashboardRoutes } from './dashboard.routes';


@NgModule({
  declarations: [
    DashboardLayout,
    Header,
    Footer,
    Sidebar,

    // Componentes hijos
    NotificationDropdown,
    ProfileMenu,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild(DashboardRoutes)],
})
export class DashboardModule {}
