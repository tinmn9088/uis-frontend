import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SpecializationTreeComponent } from '../specialization-tree/specialization-tree.component';
import { PageEvent } from '@angular/material/paginator';
import { SpecializationPageableResponse } from '../../domain/specialization-pageable-response';
import { HighlightTextService } from 'src/app/shared/services/highlight-text.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import { ActivatedRoute } from '@angular/router';
import { QueryParamsService } from 'src/app/shared/services/query-params.service';

@Component({
  selector: 'app-specialization-list',
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.scss'],
})
export class SpecializationListComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  formGroup!: FormGroup;
  @ViewChild(SpecializationTreeComponent)
  specializationTree!: SpecializationTreeComponent;
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
      Permission.SPECIALIZATION_SEARCH,
      Permission.SPECIALIZATION_READ,
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
      setTimeout(() => this.specializationTree.search(this.searchQuery));
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
    setTimeout(() => this.specializationTree.search(this.searchQuery));
  }

  onDataUpdate(response: SpecializationPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    setTimeout(() => this.specializationTree.search(this.searchQuery));
  }
}
