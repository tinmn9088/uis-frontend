import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SpecializationTreeComponent } from '../specialization-tree/specialization-tree.component';
import { PageEvent } from '@angular/material/paginator';
import { SpecializationPageableResponse } from '../../domain/specialization-pageable-response';
import { HighlightTextService } from 'src/app/shared/services/highlight-text.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-specialization-list',
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.scss'],
})
export class SpecializationListComponent implements AfterViewInit {
  private _resizeObserver: ResizeObserver;
  formGroup!: FormGroup;
  @ViewChild(SpecializationTreeComponent)
  specializationTree!: SpecializationTreeComponent;
  totalElements!: number;
  pageSize = 5;
  arePermissionsPresent: boolean;
  pageNumber!: number;

  constructor(
    public highlightTextService: HighlightTextService,
    private _authService: AuthService
  ) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.SPECIALIZATION_SEARCH,
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
