import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
export class PaginatorComponent implements OnChanges {
  readonly INDEX_BUTTONS_DISPLAYED = 6;

  @Input() length!: number;
  @Input() pageSize!: number;
  @Input() pageIndex!: number;
  @Output() page = new EventEmitter<PageEvent>();
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  pageIndexes?: number[] = [];

  constructor(private _paginatorService: PaginatorService) {}

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
  }
}
