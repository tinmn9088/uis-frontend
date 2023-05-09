import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManagementComponent } from './list-management.component';
import { HttpLoaderFactory, SharedModule } from '../../shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListManagementComponent', () => {
  let component: ListManagementComponent;
  let fixture: ComponentFixture<ListManagementComponent>;

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
      declarations: [ListManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
