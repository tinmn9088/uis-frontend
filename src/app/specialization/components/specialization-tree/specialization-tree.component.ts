import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  SpecializationFlatNode,
  SpecializationTreeDataSourceService,
  isExpandable,
} from '../../services/specialization-tree-data-source.service';

@Component({
  selector: 'app-specialization-tree',
  templateUrl: './specialization-tree.component.html',
  styleUrls: ['./specialization-tree.component.scss'],
})
export class SpecializationTreeComponent {
  constructor(
    public treeControl: FlatTreeControl<SpecializationFlatNode>,
    public dataSource: SpecializationTreeDataSourceService
  ) {}

  hasChild = (_: number, node: SpecializationFlatNode) => isExpandable(node);
}
