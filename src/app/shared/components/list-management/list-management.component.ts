import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Optional,
  Output,
  Self,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractMatFormFieldControl } from '../../classes/abstract-mat-form-field-control';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  FormControl,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { SelectOption } from '../../domain/select-option';
import { BehaviorSubject, Subject, Subscription, merge } from 'rxjs';
import { MatSelectionList } from '@angular/material/list';

/**
 * If `mat-label` is used it requires `floatLabel` property to be set to `"always"`.
 */
@Component({
  selector: 'app-list-management[options]',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: ListManagementComponent,
    },
  ],
})
export class ListManagementComponent
  extends AbstractMatFormFieldControl<SelectOption[]>
  implements OnInit, OnDestroy
{
  private _changeSubscription!: Subscription;
  private _valueChanged = new Subject();
  isOptionAlreadyPresentInItems = new BehaviorSubject<boolean>(false);
  areItemsSelected = new BehaviorSubject<boolean>(false);
  selectControl = new FormControl();
  @Input() options!: SelectOption[];
  @Input() multiple = false;

  /**
   * Use `fi1terSelectOptions()` method.
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
  @Output() itemAdded = new EventEmitter<SelectOption>();
  @Output() itemsDeleted = new EventEmitter<unknown[]>();
  @ViewChild(MatSelectionList) matSelectionList!: MatSelectionList;

  constructor(
    _elementRef: ElementRef,
    _focusMonitor: FocusMonitor,
    @Optional() @Self() ngControl: NgControl,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      'app-list-management',
      _elementRef,
      _focusMonitor,
      ngControl,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup
    );
  }

  ngOnInit() {
    this._changeSubscription = merge(
      this.selectControl.valueChanges,
      this._valueChanged
    ).subscribe(() => {
      const selectedValue = this.selectControl.value;
      this.isOptionAlreadyPresentInItems.next(
        this.value.filter(item => item.value === selectedValue).length !== 0
      );
      this._changeDetectorRef.detectChanges();
    });
  }

  override ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }

  override get value(): SelectOption[] {
    return super.value;
  }

  override set value(value: SelectOption[]) {
    super.value = value;
  }

  onContainerClick() {
    if (!this.focused) {
      this.focus();
    }
  }

  focus() {
    this.focused = true;
  }

  onFilterChanged(query?: string | null) {
    this.filterChanged.emit(query);
  }

  onSelectionChange() {
    this.areItemsSelected.next(
      this.matSelectionList.selectedOptions.selected.length > 0
    );
  }

  onItemAdd(addedItemValue: unknown) {
    const option = this.options.find(option => option.value === addedItemValue);
    if (!option) return;
    if (this.value.find(item => item.value === addedItemValue)) return;
    if (this.value) {
      this.value = [option, ...this.value];
    } else {
      this.value = [option];
    }
    this._valueChanged.next(this.value);
    this.itemAdded.emit(option);
  }

  onItemsDelete() {
    const valuesToDelete = this.matSelectionList.selectedOptions.selected.map(
      option => option.value
    );
    this.value = this.value.filter(
      item => !valuesToDelete.includes(item.value)
    );
    this.areItemsSelected.next(false);
    this._valueChanged.next(this.value);
    this.itemsDeleted.emit(valuesToDelete);
  }
}
