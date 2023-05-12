import { PermissionRequiring } from 'src/app/auth/domain/permission-requiring';
import { ModuleOption } from './module-option';

export interface Module extends PermissionRequiring {
  name?: string;
  path?: string;
  themeCssClass?: string;
  i18nName?: string;
  i18nGroupName?: string;
  options?: ModuleOption[];
}
