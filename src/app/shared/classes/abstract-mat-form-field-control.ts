import { ErrorStateMatcher, mixinErrorState } from '@angular/material/core';
import {
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';

class _AbstractMatFormFieldControl {
  stateChanges = new Subject<void>();

  constructor(
    public ngControl: NgControl,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective
  ) {}
}

@Directive()
export abstract class AbstractMatFormFieldControl<T>
  extends mixinErrorState(_AbstractMatFormFieldControl)
  implements DoCheck, OnDestroy, ControlValueAccessor, MatFormFieldControl<T>
{
  private static _nextId = 0;
  private _value!: T;
  private _disabled = false;
  private _required = false;
  private _placeholder = '';
  protected onChange?: (value: T) => void;
  protected onTouched?: () => void;
  @HostBinding()
  id = `${this.controlType}-${AbstractMatFormFieldControl._nextId++}`;
  @HostBinding('attr.aria-describedBy') describedBy = '';
  focused = false;

  constructor(
    public readonly controlType: string,
    protected readonly _elementRef: ElementRef,
    protected readonly _focusMonitor: FocusMonitor,
    public override readonly ngControl: NgControl,
    public override readonly _defaultErrorStateMatcher: ErrorStateMatcher,
    public override readonly _parentForm: NgForm,
    public override readonly _parentFormGroup: FormGroupDirective
  ) {
    super(ngControl, _defaultErrorStateMatcher, _parentForm, _parentFormGroup);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this._focusMonitor
      .monitor(this._elementRef.nativeElement, true)
      .subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      });
  }

  abstract focus(): void;

  abstract onContainerClick(): void;

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  get empty(): boolean {
    return !this._value;
  }

  get placeholder() {
    return this._placeholder;
  }

  @Input()
  set placeholder(placeholder: string) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }

  get required() {
    return this._required;
  }

  @Input()
  set required(required: any) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }

  get disabled() {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  @Input()
  set disabled(disabled: any) {
    this._disabled = coerceBooleanProperty(disabled);
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  registerOnChange(onChange: (value: T) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  writeValue(value: T) {
    this.value = value;
  }

  @HostListener('focusout')
  onFocusout() {
    this.focused = false;
    if (this.onTouched) {
      this.onTouched();
    }
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
}
