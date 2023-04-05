import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { THEME_CSS_CLASS_TOKEN } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '../../domain/user';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent implements OnInit {
  user?: User;

  constructor(
    private _authService: AuthService,
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>
  ) {}

  ngOnInit() {
    this.user = this._authService.user;
  }
}
