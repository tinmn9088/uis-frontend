import { Component, Input, OnInit } from '@angular/core';
import { CategoryFlatNode } from '../../domain/category-flat-node';
import { CategoryService } from '../../services/category.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-category-tree-node',
  templateUrl: './category-tree-node.component.html',
  styleUrls: ['./category-tree-node.component.scss'],
})
export class CategoryTreeNodeComponent implements OnInit {
  @Input() categoryNode!: CategoryFlatNode;
  panelOpenState = false;
  linkToForm = '/';
  arePermissionsPresent: boolean;

  constructor(
    private _categoryService: CategoryService,
    private _authService: AuthService
  ) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.TAG_UPDATE,
    ]);
  }

  ngOnInit() {
    this.linkToForm = this._categoryService.getLinkToFormPage(
      this.categoryNode.category.id
    );
  }
}
