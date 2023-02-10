import { Component, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModuleService } from './shared/services/module.service';
import { ModuleSidenavOption } from './shared/domain/module-sidenav-option';
import { ModuleName } from './shared/domain/module-name';
import { ModuleToolbarTab } from './shared/domain/module-tab';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _pathChangeSubscription: Subscription;
  title = 'uis-frontend';
  themeClass?: string;
  sidenavOptions!: ModuleSidenavOption[];
  activeOption?: ModuleSidenavOption;
  toolbarTabs: ModuleToolbarTab[];
  activeTab?: ModuleToolbarTab;
  addButtonPath?: string;

  constructor(private _router: Router, private _moduleService: ModuleService) {
    this.toolbarTabs = [
      {
        title: this._moduleService.getI18N(ModuleName.Category),
        path:
          this._moduleService.getSidenavOptions(ModuleName.Category)[0]?.path ||
          this._moduleService.getPath(ModuleName.Category),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Discipline),
        path:
          this._moduleService.getSidenavOptions(ModuleName.Discipline)[0]
            ?.path || this._moduleService.getPath(ModuleName.Discipline),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Specialization),
        path:
          this._moduleService.getSidenavOptions(ModuleName.Specialization)[0]
            ?.path || this._moduleService.getPath(ModuleName.Specialization),
      },
      {
        title: this._moduleService.getI18N(ModuleName.Curricula),
        path:
          this._moduleService.getSidenavOptions(ModuleName.Curricula)[0]
            ?.path || this._moduleService.getPath(ModuleName.Curricula),
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
          this.themeClass = _moduleService.getThemeCssClass(moduleName);
          this.sidenavOptions = _moduleService.getSidenavOptions(moduleName);
          this.activeOption = this.sidenavOptions.find(option =>
            currentPath.startsWith(option.path)
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
}
