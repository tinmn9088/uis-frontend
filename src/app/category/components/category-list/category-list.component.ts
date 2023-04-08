import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryTreeComponent } from '../category-tree/category-tree.component';
import { HighlightTextService } from 'src/app/shared/services/highlight-text.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CategoryPageableResponse } from '../../domain/category-pageable-response';
import { PageEvent } from '@angular/material/paginator';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements AfterViewInit {
  private _resizeObserver: ResizeObserver;
  formGroup!: FormGroup;
  @ViewChild(CategoryTreeComponent)
  categoryTree!: CategoryTreeComponent;
  totalElements!: number;
  pageSize = 16;
  arePermissionsPresent: boolean;
  pageNumber!: number;

  constructor(
    public highlightTextService: HighlightTextService,
    private _authService: AuthService
  ) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.TAG_GET,
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

  ngAfterViewInit() {
    const tree = document.querySelector('.list__tree');
    if (tree) {
      this._resizeObserver.observe(tree);
    }
  }

  onSearch() {
    setTimeout(() => this.categoryTree.search(this.searchQuery), 0);
  }

  onDataUpdate(response: CategoryPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    setTimeout(() => this.categoryTree.search(this.searchQuery), 0);
  }
}
