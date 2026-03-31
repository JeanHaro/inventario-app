import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Componentes
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

// Rutas
import { DashboardRoutes } from './dashboard.routes';

@NgModule({
  declarations: [
    DashboardLayout,
    Header,
    Footer,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes)
  ]
})
export class DashboardModule {}
