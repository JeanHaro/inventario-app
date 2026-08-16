// Chartjs
import { ChartType } from 'chart.js';

// FontAwesome
import {
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

// Periodos
export type KpiPeriod = 'dia' | 'semana' | 'mes';
// Áreas de KPI
export type KpiCategory = 'inventario' | 'catalogo' | 'precios' | 'actividad';

// El valor de los kpis sin gráfico
export interface KpiValue {
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  icon?: IconDefinition;
}

// La data que tendrá los charts
export interface KpiChartData {
  labels: string[];
  values: number[];
}

// El resultado de los charts con gráfico
export interface KpiChartConfig {
  title: string;
  type: ChartType;
  data: KpiChartData;
}
