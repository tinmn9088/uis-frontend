import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryPageableResponse } from '../../domain/category-pageable-response';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CategoryFlatNode } from '../../domain/category-flat-node';
import { CategoryService } from '../../services/category.service';
import {
  CategoryTreeDataSourceService,
  isExpandable,
} from '../../services/category-tree-data-source.service';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss'],
})
export class CategoryTreeComponent implements OnInit {
  isLoading = true;
  noFound = false;
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<CategoryPageableResponse>();

  constructor(
    public treeControl: FlatTreeControl<CategoryFlatNode>,
    public categoryService: CategoryService,
    public dataSource: CategoryTreeDataSourceService
  ) {}

  ngOnInit() {
    this.search();
  }

  hasChild = (_: number, node: CategoryFlatNode) => isExpandable(node);

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
