import { OnInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DisciplinePageableResponse } from '../../domain/discipline-pageable-response';
import { DisciplineTableComponent } from '../discipline-table/discipline-table.component';
import { Permission } from 'src/app/auth/domain/permission';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { QueryParamsService } from 'src/app/shared/services/query-params.service';

@Component({
  selector: 'app-discipline-list',
  templateUrl: './discipline-list.component.html',
  styleUrls: ['./discipline-list.component.scss'],
})
export class DisciplineListComponent implements OnInit {
  formGroup!: FormGroup;
  @ViewChild(DisciplineTableComponent)
  disciplineTable!: DisciplineTableComponent;
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
      Permission.DISCIPLINE_SEARCH,
      Permission.DISCIPLINE_READ,
    ]);
    this.formGroup = new FormGroup({
      searchQuery: new FormControl({
        value: '',
        disabled: !this.arePermissionsPresent,
      }),
    });
  }

  ngOnInit() {
    if (this.arePermissionsPresent) {
      this._route.data.subscribe(({ searchQuery, pagination }) => {
        this.formGroup.setValue({ searchQuery }, { emitEvent: false });
        this.pageNumber = pagination.page;
        this.pageSize = pagination.size;
        setTimeout(() => this.disciplineTable.search(this.searchQuery));
      });
    }
  }

  get searchQuery(): string {
    return this.formGroup.get('searchQuery')?.value;
  }

  onSearch() {
    this.pageNumber = 0;
    this._queryParamsService.appendQueryParams(
      this._route,
      this._queryParamsService.mergeParams(
        this._queryParamsService.generatePaginationParam(
          this.pageSize,
          this.pageNumber
        ),
        this._queryParamsService.generateSearchQueryParam(this.searchQuery)
      )
    );
    this.disciplineTable.search(this.searchQuery);
  }

  onDataUpdate(response: DisciplinePageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    setTimeout(() => this.disciplineTable.search(this.searchQuery));
  }

  onSortChange() {
    setTimeout(() => this.disciplineTable.search(this.searchQuery));
  }
}
