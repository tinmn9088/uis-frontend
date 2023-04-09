import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
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
import { DatepickerYearHeaderComponent } from 'src/app/shared/components/datepicker-year-header/datepicker-year-header.component';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-curriculum-form',
  templateUrl: './curriculum-form.component.html',
  styleUrls: ['./curriculum-form.component.scss'],
})
export class CurriculumFormComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  datepickerYearHeader = DatepickerYearHeaderComponent;
  id?: number;
  editMode!: boolean;
  formContainerWidthPercents?: number;
  formGroup!: FormGroup;
  specializationOptions!: SelectOption[];
  areNotPermissionsPresent: boolean;
  areParentOptionsLoading = false;
  @ViewChild('form') form!: ElementRef;

  constructor(
    private _curriculumService: CurriculumService,
    private _specializationService: SpecializationService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _languageService: LanguageService,
    private _adapter: DateAdapter<unknown>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this.editMode = !this._router.url.endsWith('add');
    this.areNotPermissionsPresent = this.editMode
      ? !this._authService.hasUserPermissions([
          Permission.CURRICULUM_GET,
          Permission.CURRICULUM_UPDATE,
        ])
      : !this._authService.hasUserPermissions([Permission.CURRICULUM_CREATE]);

    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    this.formGroup = new FormGroup({
      approvalDate: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
        Validators.required
      ),
      admissionYear: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
        Validators.required
      ),
      specializationId: new FormControl(undefined, Validators.required),
    });
  }

  get approvalDate(): Date {
    return this.formGroup.get('approvalDate')?.value;
  }

  get admissionYear(): number {
    return (this.formGroup.get('admissionYear')?.value as Date).getFullYear();
  }

  get specializationId(): number {
    return this.formGroup.get('specializationId')?.value;
  }

  ngOnInit() {
    if (this.editMode) {
      this._route.params.subscribe({
        next: params => {
          this.id = parseInt(params['id']);
          this._curriculumService.getById(this.id).subscribe({
            next: curriculum => {
              this.formGroup.patchValue({
                approvalDate: curriculum.approvalDate,
                admissionYear: curriculum.admissionYear,
                specializationId: curriculum.specializationId,
              });
            },
          });
        },
      });
    }
    this.updateSpecializationOptions();
    this._locale = this._languageService.getLanguage();
    this._adapter.setLocale(this._locale);
  }

  ngAfterViewInit() {
    this._resizeObserver.observe(this.form.nativeElement);

    // fix initial 100% form container width (autofocus is too fast)
    setTimeout(
      () =>
        (document.querySelector('.form__input') as HTMLInputElement).focus(),
      200
    );
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
              ? 'curriculum.form.snackbar_update_success_message'
              : 'curriculum.form.snackbar_add_success_message'
          )
          .subscribe({
            next: message => {
              this._snackbarService.showSuccess(message);
              this.formGroup.enable();
            },
          });
        if (this.editMode) {
          this.formGroup.patchValue(curriculum, { emitEvent: true });
        } else {
          this._router.navigateByUrl(
            this._curriculumService.getLinkToFormPage(curriculum.id)
          );
        }
      },
      error: (reason: Error) => {
        this._snackbarService.showError(reason.message);
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
        this.specializationOptions = options;
        this.areParentOptionsLoading = false;
      });
  }

  getLinkToSearchPage() {
    return this._curriculumService.getLinkToSearchPage();
  }

  onYearSelected(date: Date, matDatepicker: MatDatepicker<unknown>) {
    this.formGroup.get('admissionYear')?.patchValue(date);
    matDatepicker.close();
  }

  private updateFormContainerWidth(formWidth: number) {
    if (formWidth > 786) this.formContainerWidthPercents = 50;
    else if (formWidth > 600 && formWidth <= 786)
      this.formContainerWidthPercents = 66;
    else if (formWidth <= 600) this.formContainerWidthPercents = 100;
  }
}