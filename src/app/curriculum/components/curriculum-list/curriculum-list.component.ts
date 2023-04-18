import { Component, ViewChild } from '@angular/core';
import { CurriculumTableComponent } from '../curriculum-table/curriculum-table.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CurriculumPageableResponse } from '../../domain/curriculum-pageable-response';
import { PageEvent } from '@angular/material/paginator';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-curriculum-list',
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['./curriculum-list.component.scss'],
})
export class CurriculumListComponent {
  @ViewChild(CurriculumTableComponent)
  curriculumTable!: CurriculumTableComponent;
  totalElements!: number;
  pageSize = 16;
  arePermissionsPresent: boolean;
  pageNumber!: number;

  constructor(private _authService: AuthService) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.CURRICULUM_GET,
    ]);
  }

  onDataUpdate(response: CurriculumPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    setTimeout(() => this.curriculumTable.getAll());
  }

  onSortChange() {
    setTimeout(() => this.curriculumTable.getAll());
  }
}
