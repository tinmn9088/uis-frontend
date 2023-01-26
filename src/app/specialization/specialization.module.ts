import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecializationListComponent } from './components/specialization-list/specialization-list.component';
import { SharedModule } from '../shared/shared.module';
import { SpecializationTreeComponent } from './components/specialization-tree/specialization-tree.component';
import {
  SpecializationFlatNode,
  getLevel,
  isExpandable,
} from './services/specialization.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SpecializationTreeNodeComponent } from './components/specialization-tree-node/specialization-tree-node.component';

@NgModule({
  declarations: [
    SpecializationListComponent,
    SpecializationTreeComponent,
    SpecializationTreeNodeComponent,
  ],
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
