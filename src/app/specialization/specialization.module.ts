import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecializationListComponent } from './components/specialization-list/specialization-list.component';
import { SharedModule } from '../shared/shared.module';
import { SpecializationTreeViewComponent } from './components/specialization-tree-view/specialization-tree-view.component';

@NgModule({
  declarations: [SpecializationListComponent, SpecializationTreeViewComponent],
  imports: [CommonModule, SharedModule],
})
export class SpecializationModule {}
