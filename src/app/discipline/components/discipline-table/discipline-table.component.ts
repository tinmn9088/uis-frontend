import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DisciplinePageableResponse } from '../../domain/discipline-pageable-response';
import { DisciplineService } from '../../services/discipline.service';
import { MatSort, Sort } from '@angular/material/sort';
import { Discipline } from '../../domain/discipline';
import { tap } from 'rxjs';

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
  displayedColumns: string[] = ['name', 'shortName', 'categories'];
  isLoading = true;
  dataSource: Discipline[] = [];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _disciplineService: DisciplineService) {}

  ngOnInit() {
    this.search();
  }

  onSortChange(sort: Sort) {
    console.log(sort);
    this.sortChanged.emit(sort);
  }

  search(searchQuery?: string) {
    this.isLoading = true;
    this._disciplineService
      .search(searchQuery || '', this.pageSize, this.pageNumber)
      .pipe(tap(data => console.log(data)))
      .subscribe(response => {
        this.dataSource = response.content;
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }

  getLinkToFormPage(discipline: Discipline): string {
    return this._disciplineService.getLinkToFormPage(discipline.id);
  }
}
