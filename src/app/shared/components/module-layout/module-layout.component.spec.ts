import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleLayoutComponent } from './module-layout.component';
import { SharedModule, THEME_CSS_CLASS_TOKEN } from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

describe('ModuleLayoutComponent', () => {
  let component: ModuleLayoutComponent;
  let fixture: ComponentFixture<ModuleLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [ModuleLayoutComponent],
      providers: [
        {
          provide: THEME_CSS_CLASS_TOKEN,
          useValue: new BehaviorSubject(''),
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
