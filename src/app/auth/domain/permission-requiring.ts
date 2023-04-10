import { Permission } from './permission';

export interface PermissionRequiring {
  requiredPermissions: Permission[];
}
