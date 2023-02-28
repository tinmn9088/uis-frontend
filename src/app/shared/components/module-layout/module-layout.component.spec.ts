import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleLayoutComponent } from './module-layout.component';
import { SharedModule } from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModuleLayoutComponent', () => {
  let component: ModuleLayoutComponent;
  let fixture: ComponentFixture<ModuleLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [ModuleLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
