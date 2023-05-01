import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  NgZone,
} from '@angular/core';
import { CurriculumDiscipline } from '../../domain/curriculum-discipline';
import { CurriculumService } from '../../services/curriculum.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import { DisciplineService } from 'src/app/discipline/services/discipline.service';

@Component({
  selector: 'app-curriculum-discipline-table[curriculumId]',
  templateUrl: './curriculum-discipline-table.component.html',
  styleUrls: ['./curriculum-discipline-table.component.scss'],
})
export class CurriculumDisciplineTableComponent implements OnInit {
  @Input() curriculumId!: number;
  @Output() dataUpdated = new EventEmitter<CurriculumDiscipline[]>();
  displayedColumns: string[] = [
    'disciplineId',
    'semester',
    'totalHours',
    'lectureHours',
    'practiceHours',
    'labHours',
    'selfStudyHours',
    'testCount',
    'credit',
    'exam',
    'creditUnits',
  ];
  isLoading = true;
  canUserModifyCurriculum: boolean;
  dataSource: CurriculumDiscipline[] = [];

  constructor(
    private _curriculumService: CurriculumService,
    private _disciplineService: DisciplineService,
    private _authService: AuthService,
    private ngZone: NgZone
  ) {
    this.canUserModifyCurriculum = this._authService.hasUserPermissions([
      Permission.CURRICULUM_UPDATE,
    ]);
    if (this.canUserModifyCurriculum) {
      this.displayedColumns.push('operations');
    }
  }

  ngOnInit() {
    this.getAllDisciplines();
  }

  getAllDisciplines() {
    this.isLoading = true;
    this.dataSource = [];
    this._curriculumService
      .getAllDisciplines(this.curriculumId)
      .subscribe(response => {
        this.dataSource = [...response, ...response, ...response, ...response];
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }

  getLinkToDisciplineFormPage(disciplineId: number): string {
    return this._disciplineService.getLinkToFormPage(disciplineId);
  }

  getTableCellStyle(isSticky?: boolean) {
    return isSticky
      ? {
          opacity: this.isLoading ? '0' : '1',
          visibility: this.isLoading ? 'hidden' : 'visible',
          transition: 'opacity 0.1s linear',
          'background-color': 'white',
          'border-right': '1px solid #e0e0e0',
        }
      : {
          opacity: this.isLoading ? '0' : '1',
          visibility: this.isLoading ? 'hidden' : 'visible',
          transition: 'opacity 0.1s linear',
        };
  }

  removeDiscipline(curriculumId: number, disciplineId: number) {
    this._curriculumService.removeDiscipline(curriculumId, disciplineId);
  }
}
