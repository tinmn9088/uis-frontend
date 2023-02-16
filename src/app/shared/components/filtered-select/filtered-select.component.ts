import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { AbstractMatFormFieldControl } from '../../classes/abstract-mat-form-field-control';
import {
  FormControl,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { Subscription, filter } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatSelect } from '@angular/material/select';
import { SelectOption } from '../../domain/select-option';

@Component({
  selector: 'app-filtered-select[options]',
  templateUrl: './filtered-select.component.html',
  styleUrls: ['./filtered-select.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FilteredSelectComponent,
    },
  ],
})
export class FilteredSelectComponent
  extends AbstractMatFormFieldControl<string>
  implements OnInit, OnDestroy
{
  private subscription!: Subscription;
  @Input() options!: SelectOption[];
  @Input() multiple = false;
  @ViewChild(MatSelect) matSelect!: MatSelect;
  @ViewChild(MatInput) matInput!: MatInput;
  selectControl = new FormControl();
  filterControl = new FormControl('');
  filteredSelectOptions!: SelectOption[];
  allOptionsSelected = false;
  noneOptionsSelected = true;

  constructor(
    _elementRef: ElementRef,
    _focusMonitor: FocusMonitor,
    @Optional() @Self() ngControl: NgControl,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective
  ) {
    super(
      'app-filtered-select',
      _elementRef,
      _focusMonitor,
      ngControl,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup
    );
  }

  ngOnInit() {
    this.subscription = this.selectControl.valueChanges.subscribe(value => {
      super.value = value;
    });
    this.filteredSelectOptions = this.options.slice();
    this.filterControl.valueChanges
      .pipe(filter(value => !!value))
      .subscribe(value => this.filterSelectOptions(value as string));
  }

  override ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    super.ngOnDestroy();
  }

  override set value(value: string) {
    this.selectControl.setValue(value);
    super.value = value;
  }

  onContainerClick() {
    if (!this.focused) {
      this.focus();
    }
  }

  focus() {
    this.matSelect.focus();
    this.matSelect.open();
    this.focused = true;
  }

  filterSelectOptions(value: string) {
    const lowerCase = value.toLocaleLowerCase();
    this.filteredSelectOptions = this.options.filter(option => {
      return (
        option.name.trim().toLocaleLowerCase().includes(lowerCase) ||
        option.value.toString().trim().toLocaleLowerCase().includes(lowerCase)
      );
    });
  }

  selectAllOptions(select: boolean) {
    this.allOptionsSelected = select;
    this.noneOptionsSelected = !select;
    if (select) {
      this.matSelect?.options.forEach(option => option.select());
    } else {
      this.matSelect?.options.forEach(option => option.deselect());
      this.selectControl.setValue(undefined);
    }
  }

  onSelectionChange() {
    this.allOptionsSelected = this.matSelect?.options
      .toArray()
      .every(option => option.selected);
    this.noneOptionsSelected = this.matSelect?.options
      .toArray()
      .every(option => !option.selected);
    if (this.noneOptionsSelected) this.selectControl.setValue(undefined);
  }
}
