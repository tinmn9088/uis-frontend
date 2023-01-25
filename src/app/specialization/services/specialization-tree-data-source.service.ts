import {
  CollectionViewer,
  DataSource,
  SelectionChange,
} from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, merge } from 'rxjs';
import {
  SpecializationFlatNode,
  SpecializationService,
} from './specialization.service';

@Injectable({
  providedIn: 'root',
})
export class SpecializationTreeDataSourceService
  implements DataSource<SpecializationFlatNode>
{
  dataChange = new BehaviorSubject<SpecializationFlatNode[]>([]);

  get data(): SpecializationFlatNode[] {
    return this.dataChange.value;
  }

  set data(value: SpecializationFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<SpecializationFlatNode>,
    private _specializationService: SpecializationService
  ) {
    this.data = this._specializationService.initialData();
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<SpecializationFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(
      (change: SelectionChange<SpecializationFlatNode>) => {
        if (change.added || change.removed) {
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

  handleTreeControl(change: SelectionChange<SpecializationFlatNode>) {
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

  toggleNode(node: SpecializationFlatNode, expand: boolean) {
    const index = this.data.indexOf(node);

    if (expand) {
      node.isLoading = true;

      setTimeout(() => {
        const children = this._specializationService.getChildren(
          node.specialization.id
        );

        if (!children) {
          this.dataChange.next(this.data);
          node.isLoading = false;
          return;
        }

        const nodes = children.map(
          specialization =>
            new SpecializationFlatNode(
              specialization,
              node.level + 1,
              this._specializationService.isExpandable(specialization.id)
            )
        );

        console.debug(`New nodes added`, nodes);

        this.data.splice(index + 1, 0, ...nodes);

        this.dataChange.next(this.data);
        node.isLoading = false;
      }, 1000);
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
