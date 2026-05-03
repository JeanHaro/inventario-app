import { Component } from '@angular/core';

// Font Awesome
import {
  faAddressCard,
  faGear,
  faPowerOff,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-profile-menu',
  standalone: false,
  templateUrl: './profile-menu.html',
  styleUrl: './profile-menu.scss',
})
export class ProfileMenu {
  // Iconos
  readonly faAdressCard: IconDefinition = faAddressCard;
  readonly faGear: IconDefinition = faGear;
  readonly faPowerOff: IconDefinition = faPowerOff;
}
