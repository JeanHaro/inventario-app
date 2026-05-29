import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes
import { CompactNumberPipe } from './pipes/compact-number/compact-number.pipe';

@NgModule({
  declarations: [
    CompactNumberPipe
  ],
  imports: [CommonModule],
  exports: [
    CompactNumberPipe
  ],
})
export class SharedModule {}
