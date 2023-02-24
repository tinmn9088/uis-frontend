import { Component, Input, OnInit } from '@angular/core';
import { SpecializationFlatNode } from '../../domain/specialization-flat-node';
import { SpecializationService } from '../../services/specialization.service';

@Component({
  selector: 'app-specialization-tree-node[specializationNode]',
  templateUrl: './specialization-tree-node.component.html',
  styleUrls: ['./specialization-tree-node.component.scss'],
})
export class SpecializationTreeNodeComponent implements OnInit {
  @Input() specializationNode!: SpecializationFlatNode;
  panelOpenState = false;
  linkToForm = '/';

  constructor(private _specializationService: SpecializationService) {}

  ngOnInit() {
    this.linkToForm = this._specializationService.getLinkToFormPage(
      this.specializationNode.specialization.id
    );
  }
}
