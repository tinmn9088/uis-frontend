import { Component, Input } from '@angular/core';
import { User } from '../../domain/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit-form[user]',
  templateUrl: './user-edit-form.component.html',
  styleUrls: ['./user-edit-form.component.scss'],
})
export class UserEditFormComponent {
  @Input() user!: User;
  isUserLoading = false;

  constructor(private _userService: UserService) {}

  onUserUpdate() {
    this.isUserLoading = true;
    this._userService.getById(this.user.id).subscribe(updatedUser => {
      this.user = updatedUser;
      this.isUserLoading = false;
    });
  }
}
