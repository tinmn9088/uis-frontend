import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineListComponent } from './discipline-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DisciplineModule } from '../../discipline.module';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('DisciplineListComponent', () => {
  let component: DisciplineListComponent;
  let fixture: ComponentFixture<DisciplineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, DisciplineModule],
      declarations: [DisciplineListComponent],
      providers: [
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DisciplineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
