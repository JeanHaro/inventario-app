import { Service, signal } from '@angular/core';

// FontAwesome
import {
  faArrowsRotate,
  faArrowTrendDown,
  faArrowTrendUp,
  faBan,
  faBoxArchive,
  faBoxesStacked,
  faBoxOpen,
  faLayerGroup,
  faListOl,
  faPenToSquare,
  faPercent,
  faPlus,
  faSackDollar,
  faTag,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import {
  KpiValue,
  KpiChartConfig,
  KpiPeriod
} from '../models/kpi.model';
import {
  CATEGORY_LIST,
  PRODUCT_STATES,
  VARIANT_STATES
} from '../../products/models/products.model';

@Service()
export class ReportService {

  // TODO: SIGNALS
  // Transformando nuestra lista de categorias, estados de producto y variante con capitalize
  private readonly categories_list = signal(CATEGORY_LIST.map(
    category => category[0].toUpperCase() + category.slice(1).toLowerCase()
  ));

  private readonly states_product = signal(PRODUCT_STATES.map(
    state => state[0].toUpperCase() + state.slice(1).toLowerCase()
  ));

  private readonly states_variant = signal(VARIANT_STATES.map(
    state => state[0].toUpperCase() + state.slice(1).toLowerCase()
  ));

  // TODO: MÉTODOS PÚBLICOS

  // ========================================================= INVENTARIO

  getInventoryKpis ( period: KpiPeriod ): KpiValue[] {
    return [
      {
        label: 'Valor total del inventario',
        value: 45230,
        unit: 'soles',
        icon: faSackDollar
      },
      {
        label: 'Unidades en stock',
        value: 1284,
        unit: 'uds',
        icon: faBoxesStacked
      },
      {
        label: 'Productos con stock bajo',
        value: 6,
        icon: faTriangleExclamation
      },
      {
        label: 'Productos agotados',
        value: 3,
        icon: faBan
      },
    ];
  }

  getInventoryCharts ( period: KpiPeriod ): KpiChartConfig[] {
    return [
      {
        title: 'Distribución de stock por estado',
        type: 'doughnut',
        data: {
          labels: this.states_product(),
          values: [42, 6, 3, 5, 18, 10]
        }
      },
      {
        title: 'Distribución de stock por categoría',
        type: 'bar',
        data: {
          labels: this.categories_list(),
          values: [180, 95, 60, 40, 25, 70, 55, 48, 30, 20, 90, 15, 35, 42, 18]
        },
      },
      {
        title: 'Valor de inventario por categoría',
        type: 'bar',
        data: {
          labels: this.categories_list(),
          values: [12000, 8000, 5000, 1000, 800, 3000, 5000, 4500, 3500, 2200, 2300, 3100, 2800, 1500, 700]
        }
      },
      {
        title: 'Valor de inventario por estado',
        type: 'pie',
        data: {
          labels: this.states_product(),
          values: [32000, 1500, 4200, 800, 3900, 2830]
        }
      },
      {
        title: 'Distribución de stock por estado de las variantes',
        type: 'doughnut',
        data: {
          labels: this.states_variant(),
          values: [88, 12, 5, 4]
        }
      },
      {
        title: 'Valor de inventario de las variantes por estado',
        type: 'doughnut',
        data: {
          labels: this.states_variant(),
          values: [39000, 0, 2100, 900]
        }
      },
    ];
  }

  // ========================================================= CATÁLOGO

  getCatalogKpis ( period: KpiPeriod ): KpiValue[] {
    return [
      {
        label: 'Total de productos',
        value: 51,
        icon: faBoxOpen
      },
      {
        label: 'Total de variantes',
        value: 118,
        icon: faLayerGroup
      },
      {
        label: 'Promedio variantes/producto',
        value: 2.3,
        icon: faListOl
      },
    ];
  }

  getCatalogCharts ( period: KpiPeriod ): KpiChartConfig[] {
    return [
      {
        title: 'Productos por categoría',
        type: 'bar',
        data: {
          labels: this.categories_list(),
          values: [12, 8, 5, 4, 3, 8, 5, 6, 3, 2, 10, 1, 3, 5, 2]
        }
      },
      {
        title: 'Productos por estado',
        type: 'doughnut',
        data: {
          labels: this.states_product(),
          values: [42, 3, 4, 2, 5, 3]
        }
      },
      {
        title: 'Variantes por estado',
        type: 'doughnut',
        data: {
          labels: this.states_variant(),
          values: [88, 12, 5, 4]
        }
      },
      {
        title: 'Productos por número de variantes',
        type: 'radar',
        data: {
          labels: ['0-1', '2-3', '4-5', '6-10', '10+'],
          values: [14, 22, 9, 4, 2]
        }
      },
      {
        title: 'Promedio de variantes por producto, según estado',
        type: 'pie',
        data: {
          labels: this.states_product(),
          values: [2.6, 1.2, 1.8, 0.5, 2.1, 1.4]
        }
      },
      {
        title: 'Promedio de variantes por producto, según categoría',
        type: 'bar',
        data: {
          labels: this.categories_list(),
          values: [3.1, 2.4, 1.9, 1.5, 1.2, 2.0, 1.7, 1.6, 1.3, 1.1, 2.8, 1.0, 1.4, 1.9, 1.1]
        }
      },
    ];
  }

  // ========================================================= PRECIOS

  getPricingKpis ( period: KpiPeriod ): KpiValue[] {
    return [
      {
        label: 'Precio promedio',
        value: 187,
        unit: 'soles',
        icon: faTag
      },
      {
        label: 'Producto más caro',
        value: 999,
        unit: 'soles',
        icon: faSackDollar
      },
      {
        label: 'Producto más barato',
        value: 25,
        unit: 'soles',
        icon: faArrowTrendDown
      },
      {
        label: 'Variante más cara',
        value: 45,
        unit: 'soles',
        icon: faArrowTrendUp
      },
      {
        label: 'Variante más barata',
        value: 0,
        unit: 'soles',
        icon: faArrowTrendDown
      },
      {
        label: 'Con descuento activo',
        value: 7,
        icon: faPercent
      },
      {
        label: 'Descuento promedio',
        value: 12,
        unit: '%',
        icon: faPercent
      },
    ];
  }

  getPricingCharts ( period: KpiPeriod ): KpiChartConfig[] {
    return [
      {
        title: 'Distribución de precios',
        type: 'radar',
        data: {
          labels: ['S/ 0-50', 'S/ 51-150', 'S/ 151-300', 'S/ 301-500', 'S/ 500+'],
          values: [14, 20, 10, 5, 2]
        }
      },
      {
        title: 'Precio promedio por estado',
        type: 'bar',
        data: {
          labels: this.states_product(),
          values: [210, 150, 180, 90, 195, 160]
        }
      },
      {
        title: 'Distribución de precios de variantes',
        type: 'radar',
        data: {
          labels: ['S/ 0-10', 'S/ 11-30', 'S/ 31-60', 'S/ 60+'],
          values: [65, 30, 15, 8]
        }
      },
      {
        title: 'Precio promedio por categoría',
        type: 'bar',
        data: {
          labels: this.categories_list(),
          values: [320, 210, 95, 140, 60, 180, 150, 130, 110, 85, 240, 55, 100, 175, 70]
        }
      },
      {
        title: 'Distribución de descuento de productos',
        type: 'radar',
        data: {
          labels: ['0%', '1-10%', '11-20%', '21-30%', '30%+'],
          values: [44, 3, 20, 10, 1]
        }
      },
      {
        title: 'Precio adicional promedio de variantes por estado',
        type: 'bar',
        data: {
          labels: this.states_variant(),
          values: [8.5, 0, 12, 3]
        }
      }
    ];
  }

  // ========================================================= ACTIVIDAD

  getActivityKpis ( period: KpiPeriod ): KpiValue[] {
    return [
      {
        label: 'Productos creados',
        value: 4,
        icon: faPlus
      },
      {
        label: 'Variantes creadas',
        value: 9,
        icon: faPlus
      },
      {
        label: 'Productos actualizados',
        value: 11,
        icon: faPenToSquare
      },
      {
        label: 'Variantes actualizadas',
        value: 26,
        icon: faPenToSquare
      },
      {
        label: 'Cambios de stock',
        value: 22,
        icon: faArrowsRotate
      },
      {
        label: 'Archivados',
        value: 2, icon:
        faBoxArchive
      },
      {
        label: 'Desarchivados',
        value: 1,
        icon: faBoxOpen
      },
    ];
  }

  getActivityCharts ( period: KpiPeriod ): KpiChartConfig[] {
    return [
      {
        title: 'Movimientos de la semana',
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          values: [3, 5, 2, 8, 4, 1, 0]
        }
      },
      {
        title: 'Utilización de la IA Invy',
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          values: [1, 3, 0, 6, 2, 0, 1]
        }
      },
    ];
  }
}
