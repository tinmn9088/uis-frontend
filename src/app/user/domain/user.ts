import { Role } from './role';

export interface User {
  id: number;
  username: string;
  roles: Role[];
  lastActivity?: Date;
  creationTime?: Date;
  avatar?: string;
}
