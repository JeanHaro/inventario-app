import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OtpInput } from './components/otp-input/otp-input';

@NgModule({
  declarations: [OtpInput],
  imports: [CommonModule, FontAwesomeModule],
  exports: [],
})
export class SharedModule {}
