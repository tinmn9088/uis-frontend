import { Component, ViewChild } from '@angular/core';
import { SpecializationService } from '../../services/specialization.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SpecializationTreeComponent } from '../specialization-tree/specialization-tree.component';

@Component({
  selector: 'app-specialization-list',
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.scss'],
})
export class SpecializationListComponent {
  formGroup!: FormGroup;
  @ViewChild(SpecializationTreeComponent)
  specializationTree!: SpecializationTreeComponent;

  constructor(private _specializationService: SpecializationService) {
    this.formGroup = new FormGroup({
      searchQuery: new FormControl(''),
    });
  }

  get searchQuery(): string {
    return this.formGroup.get('searchQuery')?.value;
  }

  onSearch() {
    console.debug('Searching', this.searchQuery);
    this.specializationTree.search(this.searchQuery);
  }
}
