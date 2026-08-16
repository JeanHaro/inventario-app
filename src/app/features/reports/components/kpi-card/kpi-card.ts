import { Component, input } from '@angular/core';

// FontAwesome
import { IconDefinition } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'kpi-card',
  standalone: false,
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  // TODO: INPUT
  readonly label = input.required<string>();
  readonly value = input.required<number | string>();
  readonly unit = input<string>('');
  readonly trend = input<number | null>(null);
  readonly icon = input<IconDefinition | null>(null);
}
