import { PermissionRequiring } from 'src/app/auth/domain/permission-requiring';
import { ModuleOptionType } from './module-option-type';

export interface ModuleOption extends PermissionRequiring {
  title: string;
  path: string;
  pathRegex?: string;
  type: ModuleOptionType;
  groupId?: number;
}
