import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModuleName } from 'src/app/shared/domain/module-name';
import { ModuleSidenavOption } from 'src/app/shared/domain/module-sidenav-option';
import { ModuleService } from 'src/app/shared/services/module.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  cards: {
    i18nName: string;
    path: string;
    themeCssClass: any;
    options: ModuleSidenavOption[];
    isAllowed: boolean;
  }[] = [];

  constructor(
    private _moduleService: ModuleService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  get allowedCards() {
    return this.cards.filter(card => card.isAllowed);
  }

  ngOnInit() {
    this.cards = this._moduleService.getAllModules().map(module => {
      const moduleName =
        module.path && this._moduleService.getModuleNameByPath(module.path);
      const requiredPermissions =
        (moduleName &&
          this._moduleService.getAllRequiredPermissions(moduleName)) ||
        [];
      const themeCssClass = {} as any;
      if (module.themeCssClass) themeCssClass[module.themeCssClass] = true;
      return {
        i18nName: module.i18nName || '',
        path:
          moduleName === ModuleName.User
            ? `${module.path}/list`
            : module.path || '',
        themeCssClass: themeCssClass,
        options: module.sidenavOptions || [],
        isAllowed: this._authService.hasUserPermissions(requiredPermissions),
      };
    });
  }

  navigateToAuthPage() {
    this._router.navigate(this._authService.AUTH_PAGE_PATH);
  }
}
