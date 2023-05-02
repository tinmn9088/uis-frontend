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
import { distinctUntilChanged, map, tap } from 'rxjs';
import { DisciplineService } from 'src/app/discipline/services/discipline.service';
import { SelectOption } from 'src/app/shared/domain/select-option';

@Component({
  selector: 'app-curriculum-discipline-form',
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
  @Output() curricululDisciplineCreatedUpdated =
    new EventEmitter<CurriculumDiscipline>();
  @Output() formInvalid = new EventEmitter<boolean>();

  constructor(
    private _authService: AuthService,
    private _disciplineService: DisciplineService
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

  get credit(): boolean {
    return this.formGroup.get('credit')?.value;
  }

  get exam(): boolean {
    return this.formGroup.get('exam')?.value;
  }

  get creditUnits(): number {
    return this.formGroup.get('creditUnits')?.value;
  }

  ngOnInit() {
    this.editMode =
      !!this.curriculumDiscipline &&
      !!this.curriculumDiscipline.curriculumId &&
      !!this.curriculumDiscipline.disciplineId;

    const positiveNumberValidators = [Validators.required, Validators.min(1)];
    this.formGroup = new FormGroup({
      disciplineId: new FormControl(undefined, Validators.required),
      semester: new FormControl(undefined, [
        ...positiveNumberValidators,
        Validators.max(8),
      ]),
      lectureHours: new FormControl(undefined, positiveNumberValidators),
      practiceHours: new FormControl(undefined, positiveNumberValidators),
      labHours: new FormControl(undefined, positiveNumberValidators),
      selfStudyHours: new FormControl(undefined, positiveNumberValidators),
      totalHours: new FormControl(undefined, [
        ...positiveNumberValidators,
        this.TotalHoursValidator,
      ]),
      testCount: new FormControl(undefined, positiveNumberValidators),
      credit: new FormControl(false),
      exam: new FormControl(false),
      creditUnits: new FormControl(undefined, positiveNumberValidators),
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
  }

  submit() {
    this.curricululDisciplineCreatedUpdated.emit();
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
