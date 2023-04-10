import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-datepicker-year-header',
  templateUrl: './datepicker-year-header.component.html',
  styleUrls: ['./datepicker-year-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerYearHeaderComponent<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _matCalendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _matDateFormats: MatDateFormats,
    changeDetectorRef: ChangeDetectorRef
  ) {
    _matCalendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => changeDetectorRef.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(
        this._matCalendar.activeDate,
        this._matDateFormats.display.monthYearLabel
      )
      .toLocaleUpperCase();
  }

  onPreviousClicked() {
    this._matCalendar.activeDate = this._dateAdapter.addCalendarYears(
      this._matCalendar.activeDate,
      -24
    );
  }

  onNextClicked() {
    this._matCalendar.activeDate = this._dateAdapter.addCalendarYears(
      this._matCalendar.activeDate,
      24
    );
  }
}
