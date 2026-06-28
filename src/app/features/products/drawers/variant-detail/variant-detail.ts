import { Component } from '@angular/core';

// FontAwesome
import {
  faArrowRightFromBracket,
  faBarcode,
  faBoxArchive,
  faBoxesStacked,
  faClose,
  faEllipsis,
  faFileArrowDown,
  faFloppyDisk,
  faPenToSquare,
  faPlus,
  faSpinner,
  faTag,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'variant-detail',
  standalone: false,
  templateUrl: './variant-detail.html',
  styleUrl: './variant-detail.scss',
})
export class VariantDetail {
  // TODO: ICONOS
  readonly faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;
  readonly faPenToSquare: IconDefinition = faPenToSquare;
  readonly faEllipsis: IconDefinition = faEllipsis;
  readonly faFloppyDisk: IconDefinition = faFloppyDisk;
  readonly faClose: IconDefinition = faClose;
  readonly faFileArrowDown: IconDefinition = faFileArrowDown;
  readonly faBoxArchive: IconDefinition = faBoxArchive;
  readonly faBarcode: IconDefinition = faBarcode;
  readonly faSpinner: IconDefinition = faSpinner;
  readonly faBoxesStacked: IconDefinition = faBoxesStacked;
  readonly faTag: IconDefinition = faTag;
  readonly faPlus: IconDefinition = faPlus;
}
