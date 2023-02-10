import { Component, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { ModuleService } from './shared/services/module.service';
import { ModuleSidenavOption } from './shared/domain/module-sidenav-option';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _pathChangeSubscription: Subscription;
  title = 'uis-frontend';
  themeClass?: string;
  options!: ModuleSidenavOption[];

  constructor(private _router: Router, private _moduleService: ModuleService) {
    this._pathChangeSubscription = this._router.events.subscribe({
      next: event => {
        if (event instanceof NavigationStart) {
          const currentPath = event.url;
          console.debug(`Current path: "${currentPath}"`);
          const moduleName = _moduleService.getModuleNameByPath(currentPath);
          if (!moduleName) {
            throw new Error(`No module found for "${currentPath}"`);
          }
          this.themeClass = _moduleService.getThemeCssClass(moduleName);
          this.options = _moduleService.getSidenavOptions(moduleName);
        }
      },
      error: reason => console.error(reason),
    });
  }

  ngOnDestroy() {
    this._pathChangeSubscription.unsubscribe();
  }
}
