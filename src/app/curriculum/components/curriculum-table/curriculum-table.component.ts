import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurriculumPageableResponse } from '../../domain/curriculum-pageable-response';
import { Sort } from '@angular/material/sort';
import { Curriculum } from '../../domain/curriculum';
import { CurriculumService } from '../../services/curriculum.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-curriculum-table',
  templateUrl: './curriculum-table.component.html',
  styleUrls: ['./curriculum-table.component.scss'],
})
export class CurriculumTableComponent implements OnInit {
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

  constructor(
    private _curriculumService: CurriculumService,
    private _authService: AuthService
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
  }

  onSortChange(sort: Sort) {
    console.log(sort);
    this.sort = sort;
    this.sortChanged.emit(sort);
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
