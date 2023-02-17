import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationTreeNodeComponent } from './specialization-tree-node.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpecializationFlatNode } from '../../domain/specialization-flat-node';
import { RouterTestingModule } from '@angular/router/testing';

describe('SpecializationTreeNodeComponent', () => {
  let component: SpecializationTreeNodeComponent;
  let fixture: ComponentFixture<SpecializationTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [SpecializationTreeNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationTreeNodeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.specializationNode = new SpecializationFlatNode({
      id: 1,
      name: 'TestName',
      shortName: 'TestShortName',
      cipher: 'TestCipher',
      hasChildren: false,
      parentId: 1,
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
