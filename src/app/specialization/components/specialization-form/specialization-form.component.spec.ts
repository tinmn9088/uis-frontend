import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationFormComponent } from './specialization-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SpecializationFormComponent', () => {
  let component: SpecializationFormComponent;
  let fixture: ComponentFixture<SpecializationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [SpecializationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
