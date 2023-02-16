import { Component, Inject, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModuleService } from './shared/services/module.service';
import { ModuleSidenavOption } from './shared/domain/module-sidenav-option';
import { ModuleName } from './shared/domain/module-name';
import { ModuleToolbarTab } from './shared/domain/module-tab';
import { THEME_CSS_CLASS_TOKEN } from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _pathChangeSubscription: Subscription;
  title = 'uis-frontend';
  sidenavOptions!: ModuleSidenavOption[];
  activeOption?: ModuleSidenavOption;
  toolbarTabs: ModuleToolbarTab[];
  activeTab?: ModuleToolbarTab;
  addButtonPath?: string;

  constructor(
    private _router: Router,
    private _moduleService: ModuleService,
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>
  ) {
    this.toolbarTabs = [
      {
        title: this._moduleService.getI18N(ModuleName.Category),
        path: this._moduleService.getPath(ModuleName.Category),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Discipline),
        path: this._moduleService.getPath(ModuleName.Discipline),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Specialization),
        path: this._moduleService.getPath(ModuleName.Specialization),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Curricula),
        path: this._moduleService.getPath(ModuleName.Curricula),
      },
    ];
    this._pathChangeSubscription = this._router.events.subscribe({
      next: event => {
        if (event instanceof NavigationStart) {
          const currentPath = event.url;
          console.debug(`Current path: "${currentPath}"`);
          const moduleName = _moduleService.getModuleNameByPath(currentPath);
          if (!moduleName) {
            throw new Error(`No module found for "${currentPath}"`);
          }
          this.themeClass$.next(_moduleService.getThemeCssClass(moduleName));
          this.sidenavOptions = _moduleService.getSidenavOptions(moduleName);
          this.activeOption = this.sidenavOptions.find(option =>
            this.isActiveOption(currentPath, option)
          );
          this.activeTab = this.toolbarTabs.find(tab =>
            currentPath.startsWith(tab.path)
          );
          this.addButtonPath =
            _moduleService.getSidenavAddButtonPath(moduleName);
        }
      },
      error: reason => console.error(reason),
    });
  }

  ngOnDestroy() {
    this._pathChangeSubscription.unsubscribe();
  }

  private isActiveOption(currentPath: string, option: ModuleSidenavOption) {
    let active = currentPath.startsWith(option.path);
    if (option.pathRegex) {
      active = active || currentPath.match(option.pathRegex) !== null;
    }
    return active;
  }
}
