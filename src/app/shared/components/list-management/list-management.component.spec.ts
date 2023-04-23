import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManagementComponent } from './list-management.component';
import { SharedModule } from '../../shared.module';

describe('ListManagementComponent', () => {
  let component: ListManagementComponent;
  let fixture: ComponentFixture<ListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ListManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
