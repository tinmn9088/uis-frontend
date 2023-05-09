import { Injectable } from '@angular/core';
import { ModuleName } from '../domain/module-name';
import Modules from 'src/assets/modules.json';
import { ModuleOption } from '../domain/module-option';
import { Module } from '../domain/module';
import { Permission } from 'src/app/auth/domain/permission';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  getMainPagePath(): string {
    return Modules.mainPage.path;
  }

  getI18nGroupName(name: ModuleName): string | undefined {
    const module = this.getModule(name);
    return module.i18nGroupName;
  }

  getAllI18nGroupNames(): string[] {
    const names = this.getAllModuleNames();
    const groupNames: string[] = [];
    for (const name of names) {
      const groupName = this.getModule(name).i18nGroupName;
      if (groupName) groupNames.push();
    }
    return groupNames;
  }

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

  /**
   * @returns required permissions for module only
   */
  getRequiredPermissions(name: ModuleName): Permission[] {
    const module = this.getModule(name);
    return module.requiredPermissions;
  }

  /**
   * @returns required permissions for module and options
   */
  getAllRequiredPermissions(name: ModuleName): Permission[] {
    const module = this.getModule(name);
    const allRequiredPermissions = new Set(module.requiredPermissions);
    module.options?.map(option =>
      option.requiredPermissions.forEach(permission =>
        allRequiredPermissions.add(permission)
      )
    );
    return [...allRequiredPermissions];
  }

  getSidenavAddButtonPath(name: ModuleName): string | undefined {
    const module = this.getModule(name);
    return module.sidenavAddButtonPath;
  }

  getOptions(name: ModuleName): ModuleOption[] | undefined {
    const module = this.getModule(name);
    return module.options;
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
    return Modules[name] as Module;
  }

  getAllModuleNames(): ModuleName[] {
    return Object.values(ModuleName)
      .filter(key => isNaN(Number(key)))
      .map(key => key as ModuleName);
  }
}
