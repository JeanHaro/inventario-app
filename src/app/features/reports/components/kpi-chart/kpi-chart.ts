import {
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  viewChild
} from '@angular/core';

// Chart
import {
  Chart,
  ChartType,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'kpi-chart',
  standalone: false,
  templateUrl: './kpi-chart.html',
  styleUrl: './kpi-chart.scss',
})
export class KpiChart implements OnDestroy {
  // TODO: VIEWCHILD
  readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvasRef');

  // TODO: INPUT
  readonly type = input<ChartType>('bar');
  readonly labels = input.required<string[]>();
  readonly label = input<string>('');
  readonly values = input.required<number[]>();
  readonly colors = input<string[]>([]);
  readonly thin = input<boolean>(false);
  readonly radius = input<string>('100%');

  // TODO: PROPIEDADES
  private chartInstance: Chart | null = null;

  // TODO: HOOKS
  constructor() {
    effect(() => {
      this.renderChart( this.labels(), this.values() );
    })
  }

  ngOnDestroy(): void {
    this.chartInstance?.destroy();
  }

  // TODO: MÉTODOS PRIVADOS

  // Genera colores aleatorios para cada render
  private generatePastelColors ( cantidad: number ): string[] {
    return Array.from({ length: cantidad }, () => {
      const tono = Math.floor(Math.random() * 360);

      return `hsl(${tono}, 65%, 80%)`;
    });
  }

  private renderChart ( labels: string[], values: number[] ): void {
    const canvas = this.canvasRef()?.nativeElement;
    if ( !canvas ) return;

    this.chartInstance?.destroy();

    const esLinea = this.type() === 'line';
    const esDoughnut = this.type() === 'doughnut' || this.type() === 'pie';
    const esRadarOBar = this.type() === 'radar' || this.type() === 'bar';

    const chartColors = this.colors().length > 0
      ? this.colors()
      : this.generatePastelColors(values.length);

    this.chartInstance = new Chart(canvas, {
      type: this.type(),
      data: {
        labels,
        datasets: [{
          label: this.label(),
          data: values,
          backgroundColor: esLinea ? chartColors[0] : chartColors,
          borderColor: esLinea ? chartColors[0] : undefined,
          borderWidth: esLinea ? 2 : 1,
          fill: esLinea ? false : undefined,
          tension: esLinea ? 0.3 : undefined,
          barPercentage: this.thin() ? 0.4 : 0.9,
          categoryPercentage: this.thin() ? 0.6 : 0.8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...(esDoughnut ? { radius: this.radius() } : {}),
        animation: true,
        plugins: {
          legend: {
            display: !(
              esRadarOBar ||
              esLinea
            )
          }
        },
      } as any
    });
  }
}
