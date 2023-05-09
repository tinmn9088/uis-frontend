import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurriculumDiscipline } from '../../domain/curriculum-discipline';
import { CurriculumDisciplineFormComponent } from '../curriculum-discipline-form/curriculum-discipline-form.component';

@Component({
  selector: 'app-curriculum-discipline-dialog',
  templateUrl: './curriculum-discipline-dialog.component.html',
  styleUrls: ['./curriculum-discipline-dialog.component.scss'],
})
export class CurriculumDisciplineDialogComponent {
  editMode: boolean;
  isFormInvalid = true;
  actionPerformed = false;
  @ViewChild(CurriculumDisciplineFormComponent)
  curriculumDisciplineForm!: CurriculumDisciplineFormComponent;

  constructor(
    private _dialogRef: MatDialogRef<CurriculumDisciplineFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      curriculumId: number;
      curriculumDiscipline?: CurriculumDiscipline;
    }
  ) {
    this.editMode =
      !!this.data.curriculumDiscipline &&
      !!this.data.curriculumDiscipline.disciplineId;
  }

  onCreateUpdateButtonClicked() {
    this.curriculumDisciplineForm.submit();
  }

  onCurriculumDisciplineCreatedUpdated() {
    this.actionPerformed = true;
    if (!this.editMode) this._dialogRef.close(this.actionPerformed);
  }
}
