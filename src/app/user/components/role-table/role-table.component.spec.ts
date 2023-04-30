import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleTableComponent } from './role-table.component';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

describe('RoleTableComponent', () => {
  let component: RoleTableComponent;
  let fixture: ComponentFixture<RoleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [RoleTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
