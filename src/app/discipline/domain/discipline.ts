import { Category } from 'src/app/category/domain/category';

export interface Discipline {
  id: number;
  name: string;
  shortName: string;
  tags: Category[];
}
