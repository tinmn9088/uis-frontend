import { Component, Inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModuleName } from 'src/app/shared/domain/module-name';
import { ToolbarTab } from 'src/app/shared/domain/toolbar-tab';
import { ModuleService } from 'src/app/shared/services/module.service';
import { THEME_CSS_CLASS_TOKEN } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent implements OnDestroy {
  private _pathChangeSubscription: Subscription;
  toolbarTabs: ToolbarTab[];
  activeTab?: ToolbarTab;
  showTabs = false;
  showMainPageButton = false;

  constructor(
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>,
    private _moduleService: ModuleService,
    private _authService: AuthService,
    private _router: Router
  ) {
    const userModule = this._moduleService.getModule(ModuleName.User);
    const mainPagePath = this._moduleService.getMainPagePath();
    this.toolbarTabs =
      userModule.options
        ?.filter(option => option.path !== mainPagePath)
        .map(option => {
          return {
            title: option.title,
            path: option.path,
            requiredPermissions: option.requiredPermissions,
          } as ToolbarTab;
        }) || [];
    this._pathChangeSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentPath = event.url;
        this.activeTab = this.toolbarTabs.find(tab =>
          currentPath.startsWith(tab.path)
        );
        const authPagePath = '/' + this._authService.AUTH_PAGE_PATH.join('/');
        this.showTabs = ![mainPagePath, authPagePath].includes(currentPath);
        this.showMainPageButton = currentPath !== authPagePath;
      }
    });
  }

  ngOnDestroy() {
    this._pathChangeSubscription.unsubscribe();
  }
}
