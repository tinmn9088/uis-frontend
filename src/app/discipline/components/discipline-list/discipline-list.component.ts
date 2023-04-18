import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DisciplinePageableResponse } from '../../domain/discipline-pageable-response';
import { DisciplineTableComponent } from '../discipline-table/discipline-table.component';
import { Permission } from 'src/app/auth/domain/permission';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-discipline-list',
  templateUrl: './discipline-list.component.html',
  styleUrls: ['./discipline-list.component.scss'],
})
export class DisciplineListComponent {
  formGroup!: FormGroup;
  @ViewChild(DisciplineTableComponent)
  disciplineTable!: DisciplineTableComponent;
  totalElements!: number;
  pageSize = 16;
  arePermissionsPresent: boolean;
  pageNumber!: number;

  constructor(private _authService: AuthService) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.DISCIPLINE_SEARCH,
    ]);
    this.formGroup = new FormGroup({
      searchQuery: new FormControl({
        value: '',
        disabled: !this.arePermissionsPresent,
      }),
    });
  }

  get searchQuery(): string {
    return this.formGroup.get('searchQuery')?.value;
  }

  onSearch() {
    this.disciplineTable.search(this.searchQuery);
  }

  onDataUpdate(response: DisciplinePageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    setTimeout(() => this.disciplineTable.search(this.searchQuery));
  }

  onSortChange() {
    setTimeout(() => this.disciplineTable.search(this.searchQuery));
  }
}
