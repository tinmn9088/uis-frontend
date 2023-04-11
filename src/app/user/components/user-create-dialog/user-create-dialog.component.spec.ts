import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateDialogComponent } from './user-create-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';
import { UserModule } from '../../user.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';

describe('UserCreateDialogComponent', () => {
  let component: UserCreateDialogComponent;
  let fixture: ComponentFixture<UserCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, UserModule],
      declarations: [UserCreateDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
