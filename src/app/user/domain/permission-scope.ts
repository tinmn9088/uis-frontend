import { PermissionAction } from './permission-action';

export interface PermissionScope {
  scope: string;
  actions: PermissionAction[];
}
