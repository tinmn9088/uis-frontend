import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRightsManagementComponent } from './user-rights-management.component';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserRightsManagementComponent', () => {
  let component: UserRightsManagementComponent;
  let fixture: ComponentFixture<UserRightsManagementComponent>;

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
      declarations: [UserRightsManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRightsManagementComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, username: 'TestUser', roles: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
