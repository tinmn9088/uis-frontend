import { Component } from '@angular/core';
import { SpecializationTreeDataSourceService } from '../../services/specialization-tree-data-source.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  SpecializationFlatNode,
  isExpandable,
} from '../../services/specialization.service';

@Component({
  selector: 'app-specialization-list',
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.scss'],
})
export class SpecializationListComponent {
  searchQuery?: string;
  constructor(
    public treeControl: FlatTreeControl<SpecializationFlatNode>,
    public dataSource: SpecializationTreeDataSourceService
  ) {}

  hasChild = (_: number, node: SpecializationFlatNode) => isExpandable(node);
}
