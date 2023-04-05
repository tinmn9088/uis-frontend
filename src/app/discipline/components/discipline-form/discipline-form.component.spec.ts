import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineFormComponent } from './discipline-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('DisciplineFormComponent', () => {
  let component: DisciplineFormComponent;
  let fixture: ComponentFixture<DisciplineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [DisciplineFormComponent],
      providers: [
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DisciplineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
