import { Injectable } from '@angular/core';
import { ModuleName } from '../domain/module-name';
import Modules from 'src/assets/modules.json';
import { ModuleOption } from '../domain/module-option';
import { Module } from '../domain/module';
import { Permission } from 'src/app/auth/domain/permission';
import { ModuleOptionType } from '../domain/module-option-type';

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

  getOptions(name: ModuleName): ModuleOption[] | undefined {
    const module = this.getModule(name);
    return module.options;
  }

  /**
   * @returns path of first option with type {@link ModuleOptionType.Create}.
   */
  getCreateOption(name: ModuleName): ModuleOption | undefined {
    return this.getOptions(name)?.find(
      option => option.type === ModuleOptionType.Create
    );
  }

  getCreateOptions(): ModuleOption[] {
    return this.getAllModules()
      .flatMap(module => module.options || [])
      .filter(option => option.type === ModuleOptionType.Create);
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
