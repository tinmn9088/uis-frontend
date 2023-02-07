import {
  CollectionViewer,
  DataSource,
  SelectionChange,
} from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, merge } from 'rxjs';
import { SpecializationService } from './specialization.service';
import { Specialization } from '../models/specialization.model';

export class SpecializationFlatNode {
  constructor(
    public specialization: Specialization,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}

export const getLevel = (node: SpecializationFlatNode) => node.level;

export const isExpandable = (node: SpecializationFlatNode) => node.expandable;

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
    this._specializationService
      .getParents()
      .pipe(
        map(specializations =>
          specializations.map(
            specialization =>
              new SpecializationFlatNode(
                specialization,
                0,
                specialization.hasChildren,
                false
              )
          )
        )
      )
      .subscribe(nodes => (this.data = nodes));
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

      this._specializationService
        .getChildren(node.specialization.id)
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
              new SpecializationFlatNode(
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
