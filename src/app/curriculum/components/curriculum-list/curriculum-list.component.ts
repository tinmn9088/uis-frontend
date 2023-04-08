import { Component, ViewChild } from '@angular/core';
import { CurriculumTableComponent } from '../curriculum-table/curriculum-table.component';
import { HighlightTextService } from 'src/app/shared/services/highlight-text.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CurriculumPageableResponse } from '../../domain/curriculum-pageable-response';
import { PageEvent } from '@angular/material/paginator';

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

  constructor(
    public highlightTextService: HighlightTextService,
    private _authService: AuthService
  ) {
    this.arePermissionsPresent = true; // TODO: add check
  }

  onDataUpdate(response: CurriculumPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    // this.curriculumTable.search(this.searchQuery);
  }

  onSortChange() {
    // this.curriculumTable.search(this.searchQuery);
  }
}
