import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor() {
    this._resizeObserver = new ResizeObserver(entries => {
      this.updateFormContainerWidth(entries[0]?.contentRect.width);
    });
    this.formGroup = new FormGroup({
      name: new FormControl(this.name, Validators.required),
      shortName: new FormControl(this.shortName, Validators.required),
      cipher: new FormControl(this.cipher, Validators.required),
    });
  }

  ngAfterViewInit() {
    this._resizeObserver.observe(this.form.nativeElement);
  }

  onSubmit() {
    console.log('Submitted');
  }

  private updateFormContainerWidth(formWidth: number) {
    if (formWidth > 786) this.formContainerWidthPercents = 50;
    else if (formWidth > 600 && formWidth <= 786)
      this.formContainerWidthPercents = 66;
    else if (formWidth <= 600) this.formContainerWidthPercents = 100;
  }
}
