import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { JWT_HELPER_SERVICE_TOKEN } from '../auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('AuthService', () => {
  let service: AuthService;

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
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
