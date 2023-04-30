import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleLayoutComponent } from './module-layout.component';
import {
  HttpLoaderFactory,
  SharedModule,
  THEME_CSS_CLASS_TOKEN,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ModuleLayoutComponent', () => {
  let component: ModuleLayoutComponent;
  let fixture: ComponentFixture<ModuleLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [ModuleLayoutComponent],
      providers: [
        {
          provide: THEME_CSS_CLASS_TOKEN,
          useValue: new BehaviorSubject(''),
        },
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
