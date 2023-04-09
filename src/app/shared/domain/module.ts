import { PermissionRequiring } from 'src/app/auth/domain/permission-requiring';
import { ModuleSidenavOption } from './module-sidenav-option';

export interface Module extends PermissionRequiring {
  name?: string;
  path?: string;
  themeCssClass?: string;
  i18nName?: string;
  sidenavAddButtonPath?: string;
  sidenavOptions?: ModuleSidenavOption[];
}
