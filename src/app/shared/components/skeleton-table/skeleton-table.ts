import { Component, input } from '@angular/core';

// Interfaces
interface SkeletonColumn {
  width: string;   // ej: '4rem', '20%'
  shape?: 'bar' | 'pill' | 'icons'; // forma de la caja
}

@Component({
  selector: 'shared-skeleton-table',
  standalone: true,
  templateUrl: './skeleton-table.html',
  styleUrl: './skeleton-table.scss',
})
export class SkeletonTable {
  // TODO: INPUTS
  readonly rows = input<number>(6);
  readonly columnDefs = input<SkeletonColumn[]>([
    { width: '5rem',  shape: 'bar' },   // checkbox
    { width: '20rem', shape: 'bar' },   // nombre
    { width: '20rem', shape: 'bar' },   // marca/modelo
    { width: '20rem', shape: 'bar' },   // precio
    { width: '20rem', shape: 'bar' },   // descuento
    { width: '20rem', shape: 'pill' },  // categoría
    { width: '20rem', shape: 'pill' },  // estado
    { width: '20rem', shape: 'bar' },   // # variantes
    { width: '20rem', shape: 'icons' }, // acciones
  ]);

  // TODO: GETTERS
  // Helper para iterar N veces en el template sin necesitar un array real
  get rowsArray(): number[] {
    return Array.from({ length: this.rows() });
  }
}
