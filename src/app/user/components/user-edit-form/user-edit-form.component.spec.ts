import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditFormComponent } from './user-edit-form.component';
import { UserModule } from '../../user.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserEditFormComponent', () => {
  let component: UserEditFormComponent;
  let fixture: ComponentFixture<UserEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [UserEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditFormComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, username: 'TestUser', roles: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
