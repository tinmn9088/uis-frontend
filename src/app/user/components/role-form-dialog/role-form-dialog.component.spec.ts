import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFormDialogComponent } from './role-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { UserModule } from '../../user.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RoleFormDialogComponent', () => {
  let component: RoleFormDialogComponent;
  let fixture: ComponentFixture<RoleFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        UserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [RoleFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { role: undefined },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
