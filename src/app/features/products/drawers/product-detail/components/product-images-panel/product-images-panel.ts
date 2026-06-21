import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-images-panel',
  standalone: false,
  templateUrl: './product-images-panel.html',
  styleUrl: './product-images-panel.scss',
})
export class ProductImagesPanel {
  // TODO: INPUT
  readonly images = input.required<string[]>();
}
