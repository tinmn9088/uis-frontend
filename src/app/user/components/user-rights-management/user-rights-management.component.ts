import { Component, Input, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { map } from 'rxjs';
import { SelectOption } from 'src/app/shared/domain/select-option';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../domain/user';

@Component({
  selector: 'app-user-rights-management[user]',
  templateUrl: './user-rights-management.component.html',
  styleUrls: ['./user-rights-management.component.scss'],
})
export class UserRightsManagementComponent implements OnInit {
  roleOptions!: SelectOption[];
  areOptionsLoading = false;
  formGroup!: FormGroup;
  @Input() user!: User;

  constructor(private _roleService: RoleService) {
    this.formGroup = new FormGroup({
      roleId: new FormControl(),
    });
  }

  ngOnInit() {
    this.updateOptions();
  }

  updateOptions(query?: string | null) {
    this.areOptionsLoading = true;
    this._roleService
      .search(query || '')
      .pipe(
        map(response => response.content),
        map(roles => {
          return roles.map(role => {
            return {
              name: role.name,
              value: role.id,
            } as SelectOption;
          });
        })
      )
      .subscribe(options => {
        this.roleOptions = options;
        this.areOptionsLoading = false;
      });
  }
}
