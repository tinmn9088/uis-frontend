import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
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
import { Subscription, debounceTime } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatSelect } from '@angular/material/select';
import { SelectOption } from '../../domain/select-option';

declare type Option = SelectOption | SelectOption[] | undefined | null;

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
  extends AbstractMatFormFieldControl<Option>
  implements OnInit, OnDestroy, OnChanges
{
  private _selectSubscription!: Subscription;
  @Input() options!: SelectOption[];

  /**
   * Use `filterSelectOptions()` method.
   * If 'false' then `isLoading` also should be controlled from outside.
   */
  @Input() isInternalFilterOn = true;

  /**
   * Progress bar is shown instead of options.
   */
  @Input() isLoading = false;

  /**
   * If `isInternalFilterOn` is 'false' then event fires no more frequently than 666 milliseconds.
   */
  @Output() filterChanged = new EventEmitter<string | null>();

  @ViewChild(MatSelect) matSelect!: MatSelect;
  @ViewChild(MatInput) matInput!: MatInput;
  selectControl = new FormControl();
  filterControl = new FormControl('');
  filteredOptions: SelectOption[] = [];

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
    this._selectSubscription = this.selectControl.valueChanges.subscribe(
      value => {
        super.value = value;
      }
    );
    this.filteredOptions = this.options?.slice() || [];
    this.filterControl.valueChanges
      .pipe(debounceTime(this.isInternalFilterOn ? 0 : 666))
      .subscribe(value => {
        this.filterChanged.emit(this.filterControl.value);
        if (this.isInternalFilterOn) this.innerFilterOptions(value);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']?.currentValue) {
      if (this.isInternalFilterOn) {
        this.innerFilterOptions(this.filterControl.value);
      } else {
        this.filteredOptions = this.options.slice();
      }
    }
  }

  override ngOnDestroy() {
    if (this._selectSubscription) {
      this._selectSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }

  override set value(value: Option) {
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

  private innerFilterOptions(value: string | null) {
    const lowerCase = value?.toLocaleLowerCase() || '';
    this.filteredOptions =
      this.options?.filter(option => {
        return option.name.trim().toLocaleLowerCase().includes(lowerCase);
      }) || this.filteredOptions;
  }
}
