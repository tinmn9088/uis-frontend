import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditDialogComponent } from './user-edit-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { UserModule } from '../../user.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserEditDialogComponent', () => {
  let component: UserEditDialogComponent;
  let fixture: ComponentFixture<UserEditDialogComponent>;

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
      declarations: [UserEditDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: null,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditDialogComponent);
    component = fixture.componentInstance;
    component.data = { user: { id: 1, username: 'TestUser', roles: [] } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
