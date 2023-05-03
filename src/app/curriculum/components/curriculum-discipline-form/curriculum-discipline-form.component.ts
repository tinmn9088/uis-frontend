import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurriculumDiscipline } from '../../domain/curriculum-discipline';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { delay, distinctUntilChanged, map, tap } from 'rxjs';
import { DisciplineService } from 'src/app/discipline/services/discipline.service';
import { SelectOption } from 'src/app/shared/domain/select-option';
import { CurriculumDisciplineAddRequest } from '../../domain/curriculum-discipline-add-request';
import { CurriculumDisciplineUpdateRequest } from '../../domain/curriculum-discipline-update-request';
import { CurriculumService } from '../../services/curriculum.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { SnackbarAction } from 'src/app/shared/domain/snackbar-action';

@Component({
  selector: 'app-curriculum-discipline-form[curriculumId]',
  templateUrl: './curriculum-discipline-form.component.html',
  styleUrls: ['./curriculum-discipline-form.component.scss'],
})
export class CurriculumDisciplineFormComponent implements OnInit {
  private readonly TotalHoursValidator: ValidatorFn = (
    control: AbstractControl
  ) => {
    if (!this.formGroup) {
      return null;
    }
    const totalHoursMin =
      this.lectureHours +
      this.practiceHours +
      this.labHours +
      this.selfStudyHours;
    if (control.value < totalHoursMin) {
      return { invalidTotalHours: true };
    }
    return null;
  };

  areNotPermissionsPresent: boolean;
  editMode!: boolean;
  formGroup!: FormGroup;
  disciplineOptions!: SelectOption[];
  areDisciplineOptionsLoading = false;
  @Input() curriculumDiscipline?: CurriculumDiscipline;
  @Input() curriculumId!: number;
  @Output() curricululDisciplineCreatedUpdated =
    new EventEmitter<CurriculumDiscipline>();
  @Output() formInvalid = new EventEmitter<boolean>();

  constructor(
    private _authService: AuthService,
    private _curriculumService: CurriculumService,
    private _disciplineService: DisciplineService,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService
  ) {
    this.areNotPermissionsPresent = !this._authService.hasUserPermissions([
      Permission.CURRICULUM_UPDATE,
    ]);
  }

  get disciplineId(): number {
    return this.formGroup.get('disciplineId')?.value;
  }

  get semester(): number {
    return this.formGroup.get('semester')?.value;
  }

  get totalHours(): number {
    return this.formGroup.get('totalHours')?.value;
  }

  get lectureHours(): number {
    return this.formGroup.get('lectureHours')?.value;
  }

  get practiceHours(): number {
    return this.formGroup.get('practiceHours')?.value;
  }

  get labHours(): number {
    return this.formGroup.get('labHours')?.value;
  }

  get selfStudyHours(): number {
    return this.formGroup.get('selfStudyHours')?.value;
  }

  get testCount(): number {
    return this.formGroup.get('testCount')?.value;
  }

  get hasCredit(): boolean {
    return this.formGroup.get('hasCredit')?.value;
  }

  get hasExam(): boolean {
    return this.formGroup.get('hasExam')?.value;
  }

  get creditUnits(): number {
    return this.formGroup.get('creditUnits')?.value;
  }

  ngOnInit() {
    this.editMode =
      !!this.curriculumDiscipline && !!this.curriculumDiscipline.disciplineId;

    this.formGroup = new FormGroup({
      disciplineId: new FormControl(undefined, Validators.required),
      semester: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(8),
      ]),
      lectureHours: new FormControl(undefined, Validators.min(1)),
      practiceHours: new FormControl(undefined, Validators.min(1)),
      labHours: new FormControl(undefined, Validators.min(1)),
      selfStudyHours: new FormControl(undefined, Validators.min(1)),
      totalHours: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
        this.TotalHoursValidator,
      ]),
      testCount: new FormControl(undefined, Validators.min(1)),
      hasCredit: new FormControl(false),
      hasExam: new FormControl(false),
      creditUnits: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
      ]),
    });
    this.formGroup.valueChanges
      .pipe(
        map(() => this.formGroup.invalid),
        distinctUntilChanged()
      )
      .subscribe(invalid => {
        this.formInvalid.emit(invalid);
      });
    this.updateDisciplineOptions();
    if (this.curriculumDiscipline) {
      this.formGroup.patchValue(this.curriculumDiscipline, { emitEvent: true });
    }
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.formGroup.disable();
    const requestBody:
      | CurriculumDisciplineAddRequest
      | CurriculumDisciplineUpdateRequest = {
      curriculumId: this.curriculumId,
      disciplineId: this.disciplineId,
      semester: this.semester,
      totalHours: this.totalHours,
      lectureHours: this.lectureHours,
      practiceHours: this.practiceHours,
      labHours: this.labHours,
      selfStudyHours: this.selfStudyHours,
      testCount: this.testCount,
      hasCredit: this.hasCredit,
      hasExam: this.hasExam,
      creditUnits: this.creditUnits,
    };

    const request$ =
      this.editMode && this.curriculumDiscipline
        ? this._curriculumService.updateDiscipline(requestBody)
        : this._curriculumService.addDiscipline(requestBody);

    request$.subscribe({
      next: curriculumDiscipline => {
        this._translate
          .get(
            this.editMode
              ? 'curricula.form.disciplines.form.snackbar_update_success_message'
              : 'curricula.form.disciplines.form.snackbar_add_success_message'
          )
          .pipe(
            delay(666),
            tap(() => {
              this.curricululDisciplineCreatedUpdated.emit(
                curriculumDiscipline
              );
              this.formGroup.enable();
            })
          )
          .subscribe(message => {
            this._snackbarService.showSuccess(message, SnackbarAction.Cross);
          });
      },
      error: () => {
        this._translate
          .get(
            this.editMode
              ? 'curricula.form.disciplines.form.snackbar_update_error_message'
              : 'curricula.form.disciplines.form.snackbar_add_error_message'
          )
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showError(message, SnackbarAction.Cross);
          });
      },
    });
  }

  updateDisciplineOptions(query?: string | null) {
    this.areDisciplineOptionsLoading = true;
    this._disciplineService
      .search(query || '')
      .pipe(
        map(response => response.content),
        map(disciplines => {
          return disciplines.map(discipline => {
            return {
              name: discipline.name,
              value: discipline.id,
            } as SelectOption;
          });
        })
      )
      .subscribe(options => {
        if (
          this.disciplineId &&
          !options.find(option => option.value === this.disciplineId)
        ) {
          this._disciplineService
            .getById(this.disciplineId)
            .pipe(
              map(parentSpecialization => {
                return {
                  name: parentSpecialization.name,
                  value: parentSpecialization.id,
                } as SelectOption;
              })
            )
            .subscribe(disciplieOptions => {
              this.disciplineOptions = [disciplieOptions, ...options];
              this.areDisciplineOptionsLoading = false;
            });
        } else {
          this.disciplineOptions = options;
          this.areDisciplineOptionsLoading = false;
        }
      });
  }
}
