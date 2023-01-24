import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationTreeViewComponent } from './specialization-tree-view.component';

describe('SpecializationTreeViewComponent', () => {
  let component: SpecializationTreeViewComponent;
  let fixture: ComponentFixture<SpecializationTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecializationTreeViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
