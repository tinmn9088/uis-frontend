import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  SpecializationFlatNode,
  SpecializationTreeDataSourceService,
  isExpandable,
} from '../../services/specialization-tree-data-source.service';
import { SpecializationService } from '../../services/specialization.service';

@Component({
  selector: 'app-specialization-tree',
  templateUrl: './specialization-tree.component.html',
  styleUrls: ['./specialization-tree.component.scss'],
})
export class SpecializationTreeComponent {
  dataSource!: SpecializationTreeDataSourceService;

  constructor(
    public treeControl: FlatTreeControl<SpecializationFlatNode>,
    public specializationService: SpecializationService
  ) {
    this.dataSource = new SpecializationTreeDataSourceService(
      treeControl,
      specializationService
    );
  }

  hasChild = (_: number, node: SpecializationFlatNode) => isExpandable(node);

  search(searchQuery: string) {
    this.dataSource = new SpecializationTreeDataSourceService(
      this.treeControl,
      this.specializationService,
      searchQuery
    );
  }
}
