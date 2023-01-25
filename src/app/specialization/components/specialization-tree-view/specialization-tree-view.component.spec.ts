import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationTreeViewComponent } from './specialization-tree-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  SpecializationFlatNode,
  getLevel,
  isExpandable,
} from '../../services/specialization.service';

describe('SpecializationTreeViewComponent', () => {
  let component: SpecializationTreeViewComponent;
  let fixture: ComponentFixture<SpecializationTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [SpecializationTreeViewComponent],
      providers: [
        {
          provide: FlatTreeControl,
          useValue: new FlatTreeControl<SpecializationFlatNode>(
            getLevel,
            isExpandable
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
