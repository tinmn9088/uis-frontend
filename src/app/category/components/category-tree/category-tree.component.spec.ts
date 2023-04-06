import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeComponent } from './category-tree.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CategoryFlatNode } from '../../domain/category-flat-node';
import {
  getLevel,
  isExpandable,
} from '../../services/category-tree-data-source.service';

describe('CategoryTreeComponent', () => {
  let component: CategoryTreeComponent;
  let fixture: ComponentFixture<CategoryTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [CategoryTreeComponent],
      providers: [
        {
          provide: FlatTreeControl,
          useValue: new FlatTreeControl<CategoryFlatNode>(
            getLevel,
            isExpandable
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
