import { Component, Input } from '@angular/core';
import { SpecializationFlatNode } from '../../services/specialization.service';

@Component({
  selector: 'app-specialization-flat-node[specializationNode]',
  templateUrl: './specialization-flat-node.component.html',
  styleUrls: ['./specialization-flat-node.component.scss'],
})
export class SpecializationFlatNodeComponent {
  @Input() specializationNode!: SpecializationFlatNode;
  panelOpenState = false;
}
