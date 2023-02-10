import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpecializationAddRequest } from '../../domain/specialization-add-request';
import { SpecializationService } from '../../services/specialization.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-specialization-form',
  templateUrl: './specialization-form.component.html',
  styleUrls: ['./specialization-form.component.scss'],
})
export class SpecializationFormComponent implements AfterViewInit {
  private _resizeObserver: ResizeObserver;
  name?: string;
  shortName?: string;
  cipher?: string;
  parent?: number;
  formContainerWidthPercents?: number;
  formGroup!: FormGroup;
  @ViewChild('form') form!: ElementRef;

  constructor(
    private _specializationService: SpecializationService,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService
  ) {
    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    this.formGroup = new FormGroup({
      name: new FormControl(this.name, Validators.required),
      shortName: new FormControl(this.shortName, Validators.required),
      cipher: new FormControl(this.cipher, Validators.required),
      parent: new FormControl(this.parent),
    });
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
    };
    if (this.parent) addRequest.parent = this.parent;
    console.debug('Add specialization request', addRequest);

    this._specializationService.add(addRequest).subscribe({
      next: specialization => {
        console.debug('Received back', specialization);
        this._translate
          .get('specializations.add_form.snackbar_success_message')
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
