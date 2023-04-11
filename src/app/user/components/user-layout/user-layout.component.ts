import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { THEME_CSS_CLASS_TOKEN } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '../../domain/user';
import { ToolbarTab } from 'src/app/shared/domain/toolbar-tab';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ModuleName } from 'src/app/shared/domain/module-name';
import { NavigationEnd, Router } from '@angular/router';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  private _pathChangeSubscription: Subscription;
  user?: User;
  toolbarTabs: ToolbarTab[];
  activeTab?: ToolbarTab;

  constructor(
    private _authService: AuthService,
    private _moduleService: ModuleService,
    private _router: Router,
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>
  ) {
    const userModulePath = this._moduleService.getPath(ModuleName.User);
    this.toolbarTabs = [
      {
        title: 'users.toolbarTabs.profile',
        path: `${userModulePath}/main`,
        requiredPermissions: [],
      },
      {
        title: 'users.toolbarTabs.users',
        path: `${userModulePath}/list`,
        requiredPermissions: [Permission.USER_READ],
      },
      {
        title: 'users.toolbarTabs.roles',
        path: `${userModulePath}/role`,
        requiredPermissions: [Permission.ROLE_CREATE, Permission.ROLE_READ],
      },
    ];

    this._pathChangeSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentPath = event.url;
        this.activeTab = this.toolbarTabs.find(tab =>
          currentPath.startsWith(tab.path)
        );
      }
    });
  }

  ngOnInit() {
    this.user = this._authService.user;
  }

  ngOnDestroy() {
    this._pathChangeSubscription.unsubscribe();
  }
}
