import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationTreeComponent } from './specialization-tree.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  SpecializationFlatNode,
  getLevel,
  isExpandable,
} from '../../services/specialization-tree-data-source.service';

describe('SpecializationTreeComponent', () => {
  let component: SpecializationTreeComponent;
  let fixture: ComponentFixture<SpecializationTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [SpecializationTreeComponent],
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

    fixture = TestBed.createComponent(SpecializationTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
