import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit {
  constructor(private _permissionService: PermissionService) {}

  ngOnInit() {
    this._permissionService.getAllScopes().subscribe(scopes => {
      console.log(scopes);
    });
  }
}
