import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaginatorService } from '../../services/paginator.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-paginator[length][pageSize][pageIndex]',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, AfterViewInit, OnChanges {
  readonly INDEX_BUTTONS_DISPLAYED = 6;

  @Input() length!: number;
  @Input() pageSize!: number;

  /**
   * `[5, 10, 25]` by default.
   */
  @Input() pageSizeOptions?: number[] = [5, 10, 15, 25];

  @Input() pageIndex!: number;
  @Input() hidePageSizeSelect = false;
  @Output() page = new EventEmitter<PageEvent>();
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  pageIndexes?: number[] = [];
  pageSizeFormControl = new FormControl();

  constructor(private _paginatorService: PaginatorService) {}

  ngOnInit() {
    if (!this.pageSizeOptions?.find(size => size === this.pageSize)) {
      this.pageSizeOptions?.unshift(this.pageSize);
    }
    this.pageSizeFormControl.patchValue(this.pageSize);
  }

  ngAfterViewInit() {
    this.pageSizeFormControl.valueChanges.subscribe(pageSize => {
      this.pageSize = pageSize;
      this.matPaginator._changePageSize(pageSize);
      this.matPaginator.firstPage();
    });
  }

  ngOnChanges() {
    setTimeout(() => this.updatePageIndexes(), 0);
  }

  onIndexButtonClick(index: number) {
    if (index === 0) {
      this.matPaginator.pageIndex = index + 1;
      this.matPaginator.previousPage();
    } else {
      this.matPaginator.pageIndex = index - 1;
      this.matPaginator.nextPage();
    }
    this.updatePageIndexes();
  }

  onPageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.page.emit(e);
    this.updatePageIndexes();
  }

  updatePageIndexes() {
    this.pageIndexes = this._paginatorService.generatePageIndexes(
      this.pageIndex,
      this.matPaginator.getNumberOfPages(),
      this.INDEX_BUTTONS_DISPLAYED
    );
    this.pageIndex = this.pageIndex || 0;
  }
}
