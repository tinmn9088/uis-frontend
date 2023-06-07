import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CurriculumPageableResponse } from '../../domain/curriculum-pageable-response';
import { MatSort, Sort } from '@angular/material/sort';
import { Curriculum } from '../../domain/curriculum';
import { CurriculumService } from '../../services/curriculum.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import { ActivatedRoute } from '@angular/router';
import { QueryParamsService } from 'src/app/shared/services/query-params.service';

@Component({
  selector: 'app-curriculum-table',
  templateUrl: './curriculum-table.component.html',
  styleUrls: ['./curriculum-table.component.scss'],
})
export class CurriculumTableComponent implements OnInit, AfterViewInit {
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<CurriculumPageableResponse>();
  @Output() sortChanged = new EventEmitter<Sort>();
  sort?: Sort;
  displayedColumns: string[] = [
    'id',
    'approvalDate',
    'admissionYear',
    'specializationId',
  ];
  isLoading = true;
  dataSource: Curriculum[] = [];
  canUserModifyCurriculum: boolean;
  canUserDeleteCurriculum: boolean;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    private _curriculumService: CurriculumService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _queryParamService: QueryParamsService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.canUserModifyCurriculum = this._authService.hasUserPermissions([
      Permission.CURRICULUM_UPDATE,
    ]);
    this.canUserDeleteCurriculum = this._authService.hasUserPermissions([
      Permission.CURRICULUM_DELETE,
    ]);
    if (this.canUserModifyCurriculum || this.canUserDeleteCurriculum) {
      this.displayedColumns.push('operations');
    }
  }

  ngOnInit() {
    this.getAll();
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

  getAll() {
    this.isLoading = true;
    this.dataSource = [];
    this._curriculumService
      .getAll(this.pageSize, this.pageNumber, this.sort)
      .subscribe(response => {
        this.dataSource = response.content;
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }

  getLinkToFormPage(id: number): string {
    return this._curriculumService.getLinkToFormPage(id);
  }

  getTableCellStyle() {
    return {
      opacity: this.isLoading ? '0' : '1',
      visibility: this.isLoading ? 'hidden' : 'visible',
      transition: 'opacity 0.1s linear',
    };
  }
}
