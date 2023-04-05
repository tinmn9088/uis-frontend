import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRightsManagementComponent } from './user-rights-management.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('UserRightsManagementComponent', () => {
  let component: UserRightsManagementComponent;
  let fixture: ComponentFixture<UserRightsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [UserRightsManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRightsManagementComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, username: 'testuser', roles: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
