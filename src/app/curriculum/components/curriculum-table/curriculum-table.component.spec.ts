import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumTableComponent } from './curriculum-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('CurriculumTableComponent', () => {
  let component: CurriculumTableComponent;
  let fixture: ComponentFixture<CurriculumTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [CurriculumTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculumTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
