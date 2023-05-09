import { NgModule } from '@angular/core';
import { SpecializationListComponent } from './components/specialization-list/specialization-list.component';
import { SharedModule } from '../shared/shared.module';
import { SpecializationTreeComponent } from './components/specialization-tree/specialization-tree.component';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SpecializationTreeNodeComponent } from './components/specialization-tree-node/specialization-tree-node.component';
import { SpecializationFormComponent } from './components/specialization-form/specialization-form.component';
import { SpecializationFlatNode } from './domain/specialization-flat-node';
import { SpecializationRoutingModule } from './specialization-routing.module';
import {
  SpecializationTreeDataSourceService,
  getLevel,
  isExpandable,
} from './services/specialization-tree-data-source.service';
import { SpecializationService } from './services/specialization.service';

@NgModule({
  declarations: [
    SpecializationListComponent,
    SpecializationTreeComponent,
    SpecializationTreeNodeComponent,
    SpecializationFormComponent,
  ],
  imports: [SharedModule, SpecializationRoutingModule],
  providers: [
    SpecializationService,
    SpecializationTreeDataSourceService,
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
