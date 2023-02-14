import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineTableComponent } from './discipline-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('DisciplineTableComponent', () => {
  let component: DisciplineTableComponent;
  let fixture: ComponentFixture<DisciplineTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [DisciplineTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisciplineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
