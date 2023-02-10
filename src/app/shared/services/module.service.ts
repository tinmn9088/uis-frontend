import { Injectable } from '@angular/core';
import { ModuleName } from '../domain/module-name';
import Modules from 'src/assets/modules.json';
import { ModuleSidenavOption } from '../domain/module-sidenav-option';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  getThemeCssClass(name: ModuleName): string {
    const module = this.getModule(name);
    return module.themeCssClass;
  }

  getI18N(name: ModuleName): string {
    const module = this.getModule(name);
    return module.i18nName;
  }

  getPath(name: ModuleName): string {
    const module = this.getModule(name);
    return module.path;
  }

  getSidenavOptions(name: ModuleName): ModuleSidenavOption[] {
    const module = this.getModule(name);
    return module.sidenavOptions;
  }

  getAllModules() {
    const names = this.getAllModuleNames();
    const modules = [];
    for (const name of names) {
      modules.push(this.getModule(name));
    }
    return modules;
  }

  getModuleNameByPath(path: string): ModuleName | undefined {
    const names = this.getAllModuleNames();
    for (const name of names) {
      if (path.startsWith('/' + this.getModule(name).path)) {
        return name;
      }
    }
    return;
  }

  getModule(name: ModuleName) {
    return Modules[name];
  }

  getAllModuleNames(): ModuleName[] {
    return Object.values(ModuleName)
      .filter(key => isNaN(Number(key)))
      .map(key => key as ModuleName);
  }
}
