import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecializationListComponent } from './components/specialization-list/specialization-list.component';
import { SharedModule } from '../shared/shared.module';
import { SpecializationTreeViewComponent } from './components/specialization-tree-view/specialization-tree-view.component';
import {
  SpecializationFlatNode,
  getLevel,
  isExpandable,
} from './services/specialization.service';
import { FlatTreeControl } from '@angular/cdk/tree';

@NgModule({
  declarations: [SpecializationListComponent, SpecializationTreeViewComponent],
  imports: [CommonModule, SharedModule],
  providers: [
    {
      provide: FlatTreeControl,
      useValue: new FlatTreeControl<SpecializationFlatNode>(
        getLevel,
        isExpandable
      ),
    },
  ],
})
export class SpecializationModule {}
