import {
  CollectionViewer,
  DataSource,
  SelectionChange,
} from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { CategoryFlatNode } from '../domain/category-flat-node';
import {
  AsyncSubject,
  BehaviorSubject,
  Observable,
  delay,
  map,
  merge,
  tap,
} from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CategoryService } from './category.service';
import { CategoryPageableResponse } from '../domain/category-pageable-response';

export const getLevel = (node: CategoryFlatNode) => node.level;

export const isExpandable = (node: CategoryFlatNode) => node.expandable;

@Injectable({
  providedIn: 'root',
})
export class CategoryTreeDataSourceService
  implements DataSource<CategoryFlatNode>
{
  dataChange = new BehaviorSubject<CategoryFlatNode[]>([]);
  blockRepeatingTreeControlChanges = false;

  get data(): CategoryFlatNode[] {
    return this.dataChange.value;
  }

  set data(value: CategoryFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<CategoryFlatNode>,
    private _categoryService: CategoryService
  ) {}

  updateData(
    searchQuery?: string,
    size?: number,
    page?: number
  ): AsyncSubject<CategoryPageableResponse> {
    const response$ = searchQuery
      ? this._categoryService.search(searchQuery, size, page)
      : this._categoryService.getParents(size, page);

    const subject = new AsyncSubject<CategoryPageableResponse>();

    response$
      .pipe(
        tap(response => {
          subject.next(response);
          subject.complete();
        }),
        map(response =>
          response.content.map(
            category =>
              new CategoryFlatNode(
                category,
                0,
                category.hasChildren || false, // TODO: remove default value
                false
              )
          )
        )
      )
      .subscribe(nodes => (this.data = nodes));

    return subject;
  }

  connect(collectionViewer: CollectionViewer): Observable<CategoryFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(
      (change: SelectionChange<CategoryFlatNode>) => {
        if (
          !this.blockRepeatingTreeControlChanges &&
          (change.added || change.removed)
        ) {
          this.blockRepeatingTreeControlChanges = true;

          // fix repeating changes events
          setTimeout(() => (this.blockRepeatingTreeControlChanges = false));

          this.handleTreeControl(change);
        }
      }
    );

    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  disconnect(_: CollectionViewer): void {}

  handleTreeControl(change: SelectionChange<CategoryFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  toggleNode(node: CategoryFlatNode, expand: boolean) {
    const index = this.data.indexOf(node);

    if (expand) {
      node.isLoading = true;

      this._categoryService
        .getChildren(node.category.id)
        .pipe(delay(200))
        .subscribe(children => {
          console.debug('Children received', children);

          if (!children || children.length === 0) {
            this.dataChange.next(this.data);
            node.isLoading = false;
            return;
          }

          const nodes = children.map(
            specialization =>
              new CategoryFlatNode(
                specialization,
                node.level + 1,
                specialization.hasChildren
              )
          );

          console.debug(`New nodes added`, nodes);

          this.data.splice(index + 1, 0, ...nodes);

          this.dataChange.next(this.data);
          node.isLoading = false;
        });
    } else {
      let count = 0;
      for (
        let i = index + 1;
        i < this.data.length && this.data[i].level > node.level;
        i++
      ) {
        count++;
      }
      this.data.splice(index + 1, count);
      this.dataChange.next(this.data);
    }
  }
}
