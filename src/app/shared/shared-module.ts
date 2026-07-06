import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SkeletonTable } from './components/skeleton-table/skeleton-table';

@NgModule({
  declarations: [SkeletonTable],
  imports: [CommonModule, FontAwesomeModule],
  exports: [],
})
export class SharedModule {}
