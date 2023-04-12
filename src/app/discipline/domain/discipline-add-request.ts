import { Category } from 'src/app/category/domain/category';

export interface DisciplineAddRequest {
  name: string;
  shortName: string;
  tags?: Category[];
}
