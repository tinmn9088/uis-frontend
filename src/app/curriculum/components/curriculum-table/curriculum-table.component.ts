import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurriculumPageableResponse } from '../../domain/curriculum-pageable-response';
import { Sort } from '@angular/material/sort';
import { Curriculum } from '../../domain/curriculum';
import { CurriculumService } from '../../services/curriculum.service';

@Component({
  selector: 'app-curriculum-table',
  templateUrl: './curriculum-table.component.html',
  styleUrls: ['./curriculum-table.component.scss'],
})
export class CurriculumTableComponent implements OnInit {
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<CurriculumPageableResponse>();
  @Output() sortChanged = new EventEmitter<Sort>();
  sort?: Sort;
  displayedColumns: string[] = [
    'id',
    'approvalDate',
    'admissionYear',
    'specializationId',
  ];
  isLoading = true;
  dataSource: Curriculum[] = [];

  constructor(private _curriculumService: CurriculumService) {}

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
    this._curriculumService
      .getAll(searchQuery || '', this.pageSize, this.pageNumber) // TODO: call search()
      .subscribe(response => {
        this.dataSource = response.content;
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }

  getLinkToFormPage(curriculum: Curriculum): string {
    return this._curriculumService.getLinkToFormPage(curriculum.id);
  }

  getTableCellStyle() {
    return {
      opacity: this.isLoading ? '0' : '1',
      visibility: this.isLoading ? 'hidden' : 'visible',
      transition: 'opacity 0.1s linear',
    };
  }
}
