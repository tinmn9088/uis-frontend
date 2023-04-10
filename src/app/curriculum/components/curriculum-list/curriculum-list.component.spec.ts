import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumListComponent } from './curriculum-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CurriculumModule } from '../../curriculum.module';

describe('CurriculumListComponent', () => {
  let component: CurriculumListComponent;
  let fixture: ComponentFixture<CurriculumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CurriculumModule],
      declarations: [CurriculumListComponent],
      providers: [
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
