import { Component, Input, OnInit } from '@angular/core';
import { CategoryFlatNode } from '../../domain/category-flat-node';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-tree-node',
  templateUrl: './category-tree-node.component.html',
  styleUrls: ['./category-tree-node.component.scss'],
})
export class CategoryTreeNodeComponent implements OnInit {
  @Input() categoryNode!: CategoryFlatNode;
  panelOpenState = false;
  linkToForm = '/';

  constructor(private _categoryService: CategoryService) {}

  ngOnInit() {
    this.linkToForm = this._categoryService.getLinkToFormPage(
      this.categoryNode.category.id
    );
  }
}
