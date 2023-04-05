import { Injectable } from '@angular/core';
import { ModuleName } from '../domain/module-name';
import Modules from 'src/assets/modules.json';
import { ModuleSidenavOption } from '../domain/module-sidenav-option';
import { Module } from '../domain/module';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  getThemeCssClass(name: ModuleName): string | undefined {
    const module = this.getModule(name);
    return module.themeCssClass;
  }

  getAllThemeCssClasses(): string[] {
    const names = this.getAllModuleNames();
    const classes = [];
    for (const name of names) {
      const module = this.getModule(name);
      if (module.themeCssClass) {
        classes.push(this.getModule(name).themeCssClass);
      }
    }
    return classes as string[];
  }

  getI18N(name: ModuleName): string | undefined {
    const module = this.getModule(name);
    return module.i18nName;
  }

  getPath(name: ModuleName): string | undefined {
    const module = this.getModule(name);
    return module.path;
  }

  getSidenavAddButtonPath(name: ModuleName): string | undefined {
    const module = this.getModule(name);
    return module.sidenavAddButtonPath;
  }

  getSidenavOptions(name: ModuleName): ModuleSidenavOption[] | undefined {
    const module = this.getModule(name);
    return module.sidenavOptions;
  }

  getAllModules(): Module[] {
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
      const module = this.getModule(name);
      if (module.path && path.startsWith(module.path)) {
        return name;
      }
    }
    return;
  }

  getModule(name: ModuleName): Module {
    return Modules[name];
  }

  getAllModuleNames(): ModuleName[] {
    return Object.values(ModuleName)
      .filter(key => isNaN(Number(key)))
      .map(key => key as ModuleName);
  }
}
