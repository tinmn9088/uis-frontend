import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  SpecializationTreeDataSourceService,
  isExpandable,
} from '../../services/specialization-tree-data-source.service';
import { SpecializationService } from '../../services/specialization.service';
import { SpecializationPageableResponse } from '../../domain/specialization-pageable-response';
import { SpecializationFlatNode } from '../../domain/specialization-flat-node';

@Component({
  selector: 'app-specialization-tree',
  templateUrl: './specialization-tree.component.html',
  styleUrls: ['./specialization-tree.component.scss'],
})
export class SpecializationTreeComponent implements OnInit {
  isLoading = true;
  noFound = false;
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<SpecializationPageableResponse>();

  constructor(
    public treeControl: FlatTreeControl<SpecializationFlatNode>,
    public specializationService: SpecializationService,
    public dataSource: SpecializationTreeDataSourceService
  ) {
    console.log(treeControl);
  }

  ngOnInit() {
    this.search();
  }

  hasChild = (_: number, node: SpecializationFlatNode) => isExpandable(node);

  search(searchQuery?: string) {
    this.isLoading = true;
    this.dataSource
      .updateData(searchQuery, this.pageSize, this.pageNumber)
      .subscribe(response => {
        this.dataUpdated.emit(response);
        this.isLoading = false;
        this.noFound = response.totalElements === 0;
      });
  }
}
