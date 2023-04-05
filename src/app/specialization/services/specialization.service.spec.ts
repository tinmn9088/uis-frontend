import { TestBed } from '@angular/core/testing';

import { SpecializationService } from './specialization.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('SpecializationService', () => {
  let service: SpecializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
      ],
    });
    service = TestBed.inject(SpecializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
