import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationFlatNodeComponent } from './specialization-flat-node.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpecializationFlatNode } from '../../services/specialization.service';

describe('SpecializationFlatNodeComponent', () => {
  let component: SpecializationFlatNodeComponent;
  let fixture: ComponentFixture<SpecializationFlatNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [SpecializationFlatNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationFlatNodeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.specializationNode = new SpecializationFlatNode({
      id: 1,
      name: 'TestName',
      shortName: 'TestShortName',
      cipher: 'TestCipher',
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
