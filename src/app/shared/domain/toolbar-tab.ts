import { PermissionRequiring } from 'src/app/auth/domain/permission-requiring';

export interface ToolbarTab extends PermissionRequiring {
  title: string;
  path: string;
}
