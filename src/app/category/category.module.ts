import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryTreeComponent } from './components/category-tree/category-tree.component';
import { CategoryTreeNodeComponent } from './components/category-tree-node/category-tree-node.component';
import { SharedModule } from '../shared/shared.module';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CategoryFlatNode } from './domain/category-flat-node';
import {
  getLevel,
  isExpandable,
} from './services/category-tree-data-source.service';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryTreeComponent,
    CategoryTreeNodeComponent,
    CategoryFormComponent,
  ],
  imports: [CommonModule, SharedModule],
  providers: [
    {
      provide: FlatTreeControl,
      useValue: new FlatTreeControl<CategoryFlatNode>(getLevel, isExpandable),
    },
  ],
})
export class CategoryModule {}
