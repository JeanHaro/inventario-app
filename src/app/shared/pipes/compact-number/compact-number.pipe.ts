import { Pipe, PipeTransform } from '@angular/core';

type Tipo = 'precio' | 'stock';

@Pipe({
  name: 'compactNumber',
  standalone: true,
})
export class CompactNumberPipe implements PipeTransform {
  private compact ( value: number, divisor: number ): string {
    const resultado = value / divisor;

    return Number.isInteger(resultado)
                      ? resultado.toString()
                      : resultado.toFixed(1);
  }

  private formatPrecio ( value: number ): string {
    if ( value >= 1_000_000_000 ) return `S/. ${this.compact(value, 1_000_000_00)} B`;
    if ( value >= 1_000_000 ) return `S/. ${this.compact(value, 1_000_000)} M`;

    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatStock ( value: number ): string {
    if ( value >= 1_000_000_000 ) return `${this.compact(value, 1_000_000_000)} B`;
    if ( value >= 1_000_000 ) return `${this.compact(value, 1_000_000)} M`;
    if ( value >= 10_000 ) return `${this.compact(value, 1_000)} k`;

    return value.toLocaleString('es-PE');
  }

  transform (
    value: number | null | undefined,
    tipo: Tipo
  ): string {
    const num = value ?? 0;

    return tipo === 'precio'
                ? this.formatPrecio(num)
                : this.formatStock(num)
  }
}
