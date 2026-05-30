import { Component } from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-products-tools',
  standalone: false,
  templateUrl: './products-tools.html',
  styleUrl: './products-tools.scss',
})
export class ProductsTools {
  // Iconos
  readonly faPlus: IconDefinition = faPlus;
}
