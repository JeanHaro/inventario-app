import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { ChartType } from 'chart.js';

// Servicios
import { ReportService } from './services/report';

// Interfaces
import {
  SelectOption
} from '../../shared/components/select/models/select.model';

import {
  KpiCategory,
  KpiChartConfig,
  KpiPeriod
} from './models/kpi.model';


@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  // TODO: INYECCIONES
  private readonly reportService = inject(ReportService);

  // TODO: PROPIEDADES
  readonly periodOptions: SelectOption[] = [
    { value: 'dia', label: 'Hoy' },
    { value: 'semana', label: 'Esta semana' },
    { value: 'mes', label: 'Este mes' }
  ];

  readonly categoryOptions: SelectOption[] = [
    { value: 'inventario', label: 'Inventario' },
    { value: 'catalogo', label: 'Catálogo' },
    { value: 'precios', label: 'Precios' },
    { value: 'actividad', label: 'Actividad' }
  ];

  // TODO: SIGNAL
  selectedPeriod = signal<KpiPeriod>('dia');
  selectedCategory = signal<KpiCategory>('inventario');

  // TODO: COMPUTED

  // Se recalcula automáticamente cuando cambia el periodo y categoría seleccionada
  readonly kpis = computed(() => {
    switch ( this.selectedCategory() ) {
      case 'inventario':
        return this.reportService.getInventoryKpis(this.selectedPeriod());
      case 'catalogo':
        return this.reportService.getCatalogKpis(this.selectedPeriod());
      case 'precios':
        return this.reportService.getPricingKpis(this.selectedPeriod());
      case 'actividad':
        return this.reportService.getActivityKpis(this.selectedPeriod());
      }
    }
  );

  // Se recalcula automáticamente cuando cambia el periodo y categoría seleccionada
  readonly charts = computed<KpiChartConfig[]>(() => {
    switch ( this.selectedCategory() ) {
      case 'inventario':
        return this.reportService.getInventoryCharts(this.selectedPeriod());
      case 'catalogo':
        return this.reportService.getCatalogCharts(this.selectedPeriod());
      case 'precios':
        return this.reportService.getPricingCharts(this.selectedPeriod());
      case 'actividad':
        return this.reportService.getActivityCharts(this.selectedPeriod());
    }
  });

  readonly periodTitle = computed<string>(() => {
  switch ( this.selectedPeriod() ) {
    case 'dia':    return 'Reportes del día';
    case 'semana': return 'Reportes semanales';
    case 'mes':    return 'Reportes mensuales';
  }
});

  // TODO: MÉTODOS PÚBLICOS

  // Actualizar el valor del select del periodo
  updatePeriod ( valor: string ): void {
    this.selectedPeriod.set(valor as KpiPeriod);
  }

  // Actualizar el valor del select de las áreas
  updateCategory ( valor: string ): void {
    this.selectedCategory.set(valor as KpiCategory);
  }
}
