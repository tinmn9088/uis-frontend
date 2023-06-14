import {
  Component,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { DisciplinePageableResponse } from '../../domain/discipline-pageable-response';
import { DisciplineService } from '../../services/discipline.service';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Discipline } from '../../domain/discipline';
import { CategoryService } from 'src/app/category/services/category.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import { ActivatedRoute } from '@angular/router';
import { QueryParamsService } from 'src/app/shared/services/query-params.service';

@Component({
  selector: 'app-discipline-table',
  templateUrl: './discipline-table.component.html',
  styleUrls: ['./discipline-table.component.scss'],
})
export class DisciplineTableComponent implements OnInit, AfterViewInit {
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<DisciplinePageableResponse>();
  @Output() sortChanged = new EventEmitter<Sort>();
  sort?: Sort;
  displayedColumns: string[] = ['name', 'shortName', 'categories'];
  isLoading = true;
  dataSource: Discipline[] = [];
  canUserModifyDiscipline: boolean;
  canUserDeleteDiscipline: boolean;
  canUserGetCategory: boolean;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatSortHeader) matSortHeader!: MatSortHeader;

  constructor(
    private _disciplineService: DisciplineService,
    private _categoryService: CategoryService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _queryParamService: QueryParamsService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.canUserModifyDiscipline = this._authService.hasUserPermissions([
      Permission.DISCIPLINE_UPDATE,
    ]);
    this.canUserDeleteDiscipline = this._authService.hasUserPermissions([
      Permission.DISCIPLINE_DELETE,
    ]);
    this.canUserGetCategory = this._authService.hasUserPermissions([
      Permission.TAG_READ,
    ]);
    if (this.canUserModifyDiscipline || this.canUserDeleteDiscipline) {
      this.displayedColumns.push('operations');
    }
  }

  ngOnInit() {
    this._route.data.subscribe(({ sort }) => {
      if (sort && this.displayedColumns.includes(sort.active)) {
        this.sort = sort;
      }
    });
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.matSort.active = this.sort.active;
      this.matSort.direction = this.sort.direction;
      this._changeDetectorRef.detectChanges();
    }
  }

  onSortChange(sort: Sort) {
    this.sort = sort;
    this.sortChanged.emit(sort);
    this._queryParamService.appendSort(this._route, sort);
  }

  search(searchQuery?: string) {
    this.isLoading = true;
    this.dataSource = [];
    this._disciplineService
      .search(searchQuery || '', this.pageSize, this.pageNumber, this.sort)
      .subscribe({
        next: response => {
          this.dataSource = response.content;
          this.isLoading = false;
          this.dataUpdated.emit(response);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  getLinkToFormPage(disciplineId: number): string {
    return this._disciplineService.getLinkToFormPage(disciplineId);
  }

  getLinkToCategoryFormPage(categoryId: number): string {
    return this._categoryService.getLinkToFormPage(categoryId);
  }

  getTableCellStyle() {
    return {
      opacity: this.isLoading ? '0' : '1',
      visibility: this.isLoading ? 'hidden' : 'visible',
      transition: 'opacity 0.1s linear',
    };
  }
}
