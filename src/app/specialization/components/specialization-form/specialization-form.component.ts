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

@Component({
  selector: 'app-specialization-form',
  templateUrl: './specialization-form.component.html',
  styleUrls: ['./specialization-form.component.scss'],
})
export class SpecializationFormComponent implements OnInit, AfterViewInit {
  private _resizeObserver: ResizeObserver;
  id?: number;
  editMode!: boolean;
  formContainerWidthPercents?: number;
  formGroup!: FormGroup;
  parentOptions!: SelectOption[];
  @ViewChild('form') form!: ElementRef;

  constructor(
    private _specializationService: SpecializationService,
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
      cipher: new FormControl('', Validators.required),
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
    this.parentOptions = [
      { name: '1000', value: 1000 },
      { name: '1100', value: 1100 },
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

    const addRequest: SpecializationAddRequest = {
      name: this.name || '',
      shortName: this.shortName || '',
      cipher: this.cipher || '',
      parentId: this.parentId,
    };
    if (this.parentId) addRequest.parentId = this.parentId;
    console.debug('Add specialization request', addRequest);

    this._specializationService.add(addRequest).subscribe({
      next: specialization => {
        console.debug('Received back', specialization);
        this._translate
          .get('specializations.form.snackbar_success_message')
          .subscribe({
            next: message => {
              this._snackbarService.showSuccess(message);
              this.formGroup.enable();
            },
          });
        setTimeout(
          () =>
            this._specializationService.navigateToViewPage(specialization.id),
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
