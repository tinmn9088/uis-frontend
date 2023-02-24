import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineListComponent } from './discipline-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DisciplineModule } from '../../discipline.module';

describe('DisciplineListComponent', () => {
  let component: DisciplineListComponent;
  let fixture: ComponentFixture<DisciplineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, DisciplineModule],
      declarations: [DisciplineListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisciplineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
