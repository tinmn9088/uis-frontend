import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
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
import { Category } from 'src/app/category/domain/category';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { SnackbarAction } from 'src/app/shared/domain/snackbar-action';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Discipline } from '../../domain/discipline';

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
  canUserGetDiscipline: boolean;
  canUserCreateDiscipline: boolean;
  canUserModifyDiscipline: boolean;
  canUserDeleteDiscipline: boolean;
  areCategoriesOptionsLoading = true;
  @ViewChild('form') form?: ElementRef;
  @ViewChild('deleteButton') deleteButton?: MatButton;
  @ViewChild('deleteTooltip') deleteTooltip?: MatTooltip;
  isDeleteTooltipDisabled = true;

  constructor(
    private _disciplineService: DisciplineService,
    private _categoryService: CategoryService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _errorMessageService: ErrorMessageService,
    private _translate: TranslateService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.editMode = !this._router.url.endsWith('add');
    this.canUserGetDiscipline = this._authService.hasUserPermissions([
      Permission.DISCIPLINE_GET,
    ]);
    this.canUserCreateDiscipline = this._authService.hasUserPermissions([
      Permission.DISCIPLINE_CREATE,
    ]);
    this.canUserModifyDiscipline = this._authService.hasUserPermissions([
      Permission.DISCIPLINE_UPDATE,
    ]);
    this.canUserDeleteDiscipline = this._authService.hasUserPermissions([
      Permission.DISCIPLINE_DELETE,
    ]);

    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    const isFormControlDisabled = () =>
      this.editMode
        ? !this.canUserModifyDiscipline
        : !this.canUserCreateDiscipline;
    this.formGroup = new FormGroup({
      name: new FormControl(
        { value: '', disabled: isFormControlDisabled() },
        Validators.required
      ),
      shortName: new FormControl(
        { value: '', disabled: isFormControlDisabled() },
        Validators.required
      ),
      categories: new FormControl<SelectOption[]>([]),
    });

    this.formGroup.valueChanges.subscribe(change => console.log(change));
  }

  get name(): string {
    return this.formGroup.get('name')?.value;
  }

  get shortName(): string {
    return this.formGroup.get('shortName')?.value;
  }

  get categories(): Category[] {
    return (this.formGroup.get('categories')?.value as SelectOption[]).map(
      option => {
        return {
          id: option.value,
          name: option.name,
        } as Category;
      }
    );
  }

  ngOnInit() {
    if (this.editMode) {
      this._route.data.subscribe(({ discipline }) => {
        this.id = discipline.id;
        this.formGroup.setValue({
          name: discipline.name,
          shortName: discipline.shortName,
          categories: (discipline as Discipline).tags.map(tag => {
            return { name: tag.name, value: tag.id } as SelectOption;
          }),
        });
      });
    }
    this.updateCategoriesOptions();
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

    const requestBody: DisciplineAddRequest | DisciplineUpdateRequest = {
      name: this.name || '',
      shortName: this.shortName || '',
      tags: this.categories,
    };
    if (this.categories) requestBody.tags = this.categories;
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
      error: (response: HttpErrorResponse) => {
        this._translate
          .get(
            this.editMode
              ? 'disciplines.form.snackbar_update_fail_message'
              : 'disciplines.form.snackbar_add_fail_message'
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

  onDelete() {
    const dialogRef = this._matDialog.open(DeleteDialogComponent, {
      data: { name: this.name },
    });
    dialogRef.afterClosed().subscribe(isDeleteConfirmed => {
      if (isDeleteConfirmed && this.id) {
        this.formGroup.disable();
        this._disciplineService.delete(this.id).subscribe({
          next: () => {
            this._translate
              .get('disciplines.form.snackbar_delete_success_message')
              .subscribe(message => {
                this._snackbarService.showSuccess(`${message} (${this.name})`);
                this._router.navigateByUrl(this.getLinkToSearchPage());
              });
          },
          error: (response: HttpErrorResponse) => {
            this._translate
              .get('disciplines.form.snackbar_delete_fail_message')
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
