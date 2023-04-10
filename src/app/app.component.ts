import { Component, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModuleService } from './shared/services/module.service';
import { THEME_CSS_CLASS_TOKEN } from './shared/shared.module';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _pathChangeSubscription: Subscription;
  title = 'uis-frontend';

  constructor(
    private _router: Router,
    private _moduleService: ModuleService,
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>
  ) {
    this._pathChangeSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentPath = event.url;
        console.debug(`Current path: "${currentPath}"`);

        const moduleName = this._moduleService.getModuleNameByPath(currentPath);
        if (moduleName) {
          this.themeClass$.next(
            this._moduleService.getThemeCssClass(moduleName) || ''
          );
        }
      }
    });
  }

  ngOnDestroy() {
    this._pathChangeSubscription.unsubscribe();
  }
}
