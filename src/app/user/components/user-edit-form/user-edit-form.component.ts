import { Component, Input } from '@angular/core';
import { User } from '../../domain/user';

@Component({
  selector: 'app-user-edit-form[user]',
  templateUrl: './user-edit-form.component.html',
  styleUrls: ['./user-edit-form.component.scss'],
})
export class UserEditFormComponent {
  @Input() user!: User;
}
