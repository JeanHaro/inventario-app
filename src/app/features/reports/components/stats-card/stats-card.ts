import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: false,
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.scss',
})
export class StatsCard {
  // inputs que recibe:
  label  = input.required<string>()   // Ej: "Total Productos"
  value  = input.required<string | number>() // Ej: 4 o "$3,605"
  icon   = input<string>('📊')        // Emoji del icono, default '📊'
  color  = input<string>('blue')      // 'blue' | 'green' | 'orange' | 'gray'

}
