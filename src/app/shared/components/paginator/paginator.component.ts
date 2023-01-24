import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaginatorService } from '../../services/paginator.service';

@Component({
  selector: 'app-paginator[length][pageSize][pageIndex]',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements AfterViewInit {
  readonly INDEX_BUTTONS_DISPLAYED = 6;

  @Input() length!: number;
  @Input() pageSize!: number;
  @Input() pageIndex!: number;
  @Output() page = new EventEmitter<PageEvent>();
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  pageIndexes?: number[] = [];

  constructor(
    private _paginatorService: PaginatorService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.updatePageIndexes();
    this._changeDetectorRef.detectChanges();
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
  }
}
