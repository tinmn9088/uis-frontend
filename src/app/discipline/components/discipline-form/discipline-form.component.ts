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
import { DisciplineAddRequest } from '../../domain/discipline-add-request copy';
import { SelectOption } from 'src/app/shared/domain/select-option';

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
  categoriesOptions!: SelectOption[];
  @ViewChild('form') form!: ElementRef;

  constructor(
    private _disciplineService: DisciplineService,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      shortName: new FormControl('', Validators.required),
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
    this.editMode = !this._router.url.endsWith('add');
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
    this.categoriesOptions = [
      { name: 'Category 1', value: 1000 },
      { name: 'Category 2', value: 1100 },
    ];
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

    const addRequest: DisciplineAddRequest = {
      name: this.name || '',
      shortName: this.shortName || '',
    };
    if (this.categories) addRequest.categories = this.categories;
    console.debug('Add discipline request', addRequest);

    this._disciplineService.add(addRequest).subscribe({
      next: discipline => {
        console.debug('Received back', discipline);
        this._translate
          .get('disciplines.form.snackbar_success_message')
          .subscribe({
            next: message => {
              this._snackbarService.showSuccess(message);
              this.formGroup.enable();
            },
          });
        setTimeout(
          () =>
            this._router.navigateByUrl(
              this._disciplineService.getLinkToFormPage(discipline.id)
            ),
          2000
        );
      },
      error: (reason: Error) => {
        this._snackbarService.showError(reason.message);
        this.formGroup.enable();
      },
    });
  }

  private updateFormContainerWidth(formWidth: number) {
    if (formWidth > 786) this.formContainerWidthPercents = 50;
    else if (formWidth > 600 && formWidth <= 786)
      this.formContainerWidthPercents = 66;
    else if (formWidth <= 600) this.formContainerWidthPercents = 100;
  }
}
