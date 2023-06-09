import { Component, OnInit, ViewChild } from '@angular/core';
import { CurriculumTableComponent } from '../curriculum-table/curriculum-table.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CurriculumPageableResponse } from '../../domain/curriculum-pageable-response';
import { PageEvent } from '@angular/material/paginator';
import { Permission } from 'src/app/auth/domain/permission';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CurriculumSearchFilter } from '../../domain/curriculum-search-filter';
import { QueryParamsService } from 'src/app/shared/services/query-params.service';

@Component({
  selector: 'app-curriculum-list',
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['./curriculum-list.component.scss'],
})
export class CurriculumListComponent implements OnInit {
  formGroup: FormGroup;
  @ViewChild(CurriculumTableComponent)
  curriculumTable!: CurriculumTableComponent;
  totalElements!: number;
  arePermissionsPresent: boolean;
  pageSize!: number;
  pageNumber!: number;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _queryParamsService: QueryParamsService
  ) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.CURRICULUM_SEARCH,
      Permission.CURRICULUM_READ,
    ]);
    this.formGroup = new FormGroup({
      admissionYearBegin: new FormControl({
        value: undefined,
        disabled: !this.arePermissionsPresent,
      }),
      admissionYearEnd: new FormControl({
        value: undefined,
        disabled: !this.arePermissionsPresent,
      }),
      approvalDateBegin: new FormControl({
        value: undefined,
        disabled: !this.arePermissionsPresent,
      }),
      approvalDateEnd: new FormControl({
        value: undefined,
        disabled: !this.arePermissionsPresent,
      }),
    });
  }

  get approvalDateBegin(): Date {
    return this.formGroup.get('approvalDateBegin')?.value;
  }

  get approvalDateEnd(): Date {
    return this.formGroup.get('approvalDateEnd')?.value;
  }

  get admissionYearBegin(): number {
    return this.formGroup.get('admissionYearBegin')?.value;
  }

  get admissionYearEnd(): number {
    return this.formGroup.get('admissionYearEnd')?.value;
  }

  ngOnInit() {
    if (this.arePermissionsPresent) {
      this._route.data.subscribe(({ pagination }) => {
        this.pageNumber = pagination.page;
        this.pageSize = pagination.size;
        setTimeout(() => this.curriculumTable.search());
      });
    }
  }

  onSearch() {
    const filter: CurriculumSearchFilter = {
      admissionYearBegin: this.admissionYearBegin,
      admissionYearEnd: this.admissionYearEnd,
      approvalDateBegin: this.approvalDateBegin,
      approvalDateEnd: this.approvalDateEnd,
    };
    this.curriculumTable.search(filter);
  }

  onDataUpdate(response: CurriculumPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    setTimeout(() => this.curriculumTable.search());
  }

  onSortChange() {
    setTimeout(() => this.curriculumTable.search());
  }
}
