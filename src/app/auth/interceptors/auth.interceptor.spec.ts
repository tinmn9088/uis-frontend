import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import {
  HttpLoaderFactory,
  REFRESH_JWT_REQUEST_COUNT_TOKEN,
  SharedModule,
} from 'src/app/shared/shared.module';
import { JWT_HELPER_SERVICE_TOKEN } from '../auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        AuthInterceptor,
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
        {
          provide: REFRESH_JWT_REQUEST_COUNT_TOKEN,
          useValue: new BehaviorSubject(0),
        },
      ],
    })
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
