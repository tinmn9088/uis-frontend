import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpecializationAddRequest } from '../../domain/specialization-add-request';
import { SpecializationService } from '../../services/specialization.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectOption } from 'src/app/shared/domain/select-option';
import { map } from 'rxjs';
import { SpecializationUpdateRequest } from '../../domain/specialization-update-request';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-specialization-form',
  templateUrl: './specialization-form.component.html',
  styleUrls: ['./specialization-form.component.scss'],
})
export class SpecializationFormComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  private _parentId?: number;
  id?: number;
  editMode!: boolean;
  formContainerWidthPercents?: number;
  formGroup!: FormGroup;
  parentOptions!: SelectOption[];
  canUserGetSpecialization: boolean;
  canUserCreateSpecialization: boolean;
  canUserModifySpecialization: boolean;
  areParentOptionsLoading = false;
  @ViewChild('form') form?: ElementRef;

  constructor(
    private _specializationService: SpecializationService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.editMode = !this._router.url.endsWith('add');
    this.canUserGetSpecialization = this._authService.hasUserPermissions([
      Permission.SPECIALIZATION_GET,
    ]);
    this.canUserCreateSpecialization = this._authService.hasUserPermissions([
      Permission.SPECIALIZATION_CREATE,
    ]);
    this.canUserModifySpecialization = this._authService.hasUserPermissions([
      Permission.SPECIALIZATION_UPDATE,
    ]);

    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    const isFormControlDisabled = () =>
      this.editMode
        ? !this.canUserModifySpecialization
        : !this.canUserCreateSpecialization;
    this.formGroup = new FormGroup({
      name: new FormControl(
        { value: '', disabled: isFormControlDisabled() },
        Validators.required
      ),
      shortName: new FormControl(
        { value: '', disabled: isFormControlDisabled() },
        Validators.required
      ),
      cipher: new FormControl(
        { value: '', disabled: isFormControlDisabled() },
        Validators.required
      ),
      parentId: new FormControl(),
    });
  }

  get name(): string {
    return this.formGroup.get('name')?.value;
  }

  get shortName(): string {
    return this.formGroup.get('shortName')?.value;
  }

  get cipher(): string {
    return this.formGroup.get('cipher')?.value;
  }

  get parentId(): number {
    return this.formGroup.get('parentId')?.value;
  }

  ngOnInit() {
    if (this.editMode) {
      this._route.params.subscribe({
        next: params => {
          this.id = parseInt(params['id']);
          this._specializationService.getById(this.id).subscribe({
            next: specialization => {
              this._parentId = specialization.parentId;
              this.formGroup.patchValue({
                name: specialization.name,
                shortName: specialization.shortName,
                cipher: specialization.cipher,
                parentId: specialization.parentId,
              });
            },
          });
        },
      });
    }
    this.updateParentOptions();
  }

  ngAfterViewInit() {
    if (this.form) this._resizeObserver.observe(this.form.nativeElement);

    // fix initial 100% form container width (autofocus is too fast)
    setTimeout(
      () =>
        (document.querySelector('.form__input') as HTMLInputElement)?.focus(),
      200
    );
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      console.debug(this.formGroup.controls);
      return;
    }

    this.formGroup.disable();

    const requestBody: SpecializationAddRequest | SpecializationUpdateRequest =
      {
        name: this.name || '',
        shortName: this.shortName || '',
        cipher: this.cipher || '',
        parentId: this.parentId,
      };
    if (this.parentId) requestBody.parentId = this.parentId;
    console.debug('Request body', requestBody);

    const request$ =
      this.editMode && this.id
        ? this._specializationService.update(this.id, requestBody)
        : this._specializationService.add(requestBody);

    request$.subscribe({
      next: specialization => {
        console.debug('Received back', specialization);
        this._translate
          .get(
            this.editMode
              ? 'specializations.form.snackbar_update_success_message'
              : 'specializations.form.snackbar_add_success_message'
          )
          .subscribe(message => {
            this._snackbarService.showSuccess(message);
            this.formGroup.enable();
          });
        if (this.editMode) {
          if (!specialization.parentId) specialization.parentId = undefined;
          this.formGroup.patchValue(specialization, { emitEvent: true });
        } else {
          this._router.navigateByUrl(
            this._specializationService.getLinkToFormPage(specialization.id)
          );
        }
      },
      error: (response: HttpErrorResponse) => {
        this._snackbarService.showError(response.error.message);
        this.formGroup.enable();
      },
    });
  }

  updateParentOptions(query?: string | null) {
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
          this._parentId &&
          !options.find(option => option.value === this._parentId)
        ) {
          this._specializationService
            .getById(this._parentId)
            .pipe(
              map(parentSpecialization => {
                return {
                  name: parentSpecialization.name,
                  value: parentSpecialization.id,
                } as SelectOption;
              })
            )
            .subscribe(parentOption => {
              this.parentOptions = [parentOption, ...options];
              this.areParentOptionsLoading = false;
            });
        } else {
          this.parentOptions = options;
          this.areParentOptionsLoading = false;
        }
      });
  }

  getLinkToSearchPage() {
    return this._specializationService.getLinkToSearchPage();
  }

  /**
   * Breakpoints:
   * * `width` > 1080 - __33%__
   * * `width` > 768 & `width` <= 1080 - __50%__
   * * `width` > 600 & `width` <= 768 - __66%__
   * * `width` <= 600 - __100%__
   */
  private updateFormContainerWidth(formWidth: number) {
    if (formWidth > 1080) this.formContainerWidthPercents = 33;
    else if (formWidth > 768 && formWidth <= 1080)
      this.formContainerWidthPercents = 50;
    else if (formWidth > 600 && formWidth <= 786)
      this.formContainerWidthPercents = 66;
    else if (formWidth <= 600) this.formContainerWidthPercents = 100;
  }
}
