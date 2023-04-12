import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectOption } from 'src/app/shared/domain/select-option';
import { CategoryAddRequest } from '../../domain/category-add-request';
import { map } from 'rxjs';
import { Permission } from 'src/app/auth/domain/permission';
import { CategoryUpdateRequest } from '../../domain/category-update-request';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  id?: number;
  editMode!: boolean;
  formContainerWidthPercents?: number;
  formGroup!: FormGroup;
  parentOptions!: SelectOption[];
  areNotPermissionsPresent: boolean;
  areParentOptionsLoading = false;
  @ViewChild('form') form!: ElementRef;

  constructor(
    private _categoryService: CategoryService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.editMode = !this._router.url.endsWith('add');
    this.areNotPermissionsPresent = this.editMode
      ? !this._authService.hasUserPermissions([
          Permission.TAG_READ,
          Permission.TAG_UPDATE,
        ])
      : !this._authService.hasUserPermissions([Permission.TAG_CREATE]);

    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    this.formGroup = new FormGroup({
      name: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
        Validators.required
      ),
      parentId: new FormControl(),
    });
  }

  get name(): string {
    return this.formGroup.get('name')?.value;
  }

  get parentId(): number {
    return this.formGroup.get('parentId')?.value;
  }

  ngOnInit() {
    if (this.editMode) {
      this._route.params.subscribe({
        next: params => {
          this.id = parseInt(params['id']);
          this._categoryService.getById(this.id).subscribe({
            next: category => {
              console.log(category);

              this.formGroup.patchValue({
                name: category.name,
                parentId: category.parentId,
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

    const requestBody: CategoryAddRequest | CategoryUpdateRequest = {
      name: this.name || '',
      parentId: this.parentId,
    };
    console.debug('Request body', requestBody);

    const request$ =
      this.editMode && this.id
        ? this._categoryService.update(this.id, requestBody)
        : this._categoryService.add(requestBody);

    request$.subscribe({
      next: category => {
        console.debug('Received back', category);
        this._translate
          .get(
            this.editMode
              ? 'categories.form.snackbar_update_success_message'
              : 'categories.form.snackbar_add_success_message'
          )
          .subscribe(message => {
            this._snackbarService.showSuccess(message);
            this.formGroup.enable();
          });
        if (this.editMode) {
          if (!category.parentId) category.parentId = undefined;
          this.formGroup.patchValue(category, { emitEvent: true });
        } else {
          this._router.navigateByUrl(
            this._categoryService.getLinkToFormPage(category.id)
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
    this._categoryService
      .search(query || '')
      .pipe(
        map(response => response.content),
        map(categories => {
          return categories.map(category => {
            return {
              name: category.name,
              value: category.id,
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
    return this._categoryService.getLinkToSearchPage();
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
