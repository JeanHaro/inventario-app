import { Component, output } from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'products-tools',
  standalone: false,
  templateUrl: './products-tools.html',
  styleUrl: './products-tools.scss',
})
export class ProductsTools {
  // TODO: ICONO
  readonly faPlus: IconDefinition = faPlus;

  // TODO: OUTPUT
  readonly search = output<string>();
  readonly addProduct = output<void>();


  // TODO: MÉTODOS PÚBLICOS
  searchProduct ( value: string ) {
    this.search.emit(value);
  }
}
