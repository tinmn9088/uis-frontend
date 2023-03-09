import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLayoutComponent } from './user-layout.component';
import { BehaviorSubject } from 'rxjs';
import {
  SharedModule,
  THEME_CSS_CLASS_TOKEN,
} from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserLayoutComponent', () => {
  let component: UserLayoutComponent;
  let fixture: ComponentFixture<UserLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [UserLayoutComponent],
      providers: [
        {
          provide: THEME_CSS_CLASS_TOKEN,
          useValue: new BehaviorSubject(''),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});