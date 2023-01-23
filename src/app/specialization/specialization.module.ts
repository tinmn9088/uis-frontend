import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecializationListComponent } from './components/specialization-list/specialization-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SpecializationListComponent],
  imports: [CommonModule, SharedModule],
})
export class SpecializationModule {}
