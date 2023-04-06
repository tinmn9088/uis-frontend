export interface Category {
  id: number;
  name: string;
  parent?: { id: number };
  hasChildren: boolean;
}
