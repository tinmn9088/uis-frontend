import { Component, Input, OnInit } from '@angular/core';
import { SpecializationFlatNode } from '../../domain/specialization-flat-node';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ModuleName } from 'src/app/shared/domain/module-name';

@Component({
  selector: 'app-specialization-tree-node[specializationNode]',
  templateUrl: './specialization-tree-node.component.html',
  styleUrls: ['./specialization-tree-node.component.scss'],
})
export class SpecializationTreeNodeComponent implements OnInit {
  @Input() specializationNode!: SpecializationFlatNode;
  panelOpenState = false;
  linkToForm = '/';

  constructor(private _moduleService: ModuleService) {}

  ngOnInit() {
    this.linkToForm = `/${this._moduleService.getPath(
      ModuleName.Specialization
    )}/${this.specializationNode.specialization.id}`;
  }
}
