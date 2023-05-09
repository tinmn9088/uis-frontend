import { PermissionRequiring } from 'src/app/auth/domain/permission-requiring';

export interface ModuleOption extends PermissionRequiring {
  title: string;
  path: string;
  pathRegex?: string;
  groupId?: number;
}
