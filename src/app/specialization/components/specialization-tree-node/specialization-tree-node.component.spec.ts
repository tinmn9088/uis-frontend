import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationTreeNodeComponent } from './specialization-tree-node.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpecializationFlatNode } from '../../services/specialization-tree-data-source.service';

describe('SpecializationTreeNodeComponent', () => {
  let component: SpecializationTreeNodeComponent;
  let fixture: ComponentFixture<SpecializationTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
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
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
