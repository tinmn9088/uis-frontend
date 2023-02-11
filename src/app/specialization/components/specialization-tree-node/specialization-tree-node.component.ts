import { Component, Input } from '@angular/core';
import { SpecializationFlatNode } from '../../domain/specialization-flat-node';

@Component({
  selector: 'app-specialization-tree-node[specializationNode]',
  templateUrl: './specialization-tree-node.component.html',
  styleUrls: ['./specialization-tree-node.component.scss'],
})
export class SpecializationTreeNodeComponent {
  @Input() specializationNode!: SpecializationFlatNode;
  panelOpenState = false;
}
