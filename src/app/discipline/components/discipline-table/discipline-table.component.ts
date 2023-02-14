import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisciplinePageableResponse } from '../../domain/discipline-pageable-response';
import { DisciplineService } from '../../services/discipline.service';

@Component({
  selector: 'app-discipline-table',
  templateUrl: './discipline-table.component.html',
  styleUrls: ['./discipline-table.component.scss'],
})
export class DisciplineTableComponent {
  isLoading = true;
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<DisciplinePageableResponse>();

  constructor(public disciplineService: DisciplineService) {}

  search(searchQuery?: string) {
    // TODO: add data source and implement table
    console.log(`Searching "${searchQuery}"`);
  }
}
