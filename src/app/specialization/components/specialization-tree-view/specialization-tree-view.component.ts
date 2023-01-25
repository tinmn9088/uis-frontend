import { Component } from '@angular/core';
import {
  SpecializationFlatNode,
  isExpandable,
} from '../../services/specialization.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SpecializationTreeDataSourceService } from '../../services/specialization-tree-data-source.service';

@Component({
  selector: 'app-specialization-tree-view',
  templateUrl: './specialization-tree-view.component.html',
  styleUrls: ['./specialization-tree-view.component.scss'],
})
export class SpecializationTreeViewComponent {
  constructor(
    public treeControl: FlatTreeControl<SpecializationFlatNode>,
    public dataSource: SpecializationTreeDataSourceService
  ) {}

  hasChild = (_: number, node: SpecializationFlatNode) => isExpandable(node);
}
