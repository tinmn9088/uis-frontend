import {
  AfterViewInit,
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
  displayedColumns: string[] = ['name', 'shortName', 'categories'];
  isLoading = true;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<DisciplinePageableResponse>();
  @Output() sortChanged = new EventEmitter<Sort>();
  dataSource: Discipline[] = [];

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
      .search(searchQuery || '')
      .pipe(tap(data => console.log(data)))
      .subscribe(response => {
        this.dataSource = response.content;
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }
}
