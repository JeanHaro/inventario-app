import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Componente Padre
import { Reports } from './reports';
// Componentes Hijos
import { ReportsTable } from './components/reports-table/reports-table';
import { StatsCard } from './components/stats-card/stats-card';

// Rutas
import { reportsRoutes } from './reports.routes';

@NgModule({
  declarations: [
    Reports,
    ReportsTable,
    StatsCard
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(reportsRoutes)
  ],
})
export class ReportsModule {}
