import { Injectable } from '@angular/core';
import { ModuleName } from '../enums/module-name.enum';
import Modules from 'src/assets/modules.json';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  getThemeCssClass(name: ModuleName): string {
    const conf = this.getModule(name);
    return conf.themeCssClass;
  }

  getThemeCssClassByUrl(url: string): string | undefined {
    const modules = this.getAllModules();
    for (const module of modules) {
      if (url.startsWith('/' + module.path)) {
        return module.themeCssClass;
      }
    }
    return;
  }

  getI18N(name: ModuleName): string {
    const conf = this.getModule(name);
    return conf.i18nName;
  }

  getPath(name: ModuleName): string {
    const conf = this.getModule(name);
    return conf.path;
  }

  getAllModules() {
    const names = Object.values(ModuleName)
      .filter(key => isNaN(Number(key)))
      .map(key => key as ModuleName);
    const modules = [];
    for (const name of names) {
      modules.push(this.getModule(name));
    }
    return modules;
  }

  getModule(name: ModuleName) {
    return Modules[name];
  }
}
