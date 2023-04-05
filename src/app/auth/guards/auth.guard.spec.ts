import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { JWT_HELPER_SERVICE_TOKEN } from '../auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('AuthGuard', () => {
  let guard: AuthGuard;

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
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
