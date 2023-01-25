import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationListComponent } from './specialization-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpecializationModule } from 'src/app/specialization/specialization.module';

describe('SpecializationListComponent', () => {
  let component: SpecializationListComponent;
  let fixture: ComponentFixture<SpecializationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, SpecializationModule],
      declarations: [SpecializationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
