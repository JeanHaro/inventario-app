import { Component, input, output } from '@angular/core';

// Modelos
import { InventoryReport } from '../../models/report.model';

@Component({
  selector: 'app-reports-table',
  standalone: false,
  templateUrl: './reports-table.html',
  styleUrl: './reports-table.scss',
})
export class ReportsTable {
  reports    = input.required<InventoryReport[]>()
  onDelete   = output<number>()   // emite el id del reporte a eliminar
}
