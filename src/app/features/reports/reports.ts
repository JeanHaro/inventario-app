import { Component, computed, inject, OnInit, signal } from '@angular/core';

// Servicios
import { InventarioService } from '../products/services/inventario';
import { ReportService } from './services/report';

// Modelos
import { CATEGORY_LIST, Product } from '../products/models/products.model';
import { InventoryReport, InventoryStats } from './models/report.model';

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {
  // ==========================
  // Inyecciones
  // ==========================
  private inventarioService = inject(InventarioService);
  private reportService = inject(ReportService);

  // ==========================
  // Propiedades
  // ==========================

  allProducts: Product[] = [];
  categorias: string[] = [
    'Todas',
    ...CATEGORY_LIST
  ];

  categoriaSeleccionada = signal<string>('Todas');
  reportTitle = signal<string>('');
  // Reportes guardados
  savedReports = signal<InventoryReport[]>([]);

  // ==========================
  // Ciclo de vida
  // ==========================
  ngOnInit(): void {
    this.inventarioService.getProducts().subscribe({
      next: ( resp ) => this.allProducts = resp
    });

    this.savedReports.set(this.reportService.getReports());
  }

  // ==========================
  // Propiedades computadas
  // ==========================

  // Productos filtrados según la categoría seleccionada
  productosFiltrados = computed(() => {
    if (this.categoriaSeleccionada() === 'Todas') return this.allProducts;
    return this.allProducts.filter( p => p.categoria === this.categoriaSeleccionada() );
  });

  // Estadísticas calculadas siempre sobre los productos filtrados
  stats = computed<InventoryStats>(() =>
    this.reportService.generateStats(this.productosFiltrados())
  );

  // ==========================
  // Métodos
  // ==========================
  onCategoriaChange( categoria: string ): void {
    this.categoriaSeleccionada.set(categoria);
  }

  onSaveReport(): void {
    const title = this.reportTitle().trim();
    if (!title) return;

    const activeFilters = this.categoriaSeleccionada() !== 'Todas'
      ? [this.categoriaSeleccionada()]
      : [];

    this.reportService.saveReport(title, this.stats(), ...activeFilters);

    this.savedReports.set(this.reportService.getReports());
    this.reportTitle.set('');
  }

  onDeleteReport( id: number ): void {
    this.reportService.deleteReport(id);

    this.savedReports.set([...this.reportService.getReports()]);
  }
}
