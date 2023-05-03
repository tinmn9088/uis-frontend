import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurriculumDiscipline } from '../../domain/curriculum-discipline';
import { CurriculumService } from '../../services/curriculum.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import { DisciplineService } from 'src/app/discipline/services/discipline.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CurriculumDisciplineDialogComponent } from '../curriculum-discipline-dialog/curriculum-discipline-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-curriculum-discipline-table[curriculumId]',
  templateUrl: './curriculum-discipline-table.component.html',
  styleUrls: ['./curriculum-discipline-table.component.scss'],
})
export class CurriculumDisciplineTableComponent implements OnInit {
  private _dialogRef?: MatDialogRef<
    CurriculumDisciplineDialogComponent,
    unknown
  >;
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
    private _matDialog: MatDialog,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService
  ) {
    this.canUserModifyCurriculum = this._authService.hasUserPermissions([
      Permission.CURRICULUM_UPDATE,
    ]);
    if (this.canUserModifyCurriculum) {
      this.displayedColumns.push('operations');
    }
  }

  ngOnInit() {
    this.updateData();
  }

  updateData() {
    this.isLoading = true;
    this.dataSource = [];
    this._curriculumService
      .getAllDisciplines(this.curriculumId)
      .subscribe(response => {
        this.dataSource = response;
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
    this._curriculumService
      .removeDiscipline(curriculumId, disciplineId)
      .subscribe({
        next: () => {
          this._translate
            .get(
              'curricula.form.disciplines.table.snackbar_remove_success_message'
            )
            .subscribe(message => {
              this._snackbarService.showSuccess(message);
            });
        },
        error: error => {
          this._translate
            .get(
              'curricula.form.disciplines.table.snackbar_remove_error_message'
            )
            .subscribe(message => {
              console.error(error);
              this._snackbarService.showError(message);
            });
        },
        complete: () => {
          this.updateData();
        },
      });
  }

  openCurriculumDisciplineFormDialog(
    curriculumDiscipline: CurriculumDiscipline
  ) {
    this._dialogRef = this._matDialog.open(
      CurriculumDisciplineDialogComponent,
      {
        data: {
          curriculumId: curriculumDiscipline.curriculumId,
          curriculumDiscipline,
        },
      }
    );
    this._dialogRef.afterClosed().subscribe(actionPerformed => {
      if (actionPerformed) this.updateData();
    });
  }
}
