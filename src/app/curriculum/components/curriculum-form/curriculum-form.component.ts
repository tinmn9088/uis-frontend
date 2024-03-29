import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOption } from 'src/app/shared/domain/select-option';
import { CurriculumService } from '../../services/curriculum.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurriculumAddRequest } from '../../domain/curriculum-add-request';
import { CurriculumUpdateRequest } from '../../domain/curriculum-update-request';
import { map } from 'rxjs';
import { SpecializationService } from 'src/app/specialization/services/specialization.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Permission } from 'src/app/auth/domain/permission';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CurriculumDisciplineDialogComponent } from '../curriculum-discipline-dialog/curriculum-discipline-dialog.component';
import { CurriculumDisciplineTableComponent } from '../curriculum-discipline-table/curriculum-discipline-table.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';
import { SnackbarAction } from 'src/app/shared/domain/snackbar-action';

/**
 * Query params:
 * * `showDelete` - will focus on delete button.
 */
@Component({
  selector: 'app-curriculum-form',
  templateUrl: './curriculum-form.component.html',
  styleUrls: ['./curriculum-form.component.scss'],
})
export class CurriculumFormComponent implements OnInit, AfterViewInit {
  private _dialogRef?: MatDialogRef<
    CurriculumDisciplineDialogComponent,
    unknown
  >;
  private _resizeObserver: ResizeObserver;
  private _specializationId?: number;
  id?: number;
  admissionYearOptions!: number[];
  editMode!: boolean;
  formContainerWidthPercents?: number;
  formGroup!: FormGroup;
  specializationOptions!: SelectOption[];
  canUserGetCurriculum: boolean;
  canUserCreateCurriculum: boolean;
  canUserModifyCurriculum: boolean;
  canUserDeleteCurriculum: boolean;
  areParentOptionsLoading = false;
  @ViewChild('form') form?: ElementRef;
  @ViewChild('deleteButton') deleteButton?: MatButton;
  @ViewChild('deleteTooltip') deleteTooltip?: MatTooltip;
  isDeleteTooltipDisabled = true;
  @ViewChild(CurriculumDisciplineTableComponent)
  disciplineTable!: CurriculumDisciplineTableComponent;

  constructor(
    private _curriculumService: CurriculumService,
    private _specializationService: SpecializationService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _errorMessageService: ErrorMessageService,
    private _translate: TranslateService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _languageService: LanguageService,
    private _adapter: DateAdapter<unknown>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.editMode = !this._router.url.endsWith('add');
    this.canUserGetCurriculum = this._authService.hasUserPermissions([
      Permission.CURRICULUM_READ,
    ]);
    this.canUserCreateCurriculum = this._authService.hasUserPermissions([
      Permission.CURRICULUM_CREATE,
    ]);
    this.canUserModifyCurriculum = this._authService.hasUserPermissions([
      Permission.CURRICULUM_UPDATE,
    ]);
    this.canUserDeleteCurriculum = this._authService.hasUserPermissions([
      Permission.CURRICULUM_DELETE,
    ]);

    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    const isFormControlDisabled = () =>
      this.editMode
        ? !this.canUserModifyCurriculum
        : !this.canUserCreateCurriculum;
    this.formGroup = new FormGroup({
      approvalDate: new FormControl(
        { value: undefined, disabled: isFormControlDisabled() },
        Validators.required
      ),
      admissionYear: new FormControl(
        { value: undefined, disabled: isFormControlDisabled() },
        Validators.required
      ),
      specializationId: new FormControl(undefined, Validators.required),
    });

    this.admissionYearOptions = this.generateAdmissionYearOptions();
  }

  get approvalDate(): Date {
    return this.formGroup.get('approvalDate')?.value;
  }

  get admissionYear(): number {
    return this.formGroup.get('admissionYear')?.value;
  }

  set admissionYear(year: number) {
    this.formGroup.get('admissionYear')?.setValue(year);
  }

  get specializationId(): number {
    return this.formGroup.get('specializationId')?.value;
  }

  get selectedSpecializationName(): string {
    return (
      this.specializationOptions.find(
        option => option.value === this.specializationId
      )?.name || ''
    );
  }

  ngOnInit() {
    if (this.editMode) {
      this._route.data.subscribe(({ curriculum }) => {
        this.id = curriculum.id;
        this._specializationId = curriculum.specializationId;

        // if actual admission year is not present in generated array
        this.admissionYearOptions.push(curriculum.admissionYear);
        this.admissionYearOptions.sort();

        this.formGroup.patchValue({
          approvalDate: new Date(curriculum.approvalDate),
          admissionYear: curriculum.admissionYear,
          specializationId: curriculum.specializationId,
        });
      });
    }
    this.updateSpecializationOptions();
    this._locale = this._languageService.getLanguage();
    this._adapter.setLocale(this._locale);
  }

  ngAfterViewInit() {
    if (this.form) this._resizeObserver.observe(this.form.nativeElement);

    // fix initial 100% form container width (autofocus is too fast)
    setTimeout(() => {
      (document.querySelector('.form__input') as HTMLInputElement)?.focus();
      this._route.data.subscribe(({ showDelete }) => {
        if (showDelete) {
          this.deleteButton?._elementRef?.nativeElement?.focus();
          this.isDeleteTooltipDisabled = false;
          this._changeDetectorRef.detectChanges();
          this.deleteTooltip?.show();
          this._changeDetectorRef.detectChanges();
        }
      });
    }, 200);
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      console.debug(this.formGroup.controls);
      return;
    }

    this.formGroup.disable();

    const requestBody: CurriculumAddRequest | CurriculumUpdateRequest = {
      approvalDate: this.approvalDate || new Date(),
      admissionYear: this.admissionYear || 0,
      specializationId: this.specializationId,
    };
    if (this.specializationId)
      requestBody.specializationId = this.specializationId;
    console.debug('Request body', requestBody);

    const request$ =
      this.editMode && this.id
        ? this._curriculumService.update(this.id, requestBody)
        : this._curriculumService.add(requestBody);

    request$.subscribe({
      next: curriculum => {
        console.debug('Received back', curriculum);
        this._translate
          .get(
            this.editMode
              ? 'curricula.form.snackbar_update_success_message'
              : 'curricula.form.snackbar_add_success_message'
          )
          .subscribe({
            next: message => {
              this._snackbarService.showSuccess(message);
              this.formGroup.enable();
            },
          });
        if (this.editMode) {
          this.formGroup.patchValue(curriculum, { emitEvent: true });
          this.admissionYear = curriculum.admissionYear;
        } else {
          this._router.navigateByUrl(
            this._curriculumService.getLinkToFormPage(curriculum.id)
          );
        }
      },
      error: (response: HttpErrorResponse) => {
        this._translate
          .get(
            this.editMode
              ? 'curricula.form.snackbar_update_fail_message'
              : 'curricula.form.snackbar_add_fail_message'
          )
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showError(
              this._errorMessageService.buildHttpErrorMessage(
                response,
                message
              ),
              SnackbarAction.Cross
            );
          });
        this.formGroup.enable();
      },
    });
  }

  updateSpecializationOptions(query?: string | null) {
    this.areParentOptionsLoading = true;
    this._specializationService
      .search(query || '')
      .pipe(
        map(response => response.content),
        map(specializations => {
          return specializations.map(specialization => {
            return {
              name: specialization.name,
              value: specialization.id,
            } as SelectOption;
          });
        })
      )
      .subscribe(options => {
        if (
          this.editMode &&
          this._specializationId &&
          !options.find(option => option.value === this._specializationId)
        ) {
          this._specializationService
            .getById(this._specializationId)
            .pipe(
              map(specialization => {
                return {
                  name: specialization.name,
                  value: specialization.id,
                } as SelectOption;
              })
            )
            .subscribe(specializationOption => {
              this.specializationOptions = [specializationOption, ...options];
              this.areParentOptionsLoading = false;
            });
        } else {
          this.specializationOptions = options;
          this.areParentOptionsLoading = false;
        }
      });
  }

  getLinkToSearchPage() {
    return this._curriculumService.getLinkToSearchPage();
  }

  onYearSelected(date: Date, matDatepicker: MatDatepicker<unknown>) {
    this.formGroup.get('admissionYear')?.patchValue(date);
    matDatepicker.close();
  }

  onDelete() {
    const name = `${this.selectedSpecializationName} (${this._adapter.format(
      this.approvalDate,
      ''
    )})`;
    const dialogRef = this._matDialog.open(DeleteDialogComponent, {
      data: { name },
    });
    dialogRef.afterClosed().subscribe(isDeleteConfirmed => {
      if (isDeleteConfirmed && this.id) {
        this.formGroup.disable();
        this._curriculumService.delete(this.id).subscribe({
          next: () => {
            this._translate
              .get('curricula.form.snackbar_delete_success_message')
              .subscribe(message => {
                this._snackbarService.showSuccess(`${message} (${this.id})`);
                this._router.navigateByUrl(this.getLinkToSearchPage());
              });
          },
          error: (response: HttpErrorResponse) => {
            this._translate
              .get('curricula.form.snackbar_delete_fail_message')
              .subscribe(message => {
                this.formGroup.enable();
                this._snackbarService.showError(
                  this._errorMessageService.buildHttpErrorMessage(
                    response,
                    message
                  ),
                  SnackbarAction.Cross
                );
              });
            this.formGroup.enable();
          },
        });
      }
    });
  }

  openCurriculumDisciplineFormDialog() {
    this._dialogRef = this._matDialog.open(
      CurriculumDisciplineDialogComponent,
      { data: { curriculumId: this.id, curriculumDiscipline: undefined } }
    );
    this._dialogRef.afterClosed().subscribe(actionPerformed => {
      if (actionPerformed) this.disciplineTable.updateData();
    });
  }

  /**
   * Breakpoints:
   * * `width` > 1080 - __33%__
   * * `width` > 768 & `width` <= 1080 - __50%__
   * * `width` > 600 & `width` <= 768 - __66%__
   * * `width` <= 600 - __100%__
   */
  private updateFormContainerWidth(formWidth: number) {
    if (formWidth > 1080) {
      this.formContainerWidthPercents = 33;
    } else if (formWidth > 768 && formWidth <= 1080) {
      this.formContainerWidthPercents = 50;
    } else if (formWidth > 600 && formWidth <= 786) {
      this.formContainerWidthPercents = 66;
    } else if (formWidth <= 600) {
      this.formContainerWidthPercents = 100;
    }
  }

  private generateAdmissionYearOptions(): number[] {
    const options: number[] = [];
    for (
      let year = new Date().getFullYear() - 10;
      options.length < 25;
      year++
    ) {
      options.push(year);
    }
    return options;
  }
}
