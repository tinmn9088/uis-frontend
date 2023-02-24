import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredSelectComponent } from './filtered-select.component';
import { SharedModule } from '../../shared.module';

describe('FilteredSelectComponent', () => {
  let component: FilteredSelectComponent;
  let fixture: ComponentFixture<FilteredSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [FilteredSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilteredSelectComponent);
    component = fixture.componentInstance;
    component.options = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
