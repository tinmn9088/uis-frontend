import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import { SharedModule } from 'src/app/shared/shared.module';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [AuthInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
