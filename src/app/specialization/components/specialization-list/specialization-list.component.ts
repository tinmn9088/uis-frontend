import { Component } from '@angular/core';
import { SpecializationService } from '../../services/specialization.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-specialization-list',
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.scss'],
})
export class SpecializationListComponent {
  formGroup!: FormGroup;

  constructor(private _specializationService: SpecializationService) {
    this.formGroup = new FormGroup({
      searchQuery: new FormControl(''),
    });
  }

  get searchQuery(): string {
    return this.formGroup.get('searchQuery')?.value;
  }

  onSearch() {
    console.log(this.searchQuery);
  }
}
