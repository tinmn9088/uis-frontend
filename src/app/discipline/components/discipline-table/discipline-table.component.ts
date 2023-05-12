import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DisciplinePageableResponse } from '../../domain/discipline-pageable-response';
import { DisciplineService } from '../../services/discipline.service';
import { Sort } from '@angular/material/sort';
import { Discipline } from '../../domain/discipline';
import { CategoryService } from 'src/app/category/services/category.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';

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
  canUserModifyDiscipline: boolean;
  canUserGetCategory: boolean;

  constructor(
    private _disciplineService: DisciplineService,
    private _categoryService: CategoryService,
    private _authService: AuthService
  ) {
    this.canUserModifyDiscipline = this._authService.hasUserPermissions([
      Permission.DISCIPLINE_UPDATE,
    ]);
    this.canUserGetCategory = this._authService.hasUserPermissions([
      Permission.TAG_READ,
    ]);
    if (this.canUserModifyDiscipline) {
      this.displayedColumns.push('operations');
    }
  }

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
      .subscribe(response => {
        this.dataSource = response.content;
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }

  getLinkToFormPage(disciplineId: number): string {
    return this._disciplineService.getLinkToFormPage(disciplineId);
  }

  getLinkToCategoryFormPage(categoryId: number): string {
    return this._categoryService.getLinkToFormPage(categoryId);
  }

  getTableCellStyle() {
    return {
      opacity: this.isLoading ? '0' : '1',
      visibility: this.isLoading ? 'hidden' : 'visible',
      transition: 'opacity 0.1s linear',
    };
  }
}
