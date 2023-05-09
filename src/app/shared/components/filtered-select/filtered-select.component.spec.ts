import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredSelectComponent } from './filtered-select.component';
import { HttpLoaderFactory, SharedModule } from '../../shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FilteredSelectComponent', () => {
  let component: FilteredSelectComponent;
  let fixture: ComponentFixture<FilteredSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [FilteredSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilteredSelectComponent);
    component = fixture.componentInstance;
    component.options = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
