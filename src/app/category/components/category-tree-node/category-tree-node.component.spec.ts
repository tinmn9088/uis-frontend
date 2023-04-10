import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeNodeComponent } from './category-tree-node.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryModule } from '../../category.module';
import { CategoryFlatNode } from '../../domain/category-flat-node';
import { RouterTestingModule } from '@angular/router/testing';

describe('CategoryTreeNodeComponent', () => {
  let component: CategoryTreeNodeComponent;
  let fixture: ComponentFixture<CategoryTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CategoryModule, RouterTestingModule],
      declarations: [CategoryTreeNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTreeNodeComponent);
    component = fixture.componentInstance;
    component.categoryNode = new CategoryFlatNode({
      id: 1,
      name: 'TestName',
      hasChildren: false,
      parent: { id: 2 },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
