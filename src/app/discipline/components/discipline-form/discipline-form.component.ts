import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DisciplineService } from '../../services/discipline.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DisciplineAddRequest } from '../../domain/discipline-add-request';
import { SelectOption } from 'src/app/shared/domain/select-option';
import { map } from 'rxjs';
import { CategoryService } from 'src/app/category/services/category.service';
import { DisciplineUpdateRequest } from '../../domain/discipline-update-request';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-discipline-form',
  templateUrl: './discipline-form.component.html',
  styleUrls: ['./discipline-form.component.scss'],
})
export class DisciplineFormComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  id?: number;
  editMode!: boolean;
  formContainerWidthPercents?: number;
  formGroup!: FormGroup;
  categoriesOptions?: SelectOption[];
  areNotPermissionsPresent: boolean;
  areCategoriesOptionsLoading = true;
  @ViewChild('form') form!: ElementRef;

  constructor(
    private _disciplineService: DisciplineService,
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
          Permission.DISCIPLINE_GET,
          Permission.DISCIPLINE_UPDATE,
        ])
      : !this._authService.hasUserPermissions([Permission.DISCIPLINE_CREATE]);

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
      categories: new FormControl(),
    });
  }

  get name(): string {
    return this.formGroup.get('name')?.value;
  }

  get shortName(): string {
    return this.formGroup.get('shortName')?.value;
  }

  get categories(): number[] {
    // TODO: change form input
    return [];
  }

  ngOnInit() {
    if (this.editMode) {
      this._route.params.subscribe({
        next: params => {
          this.id = parseInt(params['id']);
          this._disciplineService.getById(this.id).subscribe({
            next: discipline => {
              this.formGroup.patchValue({
                name: discipline.name,
                shortName: discipline.shortName,
                categories: discipline.categories,
              });
            },
          });
        },
      });
    }
    this.updateCategoriesOptions();
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

    const requestBody: DisciplineAddRequest | DisciplineUpdateRequest = {
      name: this.name || '',
      shortName: this.shortName || '',
      categories: this.categories,
    };
    if (this.categories) requestBody.categories = this.categories;
    console.debug('Request body', requestBody);

    const request$ =
      this.editMode && this.id
        ? this._disciplineService.update(this.id, requestBody)
        : this._disciplineService.add(requestBody);

    request$.subscribe({
      next: discipline => {
        console.debug('Received back', discipline);
        this._translate
          .get(
            this.editMode
              ? 'disciplines.form.snackbar_update_success_message'
              : 'disciplines.form.snackbar_add_success_message'
          )
          .subscribe({
            next: message => {
              this._snackbarService.showSuccess(message);
              this.formGroup.enable();
            },
          });
        if (this.editMode) {
          this.formGroup.patchValue(discipline, { emitEvent: true });
        } else {
          this._router.navigateByUrl(
            this._disciplineService.getLinkToFormPage(discipline.id)
          );
        }
      },
      error: (reason: Error) => {
        this._snackbarService.showError(reason.message);
        this.formGroup.enable();
      },
    });
  }

  updateCategoriesOptions(query?: string | null) {
    this.areCategoriesOptionsLoading = true;
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
        this.categoriesOptions = options;
        this.areCategoriesOptionsLoading = false;
      });
  }

  getLinkToSearchPage() {
    return this._disciplineService.getLinkToSearchPage();
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
