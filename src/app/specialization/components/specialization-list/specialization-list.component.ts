import { Component, ViewChild } from '@angular/core';
import { SpecializationService } from '../../services/specialization.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SpecializationTreeComponent } from '../specialization-tree/specialization-tree.component';
import { PageEvent } from '@angular/material/paginator';
import { SpecializationPageableResponse } from '../../domain/specialization-pageable-response';

@Component({
  selector: 'app-specialization-list',
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.scss'],
})
export class SpecializationListComponent {
  formGroup!: FormGroup;
  @ViewChild(SpecializationTreeComponent)
  specializationTree!: SpecializationTreeComponent;
  totalElements!: number;
  pageSize = 6;
  pageNumber!: number;

  constructor(private _specializationService: SpecializationService) {
    this.formGroup = new FormGroup({
      searchQuery: new FormControl(''),
    });
  }

  get searchQuery(): string {
    return this.formGroup.get('searchQuery')?.value;
  }

  onSearch() {
    setTimeout(() => this.specializationTree.search(this.searchQuery), 0);
  }

  onDataUpdate(response: SpecializationPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    setTimeout(() => this.specializationTree.search(this.searchQuery), 0);
  }
}
