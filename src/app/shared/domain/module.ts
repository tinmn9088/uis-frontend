import { ModuleSidenavOption } from './module-sidenav-option';

export interface Module {
  name?: string;
  path?: string;
  themeCssClass?: string;
  i18nName?: string;
  sidenavAddButtonPath?: string;
  sidenavOptions?: ModuleSidenavOption[];
}
