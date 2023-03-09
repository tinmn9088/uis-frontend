import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SharedModule } from 'src/app/shared/shared.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
