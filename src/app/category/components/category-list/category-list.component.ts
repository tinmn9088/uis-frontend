import { AfterViewInit, OnInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryTreeComponent } from '../category-tree/category-tree.component';
import { HighlightTextService } from 'src/app/shared/services/highlight-text.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CategoryPageableResponse } from '../../domain/category-pageable-response';
import { PageEvent } from '@angular/material/paginator';
import { Permission } from 'src/app/auth/domain/permission';
import { ActivatedRoute } from '@angular/router';
import { QueryParamsService } from 'src/app/shared/services/query-params.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  formGroup!: FormGroup;
  @ViewChild(CategoryTreeComponent)
  categoryTree!: CategoryTreeComponent;
  totalElements!: number;
  arePermissionsPresent: boolean;
  pageSize!: number;
  pageNumber!: number;

  constructor(
    public highlightTextService: HighlightTextService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _queryParamsService: QueryParamsService
  ) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.TAG_READ,
    ]);

    this.formGroup = new FormGroup({
      searchQuery: new FormControl({
        value: '',
        disabled: !this.arePermissionsPresent,
      }),
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

  ngOnInit() {
    this._route.data.subscribe(({ searchQuery, pagination }) => {
      this.formGroup.setValue({ searchQuery }, { emitEvent: false });
      this.pageNumber = pagination.page;
      this.pageSize = pagination.size;
      setTimeout(() => this.categoryTree.search(this.searchQuery));
    });
  }

  ngAfterViewInit() {
    const tree = document.querySelector('.list__tree');
    if (tree) {
      this._resizeObserver.observe(tree);
    }
  }

  onSearch() {
    this._queryParamsService.appendSearchQuery(this._route, this.searchQuery);
    setTimeout(() => this.categoryTree.search(this.searchQuery));
  }

  onDataUpdate(response: CategoryPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    setTimeout(() => this.categoryTree.search(this.searchQuery));
  }
}
