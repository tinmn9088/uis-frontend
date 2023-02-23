import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DisciplinePageableResponse } from '../../domain/discipline-pageable-response';
import { DisciplineService } from '../../services/discipline.service';
import { Sort } from '@angular/material/sort';
import { Discipline } from '../../domain/discipline';
import { delay } from 'rxjs';

@Component({
  selector: 'app-discipline-table',
  templateUrl: './discipline-table.component.html',
  styleUrls: ['./discipline-table.component.scss'],
})
export class DisciplineTableComponent implements OnInit {
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<DisciplinePageableResponse>();
  @Output() sortChanged = new EventEmitter<Sort>();
  sort?: Sort;
  displayedColumns: string[] = ['name', 'shortName', 'categories'];
  isLoading = true;
  dataSource: Discipline[] = [];

  constructor(private _disciplineService: DisciplineService) {}

  ngOnInit() {
    this.search();
  }

  onSortChange(sort: Sort) {
    console.log(sort);
    this.sort = sort;
    this.sortChanged.emit(sort);
  }

  search(searchQuery?: string) {
    this.isLoading = true;
    this.dataSource = [];
    this._disciplineService
      .search(searchQuery || '', this.pageSize, this.pageNumber, this.sort)
      .pipe(delay(1000))
      .subscribe(response => {
        this.dataSource = response.content;
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }

  getLinkToFormPage(discipline: Discipline): string {
    return this._disciplineService.getLinkToFormPage(discipline.id);
  }

  getTableCellStyle() {
    return {
      opacity: this.isLoading ? '0' : '1',
      visibility: this.isLoading ? 'hidden' : 'visible',
      transition: 'opacity 0.1s linear',
    };
  }
}
