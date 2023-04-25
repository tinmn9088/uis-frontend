import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModuleName } from 'src/app/shared/domain/module-name';
import { ModuleSidenavOption } from 'src/app/shared/domain/module-sidenav-option';
import { ModuleService } from 'src/app/shared/services/module.service';

declare type ModuleCard = {
  i18nName: string;
  i18nGroupName: string;
  path: string;
  themeCssClass: any;
  options: ModuleSidenavOption[];
  isAllowed: boolean;
};

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  cards: ModuleCard[] = [];
  cardGroups: Map<string, ModuleCard[]> = new Map<string, ModuleCard[]>();

  constructor(
    public authService: AuthService,
    private _moduleService: ModuleService,
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
        options: module.options?.filter(option => !option.pathRegex) || [],
        isAllowed: this.authService.hasUserPermissions(requiredPermissions),
        i18nGroupName: module.i18nGroupName || '-',
      };
    });
    this.cardGroups = this.cards.reduce((groups, value) => {
      if (!value.isAllowed) return groups;
      if (!groups.has(value.i18nGroupName)) {
        groups.set(value.i18nGroupName, []);
      }
      groups.get(value.i18nGroupName)?.push(value);
      return groups;
    }, new Map<string, ModuleCard[]>());
  }

  navigateToAuthPage() {
    this._router.navigate(this.authService.AUTH_PAGE_PATH);
  }
}
