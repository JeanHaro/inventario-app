import { Component } from '@angular/core';

// Font Awesome
import {
  IconDefinition,
  faArrowRightFromBracket,
  faPenToSquare,
  faEllipsis,
  faFileArrowDown,
  faBoxArchive,
  faBoxOpen,
  faFilter,
  faArrowDownShortWide,
  faEye,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faEllipsis: IconDefinition = faEllipsis;
  readonly faFileArrowDown: IconDefinition = faFileArrowDown;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faBoxOpen: IconDefinition = faBoxOpen;
  readonly faFilter: IconDefinition = faFilter;
  readonly faArrowDownShortWide: IconDefinition = faArrowDownShortWide;
  readonly faEye: IconDefinition = faEye;
  readonly faAngleDown: IconDefinition = faAngleDown;
}
