import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Componente Padre
import { Reports } from './reports';
// Componentes - Hijos
import { KpiCard } from './components/kpi-card/kpi-card';
import { KpiChart } from './components/kpi-chart/kpi-chart';

// Componente - Shared
import { Select } from '../../shared/components/select/select';

// Rutas
import { reportsRoutes } from './reports.routes';


@NgModule({
  declarations: [
    Reports,
    KpiCard,
    KpiChart
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    // Shared
    Select,

    // Rutas
    RouterModule.forChild(reportsRoutes)
  ],
})
export class ReportsModule {}
