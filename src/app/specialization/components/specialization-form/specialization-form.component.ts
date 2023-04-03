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

@Component({
  selector: 'app-specialization-form',
  templateUrl: './specialization-form.component.html',
  styleUrls: ['./specialization-form.component.scss'],
})
export class SpecializationFormComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  Permission = Permission;
  id?: number;
  editMode!: boolean;
  formContainerWidthPercents?: number;
  formGroup!: FormGroup;
  parentOptions!: SelectOption[];
  areNotPermissionsPresent: boolean;
  areParentOptionsLoading = false;
  @ViewChild('form') form!: ElementRef;

  constructor(
    private _specializationService: SpecializationService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.areNotPermissionsPresent = !this._authService.hasUserPermissions([
      Permission.SPECIALIZATION_UPDATE,
      Permission.SPECIALIZATION_CREATE,
    ]);
    console.log(this.areNotPermissionsPresent);

    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    this.formGroup = new FormGroup({
      name: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
        Validators.required
      ),
      shortName: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
        Validators.required
      ),
      cipher: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
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
    this.editMode = !this._router.url.endsWith('add');
    if (this.editMode) {
      this._route.params.subscribe({
        next: params => {
          this.id = parseInt(params['id']);
          this._specializationService.getById(this.id).subscribe({
            next: specialization => {
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
          .subscribe({
            next: message => {
              this._snackbarService.showSuccess(message);
              this.formGroup.enable();
            },
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
      error: (reason: Error) => {
        this._snackbarService.showError(reason.message);
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
        this.parentOptions = options;
        this.areParentOptionsLoading = false;
      });
  }

  getLinkToSearchPage() {
    return this._specializationService.getLinkToSearchPage();
  }

  private updateFormContainerWidth(formWidth: number) {
    if (formWidth > 786) this.formContainerWidthPercents = 50;
    else if (formWidth > 600 && formWidth <= 786)
      this.formContainerWidthPercents = 66;
    else if (formWidth <= 600) this.formContainerWidthPercents = 100;
  }
}
