import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { HighlightTextService } from 'src/app/shared/services/highlight-text.service';
import { DisciplinePageableResponse } from '../../domain/discipline-pageable-response';
import { DisciplineTableComponent } from '../discipline-table/discipline-table.component';

@Component({
  selector: 'app-discipline-list',
  templateUrl: './discipline-list.component.html',
  styleUrls: ['./discipline-list.component.scss'],
})
export class DisciplineListComponent implements AfterViewInit {
  private _resizeObserver: ResizeObserver;
  formGroup!: FormGroup;
  @ViewChild(DisciplineTableComponent)
  disciplineTable!: DisciplineTableComponent;
  totalElements!: number;
  pageSize = 16;
  pageNumber!: number;

  constructor(public highlightTextService: HighlightTextService) {
    this.formGroup = new FormGroup({
      searchQuery: new FormControl(''),
    });
    this._resizeObserver = new ResizeObserver(entries => {
      setTimeout(
        () =>
          this.highlightTextService.highlight(
            this.searchQuery,
            entries[0].target
          ),
        0
      );
    });
  }

  get searchQuery(): string {
    return this.formGroup.get('searchQuery')?.value;
  }

  ngAfterViewInit() {
    const table = document.querySelector('.discipline-list__table');
    if (table) {
      this._resizeObserver.observe(table);
    }
  }

  onSearch() {
    this.disciplineTable.search(this.searchQuery);
  }

  onDataUpdate(response: DisciplinePageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.disciplineTable.search(this.searchQuery);
  }

  onSortChange() {
    this.disciplineTable.search(this.searchQuery);
  }
}
