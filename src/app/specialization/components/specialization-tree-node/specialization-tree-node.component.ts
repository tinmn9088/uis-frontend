import { Component, Input, OnInit } from '@angular/core';
import { SpecializationFlatNode } from '../../domain/specialization-flat-node';
import { SpecializationService } from '../../services/specialization.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-specialization-tree-node[specializationNode]',
  templateUrl: './specialization-tree-node.component.html',
  styleUrls: ['./specialization-tree-node.component.scss'],
})
export class SpecializationTreeNodeComponent implements OnInit {
  @Input() specializationNode!: SpecializationFlatNode;
  arePermissionsPresent: boolean;
  panelOpenState = false;

  linkToForm = '/';

  constructor(
    private _specializationService: SpecializationService,
    private _authService: AuthService
  ) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.SPECIALIZATION_UPDATE,
    ]);
  }

  ngOnInit() {
    this.linkToForm = this._specializationService.getLinkToFormPage(
      this.specializationNode.specialization.id
    );
  }
}
