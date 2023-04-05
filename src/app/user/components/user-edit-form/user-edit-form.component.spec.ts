import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditFormComponent } from './user-edit-form.component';
import { UserModule } from '../../user.module';

describe('UserEditFormComponent', () => {
  let component: UserEditFormComponent;
  let fixture: ComponentFixture<UserEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserModule],
      declarations: [UserEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditFormComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, username: 'testuser', roles: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
