import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { THEME_CSS_CLASS_TOKEN } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent {
  constructor(
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>
  ) {}
}
